# Интеграция с AI моделями для рерайта

## Поддерживаемые модели

### 1. OpenAI GPT-4 / GPT-3.5

**Получение API ключа:**
1. Зарегистрируйтесь на https://platform.openai.com
2. Перейдите в API Keys
3. Создайте новый ключ

**Настройка:**
```env
# .env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview  # или gpt-3.5-turbo

# DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat  # или deepseek-reasoner

# OpenRouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-3-sonnet
```

**Пример интеграции (backend):**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function rewriteWithGPT(text: string, style: string): Promise<string> {
  const prompts = {
    informative: 'Перепиши новость в информативном стиле. Сохрани все факты, добавь структуру с буллетами.',
    engaging: 'Перепиши новость в вовлекающем стиле. Добавь эмоции, эмодзи и CTA в конце.',
    analytical: 'Перепиши новость в аналитическом стиле. Добавь контекст и прогнозы.',
    casual: 'Перепиши новость в разговорном стиле. Используй простой язык.',
    professional: 'Перепиши новость в профессиональном деловом стиле.'
  };

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Ты — профессиональный редактор новостного канала. Твоя задача — переписать новость, сохранив смысл, но адаптировав под стиль канала.'
      },
      {
        role: 'user',
        content: `${prompts[style]}\n\nОригинальный текст:\n${text}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || '';
}
```

---

### 2. Anthropic Claude 3

**Получение API ключа:**
1. Зарегистрируйтесь на https://console.anthropic.com
2. Перейдите в API Keys
3. Создайте новый ключ

**Настройка:**
```env
# .env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229  # или claude-3-sonnet
```

**Пример интеграции:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function rewriteWithClaude(text: string, style: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Перепиши эту новость в ${style} стиле. Сохрани все ключевые факты, но адаптируй тон и структуру.

Оригинал:
${text}

Добавь эмодзи в начале и хештеги в конце.`
    }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

---

### 3. YandexGPT

**Получение API ключа:**
1. Перейдите на https://yandex.cloud
2. Создайте сервисный аккаунт
3. Получите IAM-токен или API-ключ

**Настройка:**
```env
# .env
YANDEX_FOLDER_ID=b1g...
YANDEX_IAM_TOKEN=t1.9euelZq...
YANDEX_MODEL=yandexgpt  # или yandexgpt-lite
```

**Пример интеграции:**
```typescript
async function rewriteWithYandexGPT(text: string, style: string): Promise<string> {
  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.YANDEX_IAM_TOKEN}`,
    },
    body: JSON.stringify({
      modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/${process.env.YANDEX_MODEL}`,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens: 1000,
      },
      messages: [
        {
          role: 'system',
          text: 'Ты — редактор новостного канала. Перепиши новость, сохранив смысл.'
        },
        {
          role: 'user',
          text: `Стиль: ${style}\n\nТекст:\n${text}`
        }
      ]
    })
  });

  const data = await response.json();
  return data.result?.alternatives?.[0]?.message?.text || '';
}
```

---

### 4. GigaChat (Сбер)

**Получение доступа:**
1. Зарегистрируйтесь на https://developers.sber.ru
2. Создайте проект GigaChat
3. Получите клиентские креденшиалы

**Настройка:**
```env
# .env
GIGACHAT_CLIENT_ID=...
GIGACHAT_CLIENT_SECRET=...
GIGACHAT_SCOPE=GIGACHAT_API_PERS
```

**Пример интеграции:**
```typescript
async function getGigaChatToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'RqUID': crypto.randomUUID(),
      'Authorization': `Basic ${credentials}`
    },
    body: `scope=${process.env.GIGACHAT_SCOPE}`
  });

  const data = await response.json();
  return data.access_token;
}

