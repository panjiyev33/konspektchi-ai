import { Scenes } from 'telegraf';
import { paymentScene } from './payment.scene.js';
import { adminCardScene, adminPriceScene, adminApiScene } from './admin.scene.js';
import { essayScene } from './essay.scene.js';

export const setupScenes = () => {
  return new Scenes.Stage<any>([
    paymentScene,
    adminCardScene,
    adminPriceScene,
    adminApiScene,
    essayScene
  ]);
};
