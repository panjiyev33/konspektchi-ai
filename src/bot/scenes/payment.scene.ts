import { Scenes, Markup } from 'telegraf';
import { getSetting, getOrCreateUser, addBalance } from '../../services/db.service.js';
import { verifyReceipt } from '../../services/ai.service.js';
import { config } from '../../config.js';

export const paymentScene = new Scenes.BaseScene<any>('PAYMENT_SCENE');

paymentScene.enter(async (ctx) => {
  const telegramId = ctx.from?.id.toString();
  if (!telegramId) return ctx.scene.leave();

  const user = await getOrCreateUser(telegramId, '');
  const prices = await getSetting('prices') || '1000 UZS = 10 Coin\n5000 UZS = 60 Coin';
  const card = await getSetting('card_number') || 'Sozlanmagan';
  const cardName = await getSetting('card_name') || 'Sozlanmagan';

  await ctx.reply(
    `💰 Sizning hisobingiz: ${user.balance} Coin\n\n` +
    `To'lov narxlari:\n${prices}\n\n` +
    `💳 Karta raqami: \`${card}\`\n` +
    `👤 Egasi: ${cardName}\n\n` +
    `To'lovni amalga oshirgandan so'ng, chek rasmini shu yerga yuboring. Bekor qilish uchun /cancel bosing.`,
    { parse_mode: 'Markdown' }
  );
});

paymentScene.command('cancel', async (ctx) => {
  await ctx.reply('To\'lov bekor qilindi.');
  return ctx.scene.leave();
});

paymentScene.on('photo', async (ctx) => {
  await ctx.reply('Chek tekshirilmoqda, iltimos kuting... ⏳');
  
  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Eng katta rasm
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    
    // AI orqali chekni tekshirish
    const result = await verifyReceipt(fileLink.href);

    if (result.isSuspicious) {
      await ctx.reply("CHEKINGIZ SHUBHALI TUYULGANI UCHUN UNI ADMINGA JO'NATDIK VA ADMIN UZOG'I 10 MINUTDA ISHINGIZNI HAL QILADI");
      // Adminga jo'natish
      for (const admin of config.admins) {
        await ctx.telegram.sendPhoto(admin, photo.file_id, {
          caption: `⚠️ Shubhali chek!\nFoydalanuvchi: ${ctx.from.id} (@${ctx.from.username})\nTasdiqlash uchun inline tugmadan foydalaning (Dasturlash kerak).`
        });
      }
    } else {
      // 100 UZS = 1 Coin (misol uchun)
      const coins = Math.floor(result.amount / 100);
      await addBalance(ctx.from.id.toString(), coins);
      await ctx.reply(`✅ To'lov muvaffaqiyatli tasdiqlandi!\nSizga ${coins} Coin qo'shildi.`);
    }
  } catch (error) {
    console.error(error);
    await ctx.reply('Xatolik yuz berdi. Iltimos keyinroq urinib ko\'ring yoki adminga murojaat qiling.');
  }

  return ctx.scene.leave();
});

paymentScene.on('message', async (ctx) => {
  await ctx.reply('Iltimos, chek rasmini yuboring yoki /cancel bosing.');
});
