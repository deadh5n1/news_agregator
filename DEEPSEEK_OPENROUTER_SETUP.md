# Настройка DeepSeek и OpenRouter

## 🔮 DeepSeek

**Преимущества:**
- ⚡ В 100 раз дешевле GPT-4
- 🧠 Отличное качество для русского языка
- 📏 Поддержка до 64K токенов контекста
- 🎯 Модель R1 с reasoning capabilities

### Получение API ключа

1. Перейдите на https://platform.deepseek.com
2. Зарегистрируйтесь (можно через GitHub)
3. Перейдите в раздел **API Keys**
4. Нажмите **Create new secret key**
5. Скопируйте ключ (начинается с `sk-...`)

### Настройка

Добавьте в файл `.env`:

```env
DEEPSEEK_API_KEY=sk-ваш_ключ_от_deepseek
DEEPSEEK_MODEL=deepseek-chat  # или deepseek-reasoner для R1
```

### Использование

**DeepSeek V3 (быстрая и дешёвая):**
```typescript
// Обычный чат
const result = await rewriteWithDeepSeek(text, 'engaging');
```

**DeepSeek R1 (с reasoning):**
```typescript
// Для сложных аналитических задач
const result = await rewriteWithDeepSeekR1(text, 'analytical');
```

### Цены

| Модель | Input (1K токенов) | Output (1K токенов) |
|--------|-------------------|---------------------|
| DeepSeek V3 | $0.00014 | $0.00028 |
| DeepSeek R1 | $0.00055 | $0.00219 |

**Пример:** 1000 переписанных новостей ≈ $0.50 (vs $50 для GPT-4)

---

## 🌐 OpenRouter

**Преимущества:**
- 🔑 Один API ключ для 100+ моделей
- 🔄 Автоматический fallback при ошибках
- 💰 Прозрачное ценообразование
- 🎯 Выбор лучшей модели под задачу

### Получение API ключа

1. Перейдите на https://openrouter.ai
2. Зарегистрируйтесь (можно через Google/GitHub)
3. Перейдите в раздел **Keys**
4. Нажмите **Create Key**
5. Пополните баланс (минимум $5)
6. Скопируйте ключ (начинается с `sk-or-...`)

### Настройка

Добавьте в файл `.env`:

```env
OPENROUTER_API_KEY=sk-or-ваш_ключ_от_openrouter
OPENROUTER_MODEL=anthropic/claude-3-sonnet  # или любая другая модель
```

### Доступные модели

**Топ модели через OpenRouter:**

```typescript
// Премиум модели
'openai/gpt-4-turbo'           // $0.01 / $0.03 за 1K токенов
'anthropic/claude-3-opus'      // $0.015 / $0.075
'google/gemini-pro'            // $0.00025 / $0.00075

// Средний сегмент
'anthropic/claude-3-sonnet'    // $0.003 / $0.015
'meta-llama/llama-3-70b'       // $0.0008 / $0.0008
'mistralai/mixtral-8x7b'       // $0.0006 / $0.0006

// Бюджетные
'google/gemini-flash'          // $0.0001 / $0.0004
'meta-llama/llama-3-8b'        // $0.0001 / $0.0001
'mistralai/mistral-7b'         // $0.0001 / $0.0001
```

### Использование

**Базовое использование:**
```typescript
// Использовать модель по умолчанию из .env
const result = await rewriteWithOpenRouter(text, 'engaging');
```

**Выбор конкретной модели:**
```typescript
// Использовать Claude 3 Opus для аналитики
const result = await rewriteWithOpenRouter(
  text, 
  'analytical', 
  'anthropic/claude-3-opus'
);
```

**Автоматический выбор модели:**
```typescript
async function smartRewrite(text: string, style: string): Promise<string> {
  const modelMap = {
    'informative': 'openai/gpt-4-turbo',
    'engaging': 'anthropic/claude-3-sonnet',
    'analytical': 'anthropic/claude-3-opus',
    'casual': 'meta-llama/llama-3-70b',
    'professional': 'openai/gpt-4-turbo'
  };
  
  return rewriteWithOpenRouter(text, style, modelMap[style]);
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
      if (result) {
        console.log(`Success with ${model}`);
        return result;
      }
    } catch (error) {
      console.log(`${model} failed, trying next...`);
      continue;
    }
  }
  
  throw new Error('All models failed');
}
```

### Дополнительные заголовки

