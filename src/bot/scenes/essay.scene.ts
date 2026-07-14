import { Scenes } from 'telegraf';
import { generateEssay } from '../../services/ai.service.js';
import { getOrCreateUser, addBalance } from '../../services/db.service.js';

export const essayScene = new Scenes.BaseScene<any>('ESSAY_SCENE');

const ESSAY_COST = 5; // 5 Coin

essayScene.enter(async (ctx) => {
  const user = await getOrCreateUser(ctx.from?.id.toString() || '', '');
  if (user.balance < ESSAY_COST) {
    await ctx.reply(`❌ Balansingizda yetarli Coin yo'q. Referat yozish narxi: ${ESSAY_COST} Coin.\nHisobingizni to'ldiring.`);
    return ctx.scene.leave();
  }
  await ctx.reply('📝 Referat yoki Esse mavzusini batafsil yozib yuboring (Yoki bekor qilish uchun /cancel bosing):');
});

essayScene.command('cancel', async (ctx) => {
  await ctx.reply('Bekor qilindi.');
  return ctx.scene.leave();
});

essayScene.on('text', async (ctx) => {
  await ctx.reply('Yozilmoqda, iltimos kuting... ⏳\n(Bu biroz vaqt olishi mumkin)');
  
  const result = await generateEssay(ctx.message.text);
  
  // Coin ayirish
  await addBalance(ctx.from.id.toString(), -ESSAY_COST);

  // Javobni jo'natish
  // Agar juda uzun bo'lsa telegraf error berishi mumkin, shuning uchun bo'lib jo'natish yoki fayl qilish kerak
  // Hozircha oddiy matn
  try {
    await ctx.reply(result || 'Noma\'lum xatolik');
  } catch (e) {
    await ctx.reply('Javob juda uzun bo\'ldi. (Buni PDF qilib jo\'natish imkoniyatini qo\'shish mumkin)');
  }
  
  return ctx.scene.leave();
});
