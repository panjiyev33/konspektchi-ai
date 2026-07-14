import { Scenes } from 'telegraf';
import { setSetting, getSetting } from '../../services/db.service.js';

export const adminCardScene = new Scenes.BaseScene<any>('ADMIN_CARD');
adminCardScene.enter(async (ctx) => {
  await ctx.reply('Yangi karta raqami va egasini quyidagi formatda yuboring:\n`8600123456789012, ESHMATOV TOSHMAT`\n\nBekor qilish uchun /cancel', { parse_mode: 'Markdown' });
});
adminCardScene.command('cancel', async (ctx) => { ctx.reply('Bekor qilindi'); return ctx.scene.leave(); });
adminCardScene.on('text', async (ctx) => {
  const parts = ctx.message.text.split(',');
  if (parts.length >= 2) {
    await setSetting('card_number', parts[0].trim());
    await setSetting('card_name', parts[1].trim());
    await ctx.reply('✅ Karta ma\'lumotlari saqlandi.');
  } else {
    await ctx.reply('Noto\'g\'ri format.');
  }
  return ctx.scene.leave();
});

export const adminPriceScene = new Scenes.BaseScene<any>('ADMIN_PRICE');
adminPriceScene.enter(async (ctx) => {
  await ctx.reply('Yangi narxlarni yuboring (masalan:\n1000 UZS = 10 Coin\n5000 UZS = 60 Coin):\n\nBekor qilish uchun /cancel');
});
adminPriceScene.command('cancel', async (ctx) => { ctx.reply('Bekor qilindi'); return ctx.scene.leave(); });
adminPriceScene.on('text', async (ctx) => {
  await setSetting('prices', ctx.message.text);
  await ctx.reply('✅ Narxlar saqlandi.');
  return ctx.scene.leave();
});

export const adminApiScene = new Scenes.BaseScene<any>('ADMIN_API');
adminApiScene.enter(async (ctx) => {
  await ctx.reply('OpenRouter API kalitini yuboring:\n\nBekor qilish uchun /cancel');
});
adminApiScene.command('cancel', async (ctx) => { ctx.reply('Bekor qilindi'); return ctx.scene.leave(); });
adminApiScene.on('text', async (ctx) => {
  const newKey = ctx.message.text.trim();
  const keysStr = await getSetting('openrouter_keys');
  let keys = [];
  if (keysStr) keys = JSON.parse(keysStr);
  keys.push(newKey);
  await setSetting('openrouter_keys', JSON.stringify(keys));
  await ctx.reply('✅ API kalit qo\'shildi!');
  return ctx.scene.leave();
});