async function rewriteWithGigaChat(text: string, style: string): Promise<string> {
  const token = await getGigaChatToken();

  const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      model: 'GigaChat',
      messages: [
        {
          role: 'system',
          content: 'Ты — профессиональный редактор. Перепиши новость в заданном стиле.'
        },
        {
          role: 'user',
          content: `Стиль: ${style}\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
```

---

### 5. DeepSeek

**Получение API ключа:**
1. Зарегистрируйтесь на https://platform.deepseek.com
2. Перейдите в API Keys
3. Создайте новый ключ

**Особенности:**
- Очень дешёвая альтернатива GPT-4 (в 10-20 раз дешевле)
- Отличное качество для русского языка
- Поддержка длинного контекста (до 64K токенов)
- Модель DeepSeek-R1 с reasoning capabilities

**Настройка:**
```env
# .env
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat  # или deepseek-reasoner для R1
```

**Пример интеграции:**
```typescript
async function rewriteWithDeepSeek(text: string, style: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Ты — профессиональный редактор новостного канала. Перепиши новость в заданном стиле, сохранив все факты.'
        },
        {
          role: 'user',
          content: `Стиль: ${style}\n\nОригинальный текст:\n${text}\n\nДобавь эмодзи и хештеги.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
```

**DeepSeek-R1 (Reasoning):**
```typescript
// Для сложных задач с рассуждениями
async function rewriteWithDeepSeekR1(text: string, style: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: 'Проанализируй новость и перепиши её, объяснив логику выбора стиля.'
        },
        {
          role: 'user',
          content: `Стиль: ${style}\n\nТекст:\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  // R1 возвращает reasoning + content
  return data.choices?.[0]?.message?.content || '';
}
```

---

### 6. OpenRouter

**Получение API ключа:**
1. Зарегистрируйтесь на https://openrouter.ai
2. Перейдите в Keys
3. Создайте новый ключ
4. Пополните баланс (от $5)

**Особенности:**
- Единый API для доступа к 100+ моделям
- Автоматический выбор лучшей модели
- Поддержка fallback при ошибках
- Прозрачное ценообразование

**Доступные модели через OpenRouter:**
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `google/gemini-pro`
- `meta-llama/llama-3-70b`
- `mistralai/mixtral-8x7b`
- И многие другие...

**Настройка:**
```env
# .env
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-3-sonnet  # или любая другая
```

**Пример интеграции:**
```typescript
async function rewriteWithOpenRouter(
  text: string,
  style: string,
  model: string = 'anthropic/claude-3-sonnet'
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://maxnews.ru', // Ваш сайт
      'X-Title': 'MaxNews AI Rewrite', // Название приложения
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'Ты — профессиональный редактор новостного канала. Перепиши новость в заданном стиле.'
        },
        {
          role: 'user',
          content: `Стиль: ${style}\n\nОригинальный текст:\n${text}\n\nДобавь эмодзи и хештеги.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
```

**Использование разных моделей:**
```typescript
// Автоматический выбор модели по задаче
async function smartRewrite(text: string, style: string): Promise<string> {
  let model: string;
  
  if (style === 'analytical') {
    model = 'anthropic/claude-3-opus'; // Лучший для анализа
  } else if (style === 'casual') {
    model = 'meta-llama/llama-3-70b'; // Хорош для разговорного
  } else if (style === 'professional') {
    model = 'openai/gpt-4-turbo'; // Отличный для делового
  } else {
    model = 'anthropic/claude-3-sonnet'; // Универсальный
  }
  
  return rewriteWithOpenRouter(text, style, model);
}
```

**Fallback стратегия:**
```typescript
async function rewriteWithFallback(text: string, style: string): Promise<string> {
  const models = [
    'anthropic/claude-3-sonnet',
    'openai/gpt-4-turbo',
    'google/gemini-pro',
    'meta-llama/llama-3-70b'
  ];
  
  for (const model of models) {
    try {
      const result = await rewriteWithOpenRouter(text, style, model);
      if (result) return result;
    } catch (error) {
      console.log(`Model ${model} failed, trying next...`);
      continue;
    }
  }
  
  throw new Error('All models failed');
}
```

---

## Универсальный сервис рерайта

```typescript
// backend/src/modules/ai-rewrite/ai-rewrite.service.ts

import { Injectable } from '@nestjs/common';

type AIProvider = 'openai' | 'anthropic' | 'yandex' | 'gigachat' | 'deepseek' | 'openrouter';
type RewriteStyle = 'informative' | 'engaging' | 'analytical' | 'casual' | 'professional';

@Injectable()
export class AIRewriteService {
  async rewrite(
    text: string,
    provider: AIProvider,
    style: RewriteStyle,
    options?: {
      temperature?: number;
      maxTokens?: number;
      customPrompt?: string;
      model?: string; // Для OpenRouter
    }
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return this.rewriteWithOpenAI(text, style, options);
      case 'anthropic':
        return this.rewriteWithAnthropic(text, style, options);
      case 'yandex':
        return this.rewriteWithYandex(text, style, options);
      case 'gigachat':
        return this.rewriteWithGigaChat(text, style, options);
      case 'deepseek':
        return this.rewriteWithDeepSeek(text, style, options);
      case 'openrouter':
        return this.rewriteWithOpenRouter(text, style, options);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async rewriteWithOpenAI(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    // Реализация для OpenAI
    // ...
  }

  private async rewriteWithAnthropic(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    // Реализация для Anthropic
    // ...
  }

  private async rewriteWithYandex(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    // Реализация для YandexGPT
    // ...
  }

  private async rewriteWithGigaChat(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    // Реализация для GigaChat
    // ...
  }

  private async rewriteWithDeepSeek(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Ты — профессиональный редактор новостного канала. Перепиши новость в заданном стиле.'
          },
          {
            role: 'user',
            content: `Стиль: ${style}\n\nТекст:\n${text}`
          }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private async rewriteWithOpenRouter(
    text: string,
    style: RewriteStyle,
    options?: any
  ): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.APP_URL || 'https://maxnews.ru',
        'X-Title': 'MaxNews AI Rewrite',
      },
      body: JSON.stringify({
        model: options?.model || process.env.OPENROUTER_MODEL || 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: 'Ты — профессиональный редактор новостного канала. Перепиши новость в заданном стиле.'
          },
          {
            role: 'user',
            content: `Стиль: ${style}\n\nТекст:\n${text}`
          }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
```

---

## API Endpoints

### POST /api/ai-rewrite

**Request:**
```json
{
  "publicationId": "123",
  "provider": "openai",
  "style": "engaging",
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "customPrompt": "Добавь больше эмодзи"
  }
}
```

**Response:**
```json
{
  "rewrittenText": "🔥 Новая новость!\n\n...",
  "provider": "openai",
  "model": "gpt-4-turbo-preview",
  "tokensUsed": 450,
  "cost": 0.015
}
```

---

## Оптимизация затрат

### 1. Кэширование результатов

```typescript
// Кэшировать результаты для одинаковых входных данных
const cacheKey = `${publicationId}_${provider}_${style}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

### 2. Использование более дешёвых моделей

- **GPT-3.5** в 10 раз дешевле GPT-4
- **YandexGPT Lite** дешевле полной версии
- **Claude Haiku** дешевле Opus/Sonnet

### 3. Батчинг запросов

```typescript
// Обрабатывать несколько текстов за один запрос
async function batchRewrite(texts: string[], style: string): Promise<string[]> {
  const prompt = `Перепиши следующие ${texts.length} новостей в стиле ${style}:\n\n` +
    texts.map((t, i) => `${i + 1}. ${t}`).join('\n\n');
  
  // Один API вызов вместо N
}
```

### 4. Ограничение токенов

```typescript
// Обрезать длинные тексты до разумных лимитов
const maxInputLength = 2000; // символов
const truncatedText = text.slice(0, maxInputLength);
```

---

## Мониторинг и аналитика

```typescript
// Отслеживание использования API
interface AIUsageStats {
  provider: string;
  model: string;
  requestsCount: number;
  tokensUsed: number;
  totalCost: number;
  averageLatency: number;
}

// Сохранять статистику в БД
await prisma.aiUsage.create({
  data: {
    provider: 'openai',
    model: 'gpt-4',
    tokensUsed: 450,
    cost: 0.015,
    latency: 2300,
    userId: 'admin',
    createdAt: new Date()
  }
});
```

---

## Безопасность

### 1. Валидация входных данных

```typescript
// Ограничить длину входного текста
if (text.length > 10000) {
  throw new BadRequestException('Text too long');
}

// Проверить стиль
const validStyles = ['informative', 'engaging', 'analytical', 'casual', 'professional'];
if (!validStyles.includes(style)) {
  throw new BadRequestException('Invalid style');
}
```

### 2. Rate limiting

```typescript
// Ограничить количество запросов
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 запросов в минуту
@Post('rewrite')
async rewrite(@Body() dto: RewriteDto) {
  // ...
}
```

### 3. Фильтрация контента

```typescript
// Проверить результат на запрещённый контент
const forbiddenWords = ['казино', 'ставки', 'наркотики'];
if (forbiddenWords.some(word => result.toLowerCase().includes(word))) {
  throw new ForbiddenException('Content contains forbidden words');
}
```

---

## Тестирование

```typescript
// Тесты для AI сервиса
describe('AIRewriteService', () => {
  it('should rewrite text with OpenAI', async () => {
    const result = await service.rewrite(
      'Apple представила новый iPhone',
      'openai',
      'engaging'
    );
    
    expect(result).toContain('🔥');
    expect(result.length).toBeGreaterThan(50);
  });

  it('should handle different styles', async () => {
    const styles = ['informative', 'engaging', 'analytical'];
    
    for (const style of styles) {
      const result = await service.rewrite(text, 'openai', style);
      expect(result).toBeTruthy();
    }
  });
});
```

---

## Дополнительные ресурсы

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Anthropic API Docs](https://docs.anthropic.com)
- [DeepSeek API Docs](https://platform.deepseek.com/api-docs/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [YandexGPT API](https://yandex.cloud/ru/docs/foundation-models/concepts/)
- [GigaChat API](https://developers.sber.ru/docs/ru/gigachat/api/overview)

## Сравнение моделей

| Модель | Цена (1K токенов) | Качество | Скорость | Особенности |
|--------|-------------------|----------|----------|-------------|
| GPT-4 | $0.01 / $0.03 | ⭐⭐⭐⭐⭐ | Средняя | Лучшее качество |
| GPT-3.5 | $0.0015 / $0.002 | ⭐⭐⭐ | Быстрая | Дешёвая |
| Claude 3 Opus | $0.015 / $0.075 | ⭐⭐⭐⭐⭐ | Медленная | Отличный для анализа |
| Claude 3 Sonnet | $0.003 / $0.015 | ⭐⭐⭐⭐ | Средняя | Баланс цена/качество |
| **DeepSeek V3** | **$0.00014 / $0.00028** | ⭐⭐⭐⭐ | Быстрая | **Очень дешёвая!** |
| **DeepSeek R1** | **$0.00055 / $0.00219** | ⭐⭐⭐⭐⭐ | Медленная | **Reasoning** |
| **OpenRouter** | Зависит от модели | ⭐⭐⭐-⭐⭐⭐⭐⭐ | Зависит | **100+ моделей** |
| YandexGPT | ₽0.04 / ₽0.06 | ⭐⭐⭐⭐ | Средняя | Русский контекст |
| GigaChat | ₽0.06 / ₽0.08 | ⭐⭐⭐ | Быстрая | Бизнес |

### Рекомендации по выбору:

**Для экономии бюджета:**
- DeepSeek V3 — в 100 раз дешевле GPT-4 при отличном качестве
- GPT-3.5 — хорошая альтернатива для простых задач

**Для максимального качества:**
- GPT-4 или Claude 3 Opus — для важных публикаций
- DeepSeek R1 — для аналитических текстов с reasoning

**Для гибкости:**
- OpenRouter — доступ ко всем моделям через один API с автоматическим fallback
