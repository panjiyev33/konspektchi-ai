import OpenAI from 'openai';
import { getSetting, setSetting } from './db.service.js';
import { bot } from '../bot/index.js';
import { config } from '../config.js';

let openai: OpenAI | null = null;
let currentKeyIndex = 0;

export const initOpenAi = async () => {
  const keysStr = await getSetting('openrouter_keys');
  if (!keysStr) return;
  
  const keys = JSON.parse(keysStr);
  if (keys.length > 0) {
    openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: keys[currentKeyIndex],
      defaultHeaders: {
        'HTTP-Referer': config.appUrl,
        'X-Title': 'Telegram Bot',
      }
    });
  }
};

const notifyAdminLimitReached = async () => {
  for (const admin of config.admins) {
    try {
      await bot.telegram.sendMessage(admin, `⚠️ OpenRouter API kaliti tugadi. Keyingisiga o'tilyapti yoki kalitlar qolmagan.`);
    } catch(e) {}
  }
};

const rotateKey = async () => {
  const keysStr = await getSetting('openrouter_keys');
  if (!keysStr) return false;
  const keys = JSON.parse(keysStr);
  
  currentKeyIndex++;
  if (currentKeyIndex >= keys.length) {
    await notifyAdminLimitReached();
    currentKeyIndex = 0; // Orqaga qaytish yoki xato berish
    return false;
  }
  await notifyAdminLimitReached();
  await initOpenAi();
  return true;
};

// Chekni tekshirish (Vision Model kerak bo'ladi, lekin OpenRouter da ba'zi modellar bepul va vision ga ega)
export const verifyReceipt = async (imageUrl: string): Promise<{ isSuspicious: boolean, amount: number }> => {
  if (!openai) await initOpenAi();
  if (!openai) throw new Error('API Keys sozlanmagan');

  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-pro-vision", // Yoki boshqa vision model
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Bu chekni tahlil qil. Bu to'lov chekimi? Agar shubhali bo'lsa (yoki chek bo'lmasa) isSuspicious: true qaytar. Agar to'g'ri bo'lsa, summani aniqla. Natijani JSON formatda qaytar: {\"isSuspicious\": boolean, \"amount\": number}" },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ]
    });

    const text = response.choices[0].message.content || '{}';
    // JSON qilib parse qilish
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    if (error?.status === 429) {
      const rotated = await rotateKey();
      if (rotated) return verifyReceipt(imageUrl);
    }
    console.error(error);
    return { isSuspicious: true, amount: 0 }; // Xato bo'lsa shubhali deb belgilaymiz
  }
};

export const generateEssay = async (prompt: string) => {
  if (!openai) await initOpenAi();
  if (!openai) return 'Xizmat hozircha ishlamayapti.';

  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-pro",
      messages: [{ role: "user", content: `Foydalanuvchi talabasi uchun zo'r referat/esse yozib ber. Mavzu: ${prompt}` }]
    });
    return response.choices[0].message.content;
  } catch (error: any) {
    if (error?.status === 429) {
      await rotateKey();
      return generateEssay(prompt);
    }
    return 'Xatolik yuz berdi.';
  }
};
