import { Context, Markup } from 'telegraf';
import { config } from '../../config.js';

export const adminCommand = async (ctx: Context) => {
  const telegramId = ctx.from?.id.toString();
  
  if (!telegramId || !config.admins.includes(telegramId)) {
    return ctx.reply('Sizda admin huquqlari yo\'q.');
  }

  const menu = Markup.inlineKeyboard([
    [Markup.button.callback('💳 Karta raqamini sozlash', 'admin_set_card')],
    [Markup.button.callback('💲 Narxlarni belgilash', 'admin_set_prices')],
    [Markup.button.callback('🔑 OpenRouter API qo\'shish', 'admin_add_api')],
  ]);

  await ctx.reply('🛠 Admin Panelga xush kelibsiz! Nima qilamiz?', menu);
};
