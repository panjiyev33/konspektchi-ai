import dotenv from 'dotenv';
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  admins: (process.env.ADMINS || '').split(',').map(id => id.trim()),
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  appUrl: process.env.APP_URL || '',
};
