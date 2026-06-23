// Generates all placeholder art procedurally (original geometry — no ripped assets).
// Swap these for CC0 sprite sheets later without changing the rest of the game.
import Phaser from 'phaser';
import { TILE } from '../maps/village';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    this.makeTiles();
    this.makeChar('rudeus', 0x8a5a3c, 0x4a2f1e, 0xe8c9a0);
    this.makeRoxy();
    this.makeBeast();
    this.scene.start('world');
  }

  private makeTiles() {
    const g = this.add.graphics();

    // grass
    g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0x478a58, 1).fillRect(5, 6, 3, 3).fillRect(20, 18, 3, 3).fillRect(12, 24, 2, 2);
    g.generateTexture('grass', TILE, TILE);
    g.clear();

    // path
    g.fillStyle(0xb9a06b, 1).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0xa8905c, 1).fillRect(6, 8, 4, 3).fillRect(18, 20, 5, 3).fillRect(24, 6, 3, 3);
    g.generateTexture('path', TILE, TILE);
    g.clear();

    // water
    g.fillStyle(0x3a6ea5, 1).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0x4f86c6, 1).fillRect(0, 6, TILE, 4);
    g.fillStyle(0x6fa3df, 1).fillRect(0, 19, TILE, 3);
    g.generateTexture('water', TILE, TILE);
    g.clear();

    // tree (grass base + trunk + canopy)
    g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0x5a3a26, 1).fillRect(14, 20, 4, 9);
    g.fillStyle(0x2f6b3f, 1).fillCircle(16, 13, 11);
    g.fillStyle(0x3a824d, 1).fillCircle(11, 11, 6).fillCircle(21, 12, 5);
    g.generateTexture('tree', TILE, TILE);
    g.clear();

    // flower (grass base + blossoms)
    g.fillStyle(0x3f7d4f, 1).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0xffd56b, 1).fillCircle(16, 16, 3);
    g.fillStyle(0xff7aa2, 1).fillCircle(10, 20, 2).fillCircle(22, 12, 2);
    g.generateTexture('flower', TILE, TILE);
    g.clear();

    g.destroy();
  }

  /** A simple chibi: shadow, coat body, head, hair, eyes. */
  private makeChar(key: string, coat: number, hair: number, skin: number) {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.25).fillEllipse(16, 33, 18, 6);
    g.fillStyle(coat, 1).fillRoundedRect(8, 18, 16, 14, 5);
    g.fillStyle(skin, 1).fillCircle(16, 13, 8);
    g.fillStyle(hair, 1).fillCircle(16, 10, 8).fillRect(8, 8, 16, 3);
    g.fillStyle(0x2a2030, 1).fillCircle(13, 14, 1.5).fillCircle(19, 14, 1.5);
    g.generateTexture(key, 32, 36);
    g.destroy();
  }

  private makeRoxy() {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.25).fillEllipse(16, 33, 18, 6);
    g.fillStyle(0xdfe7ff, 1).fillRoundedRect(7, 18, 18, 14, 5); // robe
    g.fillStyle(0x9fc0ff, 1).fillCircle(16, 11, 8).fillRect(8, 11, 16, 11); // hair
    g.fillStyle(0xf0c9a0, 1).fillCircle(16, 14, 6.5); // face
    g.fillStyle(0x2a2030, 1).fillCircle(13, 14, 1.5).fillCircle(19, 14, 1.5);
    g.fillStyle(0x37508c, 1).fillRect(5, 10, 22, 3); // hat brim
    g.fillStyle(0x4664b0, 1).fillTriangle(16, 1, 7, 11, 25, 11); // hat cone
    g.generateTexture('roxy', 32, 36);
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
}
