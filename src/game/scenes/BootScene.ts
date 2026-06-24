// Generates all art procedurally (original geometry — no ripped assets) and registers
// the player's walk animations. Characters are designed to read as their canon look:
//  - Rudeus: light-brown hair, green eyes, tan tunic + brown cloak, mole under left eye
//  - Roxy: water-blue waist-length braids, black wizard hat, robe, gem staff (Migurd mage)
//  - Sylphiette: pale-green hair, green tunic
import Phaser from 'phaser';
import { TILE } from '../maps/tiles';

type Facing = 'down' | 'up' | 'side';

interface ChibiOptions {
  facing: Facing;
  frame: number; // 0 stand, 1 stepA, 2 stepB
  skin: number;
  hair: number;
  outfit: number;
  eye: number;
  cloak?: number;
  hat?: number;
  braids?: number;
  staff?: boolean;
  sword?: boolean;
  mole?: boolean;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    this.makeTiles();
    this.makeProps();
    this.makePlayer();
    this.makeNpc('roxy', { skin: 0xf3d3ad, hair: 0x7e9be8, outfit: 0xeaeefb, eye: 0x6f86d6, hat: 0x2b2b3a, braids: 0x7e9be8, staff: true });
    this.makeNpc('sylphie', { skin: 0xf0cda2, hair: 0xbfe3c0, outfit: 0x8fc795, eye: 0x6fae72 });
    this.makeNpc('zenith', { skin: 0xf3d6b0, hair: 0xe2c879, outfit: 0xcf7d96, eye: 0x6f86d6 });
    this.makeNpc('eris', { skin: 0xf0cda2, hair: 0xd64b32, outfit: 0xe8c86b, eye: 0x5fae72 });
    this.makeNpc('ghislaine', { skin: 0x6e4a34, hair: 0xe8e2d0, outfit: 0x6f5436, eye: 0xe8c06b, sword: true });
    this.makeBeast();
    this.registerAnims();
    this.scene.start('world');
  }

  // ---- Tiles -------------------------------------------------------------
  private makeTiles() {
    const g = this.add.graphics();
    const tex = (key: string, draw: () => void) => {
      draw();
      g.generateTexture(key, TILE, TILE);
      g.clear();
    };

    tex('grass', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x478a58, 1).fillRect(5, 6, 3, 3).fillRect(20, 18, 3, 3).fillRect(12, 24, 2, 2);
    });
    tex('dirt', () => {
      g.fillStyle(0x7c6242, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8a6f4d, 1).fillRect(6, 8, 4, 3).fillRect(18, 18, 5, 3);
    });
    tex('path', () => {
      g.fillStyle(0xb9a06b, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0xa8905c, 1).fillRect(6, 8, 4, 3).fillRect(18, 20, 5, 3).fillRect(24, 6, 3, 3);
    });
    tex('water', () => {
      g.fillStyle(0x3a6ea5, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x4f86c6, 1).fillRect(0, 6, TILE, 4);
      g.fillStyle(0x6fa3df, 1).fillRect(0, 19, TILE, 3);
    });
    tex('tree', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x5a3a26, 1).fillRect(14, 20, 4, 9);
      g.fillStyle(0x2f6b3f, 1).fillCircle(16, 13, 11);
      g.fillStyle(0x3a824d, 1).fillCircle(11, 11, 6).fillCircle(21, 12, 5);
    });
    tex('flower', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0xffd56b, 1).fillCircle(16, 16, 3);
      g.fillStyle(0xff7aa2, 1).fillCircle(10, 20, 2).fillCircle(22, 12, 2);
    });
    tex('bush', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x2f6b3f, 1).fillCircle(11, 20, 7).fillCircle(21, 20, 7).fillCircle(16, 16, 8);
      g.fillStyle(0x3a824d, 1).fillCircle(13, 16, 3);
    });
    tex('rock', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8a8f99, 1).fillRoundedRect(6, 12, 20, 14, 6);
      g.fillStyle(0xa3a8b2, 1).fillRoundedRect(9, 13, 9, 6, 3);
    });
    tex('fence', () => {
      g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8a6a45, 1).fillRect(0, 12, TILE, 4).fillRect(0, 22, TILE, 3);
      g.fillStyle(0x6f5436, 1).fillRect(6, 8, 4, 20).fillRect(22, 8, 4, 20);
    });
    tex('house_wall', () => {
      g.fillStyle(0xe4d6b8, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0xcdbd99, 1).fillRect(0, 0, TILE, 2).fillRect(0, 16, TILE, 2);
      g.fillStyle(0xb59d72, 1).fillRect(15, 0, 2, TILE);
    });
    tex('house_roof', () => {
      g.fillStyle(0xa14b3c, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8f3e30, 1).fillRect(0, 10, TILE, 3).fillRect(0, 22, TILE, 3);
      g.fillStyle(0xb9614f, 1).fillRect(0, 0, TILE, 4);
    });
    tex('door', () => {
      g.fillStyle(0xe4d6b8, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x6f4a2c, 1).fillRoundedRect(7, 4, 18, 28, 3);
      g.fillStyle(0x5a3a22, 1).fillRect(10, 8, 12, 24);
      g.fillStyle(0xffd56b, 1).fillCircle(19, 20, 1.6);
    });

    // --- interior tiles ---
    tex('floor', () => {
      g.fillStyle(0x9a7850, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8a6a45, 1).fillRect(0, 10, TILE, 2).fillRect(0, 22, TILE, 2);
      g.fillStyle(0x7a5d3c, 1).fillRect(15, 0, 2, TILE);
    });
    tex('wall_int', () => {
      g.fillStyle(0x5d5068, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x6b5d78, 1)
        .fillRect(1, 1, 14, 7)
        .fillRect(17, 1, 14, 7)
        .fillRect(8, 10, 16, 7)
        .fillRect(1, 19, 14, 7)
        .fillRect(17, 19, 14, 7);
    });
    tex('rug', () => {
      g.fillStyle(0x9a7850, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x8a3b4f, 1).fillRect(2, 2, TILE - 4, TILE - 4);
      g.fillStyle(0xb9556b, 1).fillRect(6, 6, TILE - 12, TILE - 12);
      g.fillStyle(0xe8c06b, 1).fillRect(13, 13, 6, 6);
    });
    tex('table', () => {
      g.fillStyle(0x9a7850, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x6f4a2c, 1).fillRoundedRect(3, 5, 26, 22, 4);
      g.fillStyle(0x8a5e38, 1).fillRect(5, 7, 22, 8);
    });
    tex('shelf', () => {
      g.fillStyle(0x5d5068, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x6f4a2c, 1).fillRect(2, 1, 28, 30);
      g.fillStyle(0x4a3120, 1).fillRect(2, 10, 28, 2).fillRect(2, 20, 28, 2);
      const spines = [0xff7a59, 0x5b8cff, 0x5fbf77, 0xffd56b, 0x9d6bff];
      for (let i = 0; i < 5; i++) {
        g.fillStyle(spines[i], 1).fillRect(4 + i * 5, 2, 4, 7).fillRect(4 + i * 5, 12, 4, 7);
      }
    });
    tex('door_out', () => {
      g.fillStyle(0x9a7850, 1).fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x3a2a1a, 1).fillRoundedRect(6, 2, 20, 28, 3);
      g.fillStyle(0x5a3a22, 1).fillRect(9, 5, 14, 25);
      g.fillStyle(0xffd56b, 1).fillCircle(19, 18, 1.6);
    });

    g.destroy();
  }

  // ---- Props (objects) ---------------------------------------------------
  private makeProps() {
    const g = this.add.graphics();
    // sign post
    g.fillStyle(0x000000, 0.22).fillEllipse(16, 33, 16, 5);
    g.fillStyle(0x6f5436, 1).fillRect(14, 16, 4, 16);
    g.fillStyle(0xb9924f, 1).fillRoundedRect(4, 6, 24, 14, 3);
    g.fillStyle(0x8a6a3c, 1).fillRect(4, 6, 24, 2);
    g.fillStyle(0x5a4326, 1).fillRect(8, 11, 16, 2).fillRect(8, 15, 12, 2);
    g.generateTexture('sign', 32, 36);
    g.clear();
    // pickup item: glowing orb
    g.fillStyle(0xffe46b, 0.25).fillCircle(12, 12, 11);
    g.fillStyle(0xffd24a, 1).fillCircle(12, 12, 6);
    g.fillStyle(0xfff3c4, 1).fillCircle(10, 10, 2.2);
    g.generateTexture('item', 24, 24);
    g.clear();
    g.destroy();
  }

  // ---- Characters --------------------------------------------------------
  private drawChibi(g: Phaser.GameObjects.Graphics, o: ChibiOptions) {
    // shadow
    g.fillStyle(0x000000, 0.25).fillEllipse(16, 37, 18, 5);

    // feet (walk frames)
    let lY = 31;
    let rY = 31;
    if (o.frame === 1) {
      lY = 33;
      rY = 29;
    } else if (o.frame === 2) {
      lY = 29;
      rY = 33;
    }
    g.fillStyle(0x4a3a2a, 1);
    g.fillRoundedRect(10, lY, 5, 6, 2);
    g.fillRoundedRect(17, rY, 5, 6, 2);

    // cloak behind torso
    if (o.cloak !== undefined) g.fillStyle(o.cloak, 1).fillRoundedRect(6, 17, 20, 16, 6);
    // torso
    g.fillStyle(o.outfit, 1).fillRoundedRect(9, 18, 14, 15, 5);

    // braids behind head
    if (o.braids !== undefined) {
      g.fillStyle(o.braids, 1).fillRoundedRect(6, 13, 3, 17, 1.5).fillRoundedRect(23, 13, 3, 17, 1.5);
    }

    // head
    g.fillStyle(o.skin, 1).fillCircle(16, 12, 7.5);

    // hair + face by facing
    if (o.facing === 'up') {
      g.fillStyle(o.hair, 1).fillCircle(16, 11, 8.2).fillRect(8, 11, 16, 7);
    } else if (o.facing === 'side') {
      g.fillStyle(o.hair, 1).fillCircle(16, 9, 8).fillRect(7, 9, 12, 9);
      g.fillStyle(o.eye, 1).fillCircle(20, 13, 1.6);
    } else {
      g.fillStyle(o.hair, 1).fillCircle(16, 9, 8).fillRect(8, 7, 16, 4);
      g.fillStyle(o.eye, 1).fillCircle(13, 13, 1.7).fillCircle(19, 13, 1.7);
      if (o.mole) g.fillStyle(0x7a5436, 1).fillCircle(12, 16, 0.9);
    }

    // wizard hat
    if (o.hat !== undefined) {
      g.fillStyle(o.hat, 1).fillRect(4, 9, 24, 3);
      g.fillStyle(o.hat, 1).fillTriangle(16, 0, 8, 11, 24, 11);
    }

    // staff
    if (o.staff) {
      g.fillStyle(0x6b4a32, 1).fillRect(25, 12, 2, 22);
      g.fillStyle(0x5b8cff, 1).fillCircle(26, 11, 3);
      g.fillStyle(0xbcd3ff, 1).fillCircle(25, 10, 1.2);
    }

    // sword
    if (o.sword) {
      g.fillStyle(0x9aa0ad, 1).fillRect(25, 6, 2, 20);
      g.fillStyle(0xd7dbe2, 1).fillRect(25, 6, 1, 20);
      g.fillStyle(0x6b4a32, 1).fillRect(23, 24, 6, 3);
    }
  }

  private makePlayer() {
    const palette = { skin: 0xf0cda2, hair: 0xb07d4f, outfit: 0xd9c39a, cloak: 0x7a5236, eye: 0x3f8f4f, mole: true };
    const facings: Facing[] = ['down', 'up', 'side'];
    const g = this.add.graphics();
    for (const facing of facings) {
      for (let frame = 0; frame < 3; frame++) {
        this.drawChibi(g, { ...palette, facing, frame });
        g.generateTexture(`rudeus_${facing}_${frame}`, 32, 40);
        g.clear();
      }
    }
    g.destroy();
  }

  private makeNpc(key: string, palette: Omit<ChibiOptions, 'facing' | 'frame'>) {
    const g = this.add.graphics();
    this.drawChibi(g, { ...palette, facing: 'down', frame: 0 });
    g.generateTexture(key, 32, 40);
    g.destroy();
  }

  private makeBeast() {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.25).fillEllipse(19, 35, 26, 7);
    g.fillStyle(0x4a2580, 1)
      .fillTriangle(19, 2, 13, 13, 25, 13)
      .fillTriangle(6, 15, 11, 21, 2, 21)
      .fillTriangle(32, 15, 27, 21, 36, 21);
    g.fillStyle(0x6a3bb0, 1).fillCircle(19, 21, 14);
    g.fillStyle(0x8a5bd0, 1).fillCircle(14, 18, 3.5).fillCircle(24, 18, 3.5);
    g.fillStyle(0xffe46b, 1).fillCircle(14, 21, 3).fillCircle(24, 21, 3);
    g.fillStyle(0x1a1426, 1).fillCircle(14, 21, 1.5).fillCircle(24, 21, 1.5);
    g.fillStyle(0x2a1140, 1).fillRect(13, 28, 12, 3);
    g.generateTexture('beast', 38, 40);
    g.destroy();
  }

  private registerAnims() {
    const dirs: Facing[] = ['down', 'up', 'side'];
    for (const dir of dirs) {
      this.anims.create({
        key: `rudeus-${dir}`,
        frames: [
          { key: `rudeus_${dir}_1` },
          { key: `rudeus_${dir}_0` },
          { key: `rudeus_${dir}_2` },
          { key: `rudeus_${dir}_0` },
        ],
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}
