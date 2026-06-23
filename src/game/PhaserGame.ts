import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';
import { MAP_H, MAP_W, TILE } from './maps/village';

export function createGame(): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-root',
    width: 960,
    height: 640,
    backgroundColor: '#0c0a12',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [BootScene, WorldScene],
    // hint for our map size; the scene sets real world bounds
    callbacks: {},
    // keep a stable logical size regardless of the map
    render: { antialias: false },
  });
}

export const WORLD_PX = { w: MAP_W * TILE, h: MAP_H * TILE };
