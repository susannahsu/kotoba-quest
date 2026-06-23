// The walkable overworld: tilemap + collision, animated player movement, camera,
// and interactables — NPCs (talk), signs (read a word), item pickups (auto-capture),
// and enemies (battle). Talks to the React UI via `bus`.
import Phaser from 'phaser';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { audio } from '@/systems/audio/audio';
import { roxyIntro } from '@/content/dialogue/roxy-intro';
import { roxyAgainLines, sylphieLines } from '@/content/dialogue/extra';
import { getVocab } from '@/content/vocab/n5-starter';
import {
  COLLIDE,
  ENEMIES,
  ITEMS,
  MAP_H,
  MAP_W,
  NPCS,
  SIGNS,
  SPAWN,
  TILE,
  TILE_TEXTURE,
  buildVillage,
  type EnemyPlacement,
  type NpcPlacement,
} from '../maps/village';

const SPEED = 156;
const INTERACT_DIST = 56;
const PICKUP_DIST = 26;

type Facing = 'down' | 'up' | 'side';
interface Interactable {
  x: number;
  y: number;
  label: string;
  act: () => void;
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private facing: Facing = 'down';
  private locked = false;
  private cleanups: Array<() => void> = [];

  private npcSprites: { placement: NpcPlacement; sprite: Phaser.GameObjects.Image }[] = [];
  private signSprites: { vocabId: string; sprite: Phaser.GameObjects.Image }[] = [];
  private itemSprites: { id: string; vocabId: string; sprite: Phaser.GameObjects.Image }[] = [];
  private enemySprites = new Map<string, { enemyId: string; sprite: Phaser.GameObjects.Image }>();
  private roxyMark?: Phaser.GameObjects.Text;

  constructor() {
    super('world');
  }

  create() {
    this.locked = false;
    this.facing = 'down';
    this.npcSprites = [];
    this.signSprites = [];
    this.itemSprites = [];
    this.enemySprites = new Map();

    this.buildMap();

    this.player = this.physics.add.sprite(SPAWN.x, SPAWN.y, 'rudeus_down_0');
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(14, 10).setOffset(9, 27);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(SPAWN.y);
    this.physics.add.collider(this.player, this.obstacles);

    this.placeNpcs();
    this.placeSigns();
    this.placeItems();
    this.refreshEnemies();

    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(2);

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
          if (this.roxyMark) this.roxyMark.setVisible(false);
          bus.emit('toast', { text: 'A Mana Beast appeared nearby! And the forest holds more…', tone: 'bad' });
        }
      }),
      bus.on('battle:end', ({ won, instanceId }) => {
        this.locked = false;
        if (won && instanceId) {
          useGame.getState().setFlag(`enemy_${instanceId}`);
          const e = this.enemySprites.get(instanceId);
          e?.sprite.destroy();
          this.enemySprites.delete(instanceId);
        } else if (!won) {
          this.player.setPosition(SPAWN.x, SPAWN.y);
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

  private buildMap() {
    const map = buildVillage();
    this.obstacles = this.physics.add.staticGroup();
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const code = map[y][x];
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
    for (const placement of NPCS) {
      const pos = { x: placement.tx * TILE + TILE / 2, y: placement.ty * TILE + TILE / 2 };
      const sprite = this.add.image(pos.x, pos.y, placement.sprite).setDepth(pos.y);
      this.npcSprites.push({ placement, sprite });
      if (placement.kind === 'lesson') {
        this.roxyMark = this.add
          .text(pos.x, pos.y - 30, '！', { fontSize: '16px', color: '#ffd56b' })
          .setOrigin(0.5)
          .setDepth(100000)
          .setVisible(!useGame.getState().flags.roxyIntroDone);
      } else {
        const mark = this.add
          .text(pos.x, pos.y - 30, '💬', { fontSize: '14px' })
          .setOrigin(0.5)
          .setDepth(100000);
        this.tweens.add({ targets: mark, y: pos.y - 34, yoyo: true, repeat: -1, duration: 700 });
      }
    }
  }

  private placeSigns() {
    for (const s of SIGNS) {
      const x = s.tx * TILE + TILE / 2;
      const y = s.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, 'sign').setDepth(y);
      this.signSprites.push({ vocabId: s.vocabId, sprite });
    }
  }

  private placeItems() {
    const flags = useGame.getState().flags;
    for (const it of ITEMS) {
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
    const spawn = (p: EnemyPlacement) => {
      if (this.enemySprites.has(p.id)) return;
      if (flags[`enemy_${p.id}`]) return;
      if (p.requiresFlag && !flags[p.requiresFlag]) return;
      const x = p.tx * TILE + TILE / 2;
      const y = p.ty * TILE + TILE / 2;
      const sprite = this.add.image(x, y, 'beast').setDepth(y);
      this.tweens.add({ targets: sprite, y: y - 4, yoyo: true, repeat: -1, duration: 700 });
      this.enemySprites.set(p.id, { enemyId: p.enemyId, sprite });
    };
    ENEMIES.forEach(spawn);
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
        if (placement.kind === 'lesson') {
          const done = useGame.getState().flags.roxyIntroDone;
          bus.emit('dialogue:start', {
            lines: done ? roxyAgainLines : roxyIntro,
            tag: done ? 'roxy-again' : 'roxy-intro',
          });
        } else {
          bus.emit('dialogue:start', { lines: sylphieLines, tag: 'sylphie' });
        }
      });
    }
    for (const { vocabId, sprite } of this.signSprites) {
      consider(sprite.x, sprite.y, '📖 Space: Read', () => {
        this.lock();
        bus.emit('word:show', { vocabId });
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
