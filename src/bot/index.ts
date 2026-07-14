import { Telegraf, session, Scenes } from 'telegraf';
import { config } from '../config.js';
import { setupMiddlewares } from './middlewares/index.js';
import { startCommand } from './commands/start.js';
import { adminCommand } from './commands/admin.js';
import { setupScenes } from './scenes/index.js';
import { initDb } from '../services/db.service.js';

export const bot = new Telegraf<any>(config.botToken);

export function startBot() {
  if (!config.botToken || config.botToken === 'BOT_TOKEN_HERE') {
    console.warn('Bot token is missing. Bot is not started.');
    return;
  }

  // Ma'lumotlar bazasini (Supabase) tekshirish/sozlash
  initDb().catch(console.error);

  const stage = setupScenes();

  // Middlewares
  bot.use(session());
  bot.use(stage.middleware());
  setupMiddlewares(bot);

  // Commands
  bot.start(startCommand);
  bot.command('admin', adminCommand);

  // Default handler
  bot.on('message', (ctx) => {
    // Agar foydalanuvchi qandaydir sahnada(scene) bo'lmasa
    if (!ctx.scene?.current) {
      ctx.reply('Bot xizmatlaridan foydalanish uchun menyudan tanlang yoki /start bosing.');
    }
  });

  bot.launch(() => {
    console.log('🤖 Telegram bot ishga tushdi!');
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
