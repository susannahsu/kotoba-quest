// The walkable overworld. Loads any map from the registry, renders tiles + collision,
// animates the player, and handles interactables (NPCs, signs, items, enemies) and
// door/edge transitions between maps. Talks to the React UI via `bus`.
import Phaser from 'phaser';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { audio } from '@/systems/audio/audio';
import { getVocab } from '@/content/vocab/n5-starter';
import { COLLIDE, TILE, TILE_TEXTURE } from '../maps/tiles';
import { getMap } from '../maps';
import type { MapDef, NpcPlacement, SignPlacement, TransitionPlacement } from '../maps/types';

const SPEED = 156;
const INTERACT_DIST = 56;
const PICKUP_DIST = 26;
const ARRIVAL_GRACE = 450;

type Facing = 'down' | 'up' | 'side';
interface SceneData {
  mapId?: string;
  spawn?: { x: number; y: number };
}
interface Interactable {
  x: number;
  y: number;
  label: string;
  act: () => void;
}

export class WorldScene extends Phaser.Scene {
  private map!: MapDef;
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private facing: Facing = 'down';
  private locked = false;
  private arrivedAt = 0;
  private cleanups: Array<() => void> = [];

  private npcSprites: { placement: NpcPlacement; sprite: Phaser.GameObjects.Image }[] = [];
  private signSprites: { placement: SignPlacement; sprite: Phaser.GameObjects.Image }[] = [];
  private itemSprites: { id: string; vocabId: string; sprite: Phaser.GameObjects.Image }[] = [];
  private enemySprites = new Map<string, { enemyId: string; sprite: Phaser.GameObjects.Image }>();

  constructor() {
    super('world');
  }

  create(data: SceneData) {
    this.locked = false;
    this.facing = 'down';
    this.arrivedAt = this.time.now;
    this.npcSprites = [];
    this.signSprites = [];
    this.itemSprites = [];
    this.markers = [];
    this.enemySprites = new Map();

    const mapId = data.mapId ?? useGame.getState().pos.map ?? 'village';
    this.map = getMap(mapId);
    const spawn = data.spawn ?? {
      x: this.map.spawn.tx * TILE + TILE / 2,
      y: this.map.spawn.ty * TILE + TILE / 2,
    };
    useGame.getState().setPos(spawn.x, spawn.y, mapId);

    this.buildTiles();

    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'rudeus_down_0');
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(14, 10).setOffset(9, 27);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(spawn.y);
    this.physics.add.collider(this.player, this.obstacles);

    this.placeNpcs();
    this.placeSigns();
    this.placeItems();
    this.refreshEnemies();

