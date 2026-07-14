import { Telegraf } from 'telegraf';

export const setupMiddlewares = (bot: Telegraf<any>) => {

  bot.action('admin_set_card', (ctx) => ctx.scene.enter('ADMIN_CARD'));
  bot.action('admin_set_prices', (ctx) => ctx.scene.enter('ADMIN_PRICE'));
  bot.action('admin_add_api', (ctx) => ctx.scene.enter('ADMIN_API'));

  bot.hears('💰 Hamyon (Hisobni to\'ldirish)', (ctx) => {
    ctx.scene.enter('PAYMENT_SCENE');
  });

  bot.hears('📝 Referat/Esse yozish', (ctx) => {
    ctx.scene.enter('ESSAY_SCENE');
  });

  bot.hears('📥 Video/Rasm yuklash', async (ctx) => {
    await ctx.reply('Sizga RapidAPI dan "All in one Video Downloader" api si kerak bo\'ladi. Shu joyga axios orqali zapros yoziladi. Hozircha bu stub funksiya.');
  });

  bot.hears('📄 PDF tahlil', async (ctx) => {
    await ctx.reply('PDF dan matn ajratib olish uchun "pdf-parse" npm paketini o\'rnating va OpenRouter ga tashlang. \nTez orada bu funksiya to\'liq yoziladi.');
  });

  bot.hears('🎙 Audio/Video Transkript', async (ctx) => {
    await ctx.reply('OpenAI Whisper yoki OpenRouter ning moslashuvchan modellariga faylni jo\'natish orqali amalga oshiriladi.');
  });
};
