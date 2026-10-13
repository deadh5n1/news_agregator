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

## Универсальный сервис рерайта

```typescript
// backend/src/modules/ai-rewrite/ai-rewrite.service.ts

import { Injectable } from '@nestjs/common';

type AIProvider = 'openai' | 'anthropic' | 'yandex' | 'gigachat';
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
- [YandexGPT API](https://yandex.cloud/ru/docs/foundation-models/concepts/)
- [GigaChat API](https://developers.sber.ru/docs/ru/gigachat/api/overview)