    const wpx = this.map.width * TILE;
    const hpx = this.map.height * TILE;
    this.physics.world.setBounds(0, 0, wpx, hpx);
    this.cameras.main.setBounds(0, 0, wpx, hpx);
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
    this.cameras.main.setZoom(2);
    this.cameras.main.fadeIn(200, 12, 10, 18);

    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.tryInteract());
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => this.tryInteract());

    this.prompt = this.add
      .text(0, 0, '', {
        fontFamily: 'Noto Sans JP, sans-serif',
        fontSize: '11px',
        color: '#ffffff',
        backgroundColor: '#1a1426dd',
        padding: { x: 5, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setDepth(100000)
      .setVisible(false);

    this.cleanups.push(
      bus.on('dialogue:end', ({ tag }) => {
        this.locked = false;
        if (tag === 'roxy-intro') {
          useGame.getState().setFlag('roxyIntroDone');
          this.refreshEnemies();
          this.refreshMarkers();
          bus.emit('toast', {
            text: 'A Mana Beast appeared! And the forest holds more…',
            tone: 'bad',
          });
        }
      }),
      bus.on('battle:end', ({ won, instanceId }) => {
        this.locked = false;
        if (won && instanceId) {
          useGame.getState().setFlag(`enemy_${instanceId}`);
          this.enemySprites.get(instanceId)?.sprite.destroy();
          this.enemySprites.delete(instanceId);
        } else if (!won) {
          this.player.setPosition(spawn.x, spawn.y);
        }
      }),
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanups.forEach((c) => c());
      this.cleanups = [];
    });

    if (import.meta.env.DEV) {
      (window as unknown as { __world?: WorldScene }).__world = this;
    }
  }

  private buildTiles() {
    const grid = this.map.build();
    this.obstacles = this.physics.add.staticGroup();
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const code = grid[y][x];
        this.add.image(x * TILE, y * TILE, TILE_TEXTURE[code]).setOrigin(0).setDepth(0);
        if (COLLIDE.has(code)) {
          const rect = this.add.rectangle(x * TILE + TILE / 2, y * TILE + TILE / 2, TILE, TILE);
          this.physics.add.existing(rect, true);
          this.obstacles.add(rect);
        }
      }
    }
  }

  private placeNpcs() {
    for (const placement of this.map.npcs) {
      const x = placement.tx * TILE + TILE / 2;
      const y = placement.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, placement.sprite).setDepth(y);
      const mark = this.add
        .text(x, y - 30, placement.marker === 'quest' ? '！' : '💬', {
          fontSize: '15px',
          color: '#ffd56b',
        })
        .setOrigin(0.5)
        .setDepth(100000);
      mark.setData('placement', placement);
      this.tweens.add({ targets: mark, y: y - 34, yoyo: true, repeat: -1, duration: 700 });
      this.npcSprites.push({ placement, sprite });
      this.markers.push(mark);
    }
    this.refreshMarkers();
  }

  private markers: Phaser.GameObjects.Text[] = [];
  private refreshMarkers() {
    const flags = useGame.getState().flags;
    for (const mark of this.markers) {
      const p = mark.getData('placement') as NpcPlacement;
      if (p?.marker === 'quest' && p.doneFlag) mark.setVisible(!flags[p.doneFlag]);
    }
  }

  private placeSigns() {
    for (const placement of this.map.signs) {
      const x = placement.tx * TILE + TILE / 2;
      const y = placement.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, placement.sprite ?? 'sign').setDepth(y);
      this.signSprites.push({ placement, sprite });
    }
  }

  private placeItems() {
    const flags = useGame.getState().flags;
    for (const it of this.map.items) {
      if (flags[`item_${it.id}`]) continue;
      const x = it.tx * TILE + TILE / 2;
      const y = it.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, 'item').setDepth(y);
      this.tweens.add({ targets: sprite, y: y - 4, yoyo: true, repeat: -1, duration: 800 });
      this.itemSprites.push({ id: it.id, vocabId: it.vocabId, sprite });
    }
  }

  private refreshEnemies() {
    const flags = useGame.getState().flags;
    for (const p of this.map.enemies) {
      if (this.enemySprites.has(p.id)) continue;
      if (flags[`enemy_${p.id}`]) continue;
      if (p.requiresFlag && !flags[p.requiresFlag]) continue;
      const x = p.tx * TILE + TILE / 2;
      const y = p.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, 'beast').setDepth(y);
      this.tweens.add({ targets: sprite, y: y - 4, yoyo: true, repeat: -1, duration: 700 });
      this.enemySprites.set(p.id, { enemyId: p.enemyId, sprite });
    }
  }

  private lock() {
    this.locked = true;
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }

  private nearest(): Interactable | null {
    const px = this.player.x;
    const py = this.player.y;
    let best: Interactable | null = null;
    let bestD = INTERACT_DIST;
    const consider = (x: number, y: number, label: string, act: () => void) => {
      const d = Phaser.Math.Distance.Between(px, py, x, y);
      if (d < bestD) {
        bestD = d;
        best = { x, y, label, act };
      }
    };

    for (const { placement, sprite } of this.npcSprites) {
      consider(sprite.x, sprite.y, '💬 Space', () => {
        this.lock();
        const done = placement.doneFlag && useGame.getState().flags[placement.doneFlag];
        if (done && placement.afterDialogue) {
          bus.emit('dialogue:start', { lines: placement.afterDialogue, tag: placement.afterTag });
        } else {
          bus.emit('dialogue:start', { lines: placement.dialogue, tag: placement.tag });
        }
      });
    }
    for (const { placement, sprite } of this.signSprites) {
      const label = placement.label ?? (placement.grammar ? '📘 Space' : '📖 Space: Read');
      consider(sprite.x, sprite.y, label, () => {
        if (placement.grammar) {
          bus.emit('grammar:open', undefined);
        } else if (placement.vocabId) {
          this.lock();
          bus.emit('word:show', { vocabId: placement.vocabId });
        }
      });
    }
    for (const [id, { enemyId, sprite }] of this.enemySprites) {
      consider(sprite.x, sprite.y, '⚔ Space: Fight', () => {
        bus.emit('battle:start', { enemyId, instanceId: id });
      });
    }
    return best;
  }

  private tryInteract() {
    if (this.locked || !useGame.getState().started) return;
    this.nearest()?.act();
  }

  private checkTransitions() {
    if (this.time.now - this.arrivedAt < ARRIVAL_GRACE) return;
    for (const t of this.map.transitions) {
      const x = t.tx * TILE + TILE / 2;
      const y = t.ty * TILE + TILE / 2;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < 22) {
        this.transition(t);
        return;
      }
    }
  }

  private transition(t: TransitionPlacement) {
    const spawn = { x: t.toTx * TILE + TILE / 2, y: t.toTy * TILE + TILE / 2 };
    useGame.getState().setPos(spawn.x, spawn.y, t.toMap);
    this.cameras.main.fadeOut(180, 12, 10, 18);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.restart({ mapId: t.toMap, spawn });
    });
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.locked || !useGame.getState().started) {
      body.setVelocity(0, 0);
      this.player.anims.stop();
      this.prompt.setVisible(false);
      return;
    }

    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1;
    const len = Math.hypot(vx, vy) || 1;
    body.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
    this.player.setDepth(this.player.y);

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      if (Math.abs(vx) >= Math.abs(vy)) {
        this.facing = 'side';
        this.player.setFlipX(vx < 0);
      } else {
        this.facing = vy < 0 ? 'up' : 'down';
        this.player.setFlipX(false);
      }
      const key = `rudeus-${this.facing}`;
      if (this.player.anims.currentAnim?.key !== key || !this.player.anims.isPlaying) {
        this.player.anims.play(key, true);
      }
    } else {
      this.player.anims.stop();
      this.player.setTexture(`rudeus_${this.facing}_0`);
    }

    this.checkPickups();
    this.checkTransitions();

    const target = this.nearest();
    if (target) {
      this.prompt.setText(target.label).setPosition(target.x, target.y - 26).setVisible(true);
    } else {
      this.prompt.setVisible(false);
    }
  }

  private checkPickups() {
    const px = this.player.x;
    const py = this.player.y;
    for (let i = this.itemSprites.length - 1; i >= 0; i--) {
      const item = this.itemSprites[i];
      if (Phaser.Math.Distance.Between(px, py, item.sprite.x, item.sprite.y) < PICKUP_DIST) {
        const game = useGame.getState();
        const v = getVocab(item.vocabId);
        const isNew = game.capture(item.vocabId);
        game.setFlag(`item_${item.id}`);
        audio.sfx('capture');
        bus.emit('toast', {
          text: isNew ? `Found ${v?.jp}（${v?.reading}）— learned!` : `Found ${v?.jp} (already known)`,
          tone: 'good',
        });
        item.sprite.destroy();
        this.itemSprites.splice(i, 1);
      }
    }
  }
}
