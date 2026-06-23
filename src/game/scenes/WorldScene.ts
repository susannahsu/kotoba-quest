// The walkable overworld: tile rendering + collision, player movement, camera follow,
// the interactable Roxy NPC, and the Mana Beast encounter. Talks to the React UI via `bus`.
import Phaser from 'phaser';
import { bus } from '@/bridge/events';
import { useGame } from '@/state/store';
import { roxyIntro } from '@/content/dialogue/roxy-intro';
import {
  BEAST_POS,
  COLLIDE,
  MAP_H,
  MAP_W,
  ROXY_POS,
  SPAWN,
  TILE,
  TILE_TEXTURE,
  buildVillage,
} from '../maps/village';

const SPEED = 150;
const INTERACT_DIST = 54;

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private roxy!: Phaser.Physics.Arcade.Image;
  private beast?: Phaser.Physics.Arcade.Image;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private prompt!: Phaser.GameObjects.Text;
  private locked = false;
  private bobTween?: Phaser.Tweens.Tween;
  private cleanups: Array<() => void> = [];

  constructor() {
    super('world');
  }

  create() {
    this.locked = false;
    this.beast = undefined;
    this.bobTween = undefined;
    this.buildMap();

    // player
    this.player = this.physics.add.sprite(SPAWN.x, SPAWN.y, 'rudeus');
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(16, 12).setOffset(8, 22);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(SPAWN.y);
    this.physics.add.collider(this.player, this.obstacles);

    // Roxy
    this.roxy = this.physics.add.staticImage(ROXY_POS.x, ROXY_POS.y, 'roxy').setDepth(ROXY_POS.y);
    this.add
      .text(ROXY_POS.x, ROXY_POS.y - 32, '！', { fontSize: '16px', color: '#ffd56b' })
      .setOrigin(0.5)
      .setDepth(100000);

    // camera + world bounds
    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(2);

    // input
    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.tryInteract());
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => this.tryInteract());

    // interaction prompt
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

    // bus subscriptions
    this.cleanups.push(
      bus.on('dialogue:end', ({ tag }) => {
        this.locked = false;
        if (tag === 'roxy-intro') {
          useGame.getState().setFlag('roxyIntroDone');
          this.spawnBeast();
          bus.emit('toast', {
            text: 'A Mana Beast appears! Walk to it and press Space.',
            tone: 'bad',
          });
        }
      }),
      bus.on('battle:start', () => {
        this.locked = true;
      }),
      bus.on('battle:end', ({ won }) => {
        this.locked = false;
        if (won) {
          this.beast?.destroy();
          this.beast = undefined;
          useGame.getState().setFlag('beast1Defeated');
        } else {
          this.player.setPosition(SPAWN.x, SPAWN.y);
        }
      }),
    );

    // restore world objects when resuming a save
    const st = useGame.getState();
    if (st.flags.roxyIntroDone && !st.flags.beast1Defeated) this.spawnBeast();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanups.forEach((c) => c());
      this.cleanups = [];
    });
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

  private spawnBeast() {
    if (this.beast) return;
    this.beast = this.physics.add.staticImage(BEAST_POS.x, BEAST_POS.y, 'beast').setDepth(BEAST_POS.y);
    this.tweens.add({ targets: this.beast, y: BEAST_POS.y - 4, yoyo: true, repeat: -1, duration: 700 });
  }

  private nearestInteractable(): 'roxy' | 'beast' | null {
    const { x, y } = this.player;
    const st = useGame.getState();
    if (this.beast && Phaser.Math.Distance.Between(x, y, this.beast.x, this.beast.y) < INTERACT_DIST)
      return 'beast';
    if (
      !st.flags.roxyIntroDone &&
      Phaser.Math.Distance.Between(x, y, this.roxy.x, this.roxy.y) < INTERACT_DIST
    )
      return 'roxy';
    return null;
  }

  private tryInteract() {
    if (this.locked || !useGame.getState().started) return;
    const target = this.nearestInteractable();
    if (target === 'roxy') {
      this.locked = true;
      bus.emit('dialogue:start', { lines: roxyIntro, tag: 'roxy-intro' });
    } else if (target === 'beast') {
      bus.emit('battle:start', { enemyId: 'manabeast' });
    }
  }

  update() {
    const started = useGame.getState().started;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.locked || !started) {
      body.setVelocity(0, 0);
      this.stopBob();
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
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);
    if (moving) this.startBob();
    else this.stopBob();

    const target = this.nearestInteractable();
    if (target) {
      const obj = target === 'beast' ? this.beast! : this.roxy;
      this.prompt
        .setText(target === 'beast' ? '⚔ Space: Fight' : '💬 Space: Talk')
        .setPosition(obj.x, obj.y - 24)
        .setVisible(true);
    } else {
      this.prompt.setVisible(false);
    }
  }

  private startBob() {
    if (this.bobTween) return;
    this.bobTween = this.tweens.add({
      targets: this.player,
      scaleY: 0.9,
      yoyo: true,
      repeat: -1,
      duration: 150,
    });
  }

  private stopBob() {
    if (this.bobTween) {
      this.bobTween.stop();
      this.bobTween = undefined;
      this.player.setScale(1);
    }
  }
}
