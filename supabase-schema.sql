-- Ushbu kodni Supabase dagi "SQL Editor" bo'limiga nusxalab tashlang va "Run" tugmasini bosing.

-- 1. Foydalanuvchilar jadvali
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id text UNIQUE NOT NULL,
  username text,
  balance integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bot sozlamalari (adminlar orqali boshqariladi)
CREATE TABLE IF NOT EXISTS public.bot_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Dastlabki narxlarni qo'shish (Majburiy emas, bot orqali ham qo'shish mumkin)
INSERT INTO public.bot_settings (key, value) VALUES 
('prices', '1000 UZS = 10 Coin\n5000 UZS = 60 Coin'),
('openrouter_keys', '[]')
ON CONFLICT (key) DO NOTHING;

-- RLS (Row Level Security) qoidalari - API orqali faqat admin kaliti bilan ishlash uchun
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

-- Anon kalit uchun ham ruxsat berish (Faqat test uchun. Aslida bu xavfsiz emas)
CREATE POLICY "Enable all for anon" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anon on settings" ON public.bot_settings FOR ALL USING (true) WITH CHECK (true);
