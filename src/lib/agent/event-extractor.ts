import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { DiscoveredEvent } from '@/app/agent/discovery-actions';

export const eventSchema = z.object({
  title: z.string().describe('Название мероприятия, вечеринки или концерта.'),
  description: z.string().describe('Подробное описание мероприятия, список артистов, диджеев, цены и программа.'),
  date_time: z.string().describe('Строгая дата и время начала мероприятия в формате ISO 8601 (например: 2026-03-31T23:00:00). Если год не указан - ставь текущий. Если время начала не указано - ставь 23:00. Обязательно валидный ISO 8601 формат.'),
  location_name: z.string().describe('Название заведения, клуба, пляжа или места (например Papagayo, Tramps, Monkey Beach Club и т.д.).'),
  image_url: z.string().nullable().describe('Абсолютный URL картинки афиши или фото мероприятия. Найди лучший URL среди переданного списка картинок или мета-тегов.'),
});

export async function extractEventsFromText(
  text: string, 
  sourceUrl: string = 'Magic Paste'
): Promise<DiscoveredEvent[]> {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
    });

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        events: z.array(eventSchema).describe('Список найденных мероприятий. Если в тексте упоминается несколько вечеринок, вытащи все.'),
      }),
      prompt: `Тебе предоставлен 'сырой' текст (скопированный с сайта или соцсети), а также ссылки на изображения с этого сайта.
      Твоя задача — извлечь из него все предстоящие мероприятия (анонсы вечеринок, концертов).
      Не придумывай факты. Если нет фото, возвращай null в image_url.
      Обязательно убедись, что дата (date_time) валидна и в формате ISO 8601.
      
      URL Источника: ${sourceUrl}

      Входящие данные:
      ${text.slice(0, 30000)} // Защита от слишком длинного текста
      `
    });

    return object.events.map(e => ({
      title: e.title,
      description: e.description,
      date_time: e.date_time,
      location_name: e.location_name,
      image_url: e.image_url,
      source_url: sourceUrl
    }));
  } catch(err: any) {
    console.error('LLM Extraction Error. Details:', err?.message || err);
    return [];
  }
}
