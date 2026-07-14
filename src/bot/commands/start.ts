import { Context, Markup } from 'telegraf';
import { getOrCreateUser } from '../../services/db.service.js';

export const startCommand = async (ctx: Context) => {
  const telegramId = ctx.from?.id.toString();
  const username = ctx.from?.username || ctx.from?.first_name || 'Foydalanuvchi';
  
  if (telegramId) {
    await getOrCreateUser(telegramId, username);
  }

  const menu = Markup.keyboard([
    ['📥 Video/Rasm yuklash', '📝 Referat/Esse yozish'],
    ['📄 PDF tahlil', '🎙 Audio/Video Transkript'],
    ['💰 Hamyon (Hisobni to\'ldirish)']
  ]).resize();

  await ctx.reply(`Salom ${username}! Botga xush kelibsiz.\n\nKerakli xizmatni tanlang:`, menu);
};