OpenRouter требует указывать источник запроса:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'https://maxnews.ru',      // Ваш сайт
  'X-Title': 'MaxNews AI Rewrite',            // Название приложения
}
```

---

## 📊 Сравнение и рекомендации

### По бюджету

**Минимальный бюджет (< $10/мес):**
- DeepSeek V3 — лучшее соотношение цена/качество
- OpenRouter с бюджетными моделями (Gemini Flash, Llama 3 8B)

**Средний бюджет ($10-50/мес):**
- DeepSeek V3 для большинства задач
- OpenRouter с Claude 3 Sonnet для важных публикаций

**Высокий бюджет (> $50/мес):**
- GPT-4 или Claude 3 Opus для максимального качества
- OpenRouter с автоматическим выбором лучшей модели

### По задачам

**Для массового рерайта (100+ новостей/день):**
```typescript
// DeepSeek V3 — дёшево и быстро
provider: 'deepseek'
model: 'deepseek-chat'
```

**Для важных публикаций:**
```typescript
// Claude 3 Opus через OpenRouter — максимальное качество
provider: 'openrouter'
model: 'anthropic/claude-3-opus'
```

**Для аналитических текстов:**
```typescript
// DeepSeek R1 — reasoning capabilities
provider: 'deepseek'
model: 'deepseek-reasoner'
```

**Для гибкости и отказоустойчивости:**
```typescript
// OpenRouter с fallback
provider: 'openrouter'
// Автоматический выбор модели
```

---

## 🔧 Практические советы

### 1. Кэширование результатов

```typescript
// Избегайте повторных запросов для одинаковых текстов
const cacheKey = crypto.createHash('md5')
  .update(`${text}_${provider}_${style}`)
  .digest('hex');

const cached = await redis.get(cacheKey);
if (cached) return cached;

const result = await rewrite(text, provider, style);
await redis.setex(cacheKey, 86400, result); // Кэш на 24 часа
```

### 2. Мониторинг расходов

```typescript
// Отслеживайте использование API
interface UsageStats {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: Date;
}

// Сохраняйте статистику
await prisma.aiUsage.create({
   {
    provider: 'deepseek',
    model: 'deepseek-chat',
    inputTokens: 500,
    outputTokens: 300,
    cost: 0.000112, // Рассчитайте по тарифам
    createdAt: new Date()
  }
});
```

### 3. Rate limiting

```typescript
// Ограничьте количество запросов
@UseGuards(ThrottlerGuard)
@Throttle(20, 60) // 20 запросов в минуту
@Post('rewrite')
async rewrite(@Body() dto: RewriteDto) {
  // ...
}
```

### 4. Батчинг для экономии

```typescript
// Обрабатывайте несколько текстов за один запрос
async function batchRewrite(texts: string[], style: string): Promise<string[]> {
  const prompt = `Перепиши следующие ${texts.length} новостей в стиле ${style}:\n\n` +
    texts.map((t, i) => `### Новость ${i + 1}\n${t}`).join('\n\n');
  
  const result = await rewriteWithDeepSeek(prompt, style);
  
  // Разбейте результат на отдельные тексты
  return result.split('### Новость').slice(1).map(t => t.trim());
}
```

---

## 🚀 Быстрый старт

### 1. DeepSeek (5 минут)

```bash
# 1. Получите ключ на https://platform.deepseek.com
# 2. Добавьте в .env
echo "DEEPSEEK_API_KEY=sk-ваш_ключ" >> .env
echo "DEEPSEEK_MODEL=deepseek-chat" >> .env

# 3. Перезапустите backend
docker compose restart backend
```

### 2. OpenRouter (10 минут)

```bash
# 1. Получите ключ на https://openrouter.ai
# 2. Пополните баланс минимум на $5
# 3. Добавьте в .env
echo "OPENROUTER_API_KEY=sk-or-ваш_ключ" >> .env
echo "OPENROUTER_MODEL=anthropic/claude-3-sonnet" >> .env

# 4. Перезапустите backend
docker compose restart backend
```

---

## 📚 Дополнительные ресурсы

- [DeepSeek Platform](https://platform.deepseek.com)
- [DeepSeek API Docs](https://platform.deepseek.com/api-docs/)
- [OpenRouter](https://openrouter.ai)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)

---

## 💡 FAQ

**В: Какую модель выбрать для начала?**
О: DeepSeek V3 — отличное соотношение цена/качество. Если нужен доступ к разным моделям — OpenRouter.

**В: Можно ли использовать несколько провайдеров?**
О: Да! Используйте OpenRouter как единый интерфейс или переключайтесь между провайдерами в настройках.

**В: Что делать, если API не отвечает?**
О: Настройте fallback в OpenRouter или используйте несколько провайдеров для отказоустойчивости.

**В: Как контролировать расходы?**
О: Используйте кэширование, батчинг и мониторинг. Установите лимиты в настройках провайдера.

**В: Какая модель лучше для русского языка?**
О: DeepSeek и YandexGPT отлично работают с русским. GPT-4 и Claude 3 тоже хороши, но дороже.
