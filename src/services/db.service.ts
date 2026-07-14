import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

let supabase: any = null;

export const initDb = async () => {
  if (config.supabaseUrl && config.supabaseKey && config.supabaseKey !== 'your-anon-key') {
    supabase = createClient(config.supabaseUrl, config.supabaseKey);
    console.log('✅ Supabase bazasiga ulanish muvaffaqiyatli.');
  } else {
    console.warn('⚠️ Supabase sozlanmagan. Baza ishlamaydi. .env faylini to\'g\'rilang.');
  }
};

export const getSupabase = () => supabase;

// Foydalanuvchini olish yoki yaratish
export const getOrCreateUser = async (telegramId: string, username: string) => {
  if (!supabase) return { id: telegramId, balance: 0 }; // Mock
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (data) return data;

  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([{ telegram_id: telegramId, username, balance: 0 }])
    .select()
    .single();

  if (insertError) {
    console.error('User yaratishda xato:', insertError);
    return { id: telegramId, balance: 0 };
  }
  return newUser;
};

// Balansni yangilash
export const addBalance = async (telegramId: string, amount: number) => {
  if (!supabase) return;
  const user = await getOrCreateUser(telegramId, '');
  await supabase
    .from('users')
    .update({ balance: user.balance + amount })
    .eq('telegram_id', telegramId);
};

// Sozlamalarni olish (masalan karta raqami)
export const getSetting = async (key: string) => {
  if (!supabase) return null;
  const { data } = await supabase.from('bot_settings').select('value').eq('key', key).single();
  return data?.value || null;
};

export const setSetting = async (key: string, value: string) => {
  if (!supabase) return;
  const { data } = await supabase.from('bot_settings').select('id').eq('key', key).single();
  if (data) {
    await supabase.from('bot_settings').update({ value }).eq('key', key);
  } else {
    await supabase.from('bot_settings').insert([{ key, value }]);
  }
};
