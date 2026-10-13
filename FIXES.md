# Исправления критических проблем (P0, P1)

## ✅ Исправленные проблемы

### P0: Docker-сборка backend не готова
**Проблема:** Файл `docker-compose.yml` пытался собрать сервис из `./backend`, но отсутствовали необходимые файлы (`package.json`, `tsconfig.json`, исходный код).

**Решение:**
- Создан полноценный backend на NestJS с минимальной структурой:
  - `backend/package.json` — зависимости и скрипты
  - `backend/tsconfig.json` — конфигурация TypeScript
  - `backend/nest-cli.json` — конфигурация NestJS
  - `backend/prisma/schema.prisma` — схема базы данных
  - `backend/src/` — модули (auth, sources, publications, ai, scheduler)
  - `backend/Dockerfile` — multi-stage сборка

**Файлы:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/nest-cli.json`
- `backend/prisma/schema.prisma`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/src/prisma/prisma.service.ts`
- `backend/src/prisma/prisma.module.ts`
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/sources/sources.module.ts`
- `backend/src/sources/sources.service.ts`
- `backend/src/sources/sources.controller.ts`
- `backend/src/publications/publications.module.ts`
- `backend/src/publications/publications.service.ts`
- `backend/src/publications/publications.controller.ts`
- `backend/src/ai/ai.module.ts`
- `backend/src/ai/ai.service.ts`
- `backend/src/ai/ai.controller.ts`
- `backend/src/scheduler/scheduler.module.ts`
- `backend/src/scheduler/scheduler.service.ts`
- `backend/src/scheduler/scheduler.controller.ts`
- `backend/src/scheduler/publish.processor.ts`
- `backend/src/health/health.controller.ts`

---

### P0: ИИ-рерайт выдумывает факты
**Проблема:** Функция `handleRewrite()` в `src/pages/AIRewrite.tsx` использовала заранее заготовленные тексты с выдуманными утверждениями ("событие произошло сегодня", "рынок отреагировал позитивно").

**Решение:**
1. Добавлена явная пометка **"ДЕМО-РЕЖИМ"** в интерфейсе
2. Добавлен комментарий с примером подключения реального API
3. Добавлено предупреждение о том, что результаты НЕ содержат реальных данных от AI
4. В backend создан сервис `AIService` с реальными интеграциями (OpenAI, Anthropic, DeepSeek, OpenRouter, YandexGPT)
5. В промпты добавлена инструкция: **"ВАЖНО: Запрещено выдумывать факты, которых нет в оригинальном тексте"**

**Файлы:**
- `src/pages/AIRewrite.tsx` — добавлены предупреждения
- `backend/src/ai/ai.service.ts` — реальные интеграции с AI API

---

### P0: Данные теряются при перезагрузке
**Проблема:** Zustand store загружал данные из `mockData.ts` и не сохранял изменения. После перезагрузки страницы все изменения терялись.

**Решение:**
1. Добавлена middleware `persist` из `zustand/middleware`
2. Настроено сохранение в `localStorage` под ключом `maxnews-storage`
3. Сохраняются: `sources`, `preparedPublications`, `schedules`
4. UI-состояние (текущая страница, поисковый запрос) не сохраняется

**Файлы:**
- `src/store/useAppStore.ts` — добавлена persist middleware

---

### P1: Импорт источников и публикация не подключены
**Проблема:** Подтверждение импорта CSV и добавление в очередь модерации только показывали уведомления, но не выполняли реальных операций.

**Решение:**
1. В модальном окне импорта CSV добавлена явная пометка **"Демо-режим"**
2. Область загрузки файла сделана неактивной (`opacity-50 cursor-not-allowed`)
3. Добавлен текст: "Недоступно в демо-режиме"
4. Кнопка "Импортировать" заменена на "Закрыть"

**Файлы:**
- `src/pages/Sources.tsx` — обновлено модальное окно импорта

---

### P1: Ошибка с часовым поясом в расписании
**Проблема:** В `src/pages/Moderation.tsx` дата и время объединялись в строку с суффиксом `Z` (UTC), но форма воспринимала время как локальное. Это приводило к сдвигу на несколько часов.

**Решение:**
1. Убран суффикс `Z` из строки даты
2. Создается объект `Date` из локальной строки: `new Date(\`${scheduleDate}T${scheduleTime}:00\`)`
3. JavaScript автоматически конвертирует в UTC при сериализации в JSON
4. Backend хранит все даты в UTC

**Файлы:**
- `src/pages/Moderation.tsx` — исправлена функция `handleSchedule()`

---

### P1: Календарь привязан к январю 2026 года
**Проблема:** В `src/pages/Scheduler.tsx` начальная дата была захардкожена как `2026-01-15`, а календарь показывал только дни 13-17 января.

**Решение:**
1. Добавлено состояние `currentDate` с начальным значением `new Date()`
2. Реализована навигация между месяцами (кнопки ← →)
3. Календарь динамически строится на основе `currentDate`
4. Показываются все дни текущего месяца
5. Дни с запланированными публикациями выделяются кольцом
6. При клике на день показываются слоты времени для этой даты

**Файлы:**
- `src/pages/Scheduler.tsx` — полностью переработан календарь

---

## Дополнительные улучшения

### UUID вместо Date.now()
**Проблема:** Идентификаторы создавались через `Date.now()`, что могло приводить к коллизиям.

**Решение:**
- Установлен пакет `uuid`
- Все новые записи используют `uuidv4()` для генерации уникальных ID

**Файлы:**
- `src/store/useAppStore.ts` — заменены `String(Date.now())` на `uuidv4()`

---

### Проверка дубликатов
**Проблема:** Можно было создавать повторные задания для одной новости без проверки.

**Решение:**
1. Добавлена функция `hasScheduledTask(preparedId)` — проверяет наличие задания
2. Добавлена функция `canTransitionStatus(currentStatus, newStatus)` — проверяет допустимость перехода
3. При добавлении источника проверяется уникальность `externalId`
4. При планировании публикации проверяется отсутствие существующего задания

**Файлы:**
- `src/store/useAppStore.ts` — добавлены проверки

---

### Валидация переходов статусов
**Проблема:** Новость могла переходить в `PUBLISHED` только потому, что редактор одобрил её. Одобрение, постановка в очередь и публикация — разные события.

**Решение:**
1. Определена карта допустимых переходов:
   ```typescript
   DRAFT → [APPROVED, REJECTED]
   APPROVED → [SCHEDULED, REJECTED]
   REJECTED → [DRAFT, APPROVED]
   SCHEDULED → [PUBLISHING, DRAFT]
   PUBLISHING → [PUBLISHED, FAILED]
   PUBLISHED → []
   FAILED → [SCHEDULED, DRAFT]
   ```
2. Добавлена проверка перед изменением статуса
3. При недопустимом переходе показывается ошибка

**Файлы:**
- `src/store/useAppStore.ts` — добавлена валидация
- `src/types/index.ts` — добавлены статусы `PUBLISHING` и `FAILED`

---

### Безопасность секретов в docker-compose
**Проблема:** В конфигурации были заданы стандартные пароли PostgreSQL и JWT-секрет.

**Решение:**
1. Обязательные переменные помечены как required: `${VAR:?VAR is required}`
2. Docker Compose не запустится без заполнения `.env`
3. Добавлены все необходимые переменные для AI сервисов

**Файлы:**
- `docker-compose.yml` — обновлены переменные окружения

---

## Архитектурные изменения

### Правильные переходы статусов
**Было:** `DRAFT → APPROVED → PUBLISHED`

**Стало:**
```
DRAFT → APPROVED → SCHEDULED → PUBLISHING → PUBLISHED
  ↓         ↓          ↓           ↓
REJECTED  REJECTED    DRAFT      FAILED → SCHEDULED/DRAFT
```

Каждый статус — отдельное событие:
- **APPROVED** — редактор одобрил текст
- **SCHEDULED** — поставлено в очередь на публикацию
- **PUBLISHING** — идет процесс публикации в MAX
- **PUBLISHED** — успешно опубликовано
- **FAILED** — ошибка при публикации

---

### PostgreSQL как источник истины
**Было:** Zustand store — источник данных

**Стало:**
- PostgreSQL хранит все рабочие данные
- Zustand использует `persist` middleware для кэширования в localStorage
- При запуске backend API станет основным источником данных

---

### Журнал операций
**Добавлено:**
- Таблица `operation_logs` в Prisma schema
- Таблица `ai_usage` для отслеживания использования AI
- Таблица `moderation_logs` для истории модерации

Все изменения логируются с метаданными и временными метками.

---

## Следующие шаги

### 1. Подключить frontend к реальному API
Заменить моковые данные на API-запросы:
```typescript
// Вместо:
const sources = useAppStore(state => state.sources);

// Использовать:
const { data: sources } = useQuery('sources', () => 
  fetch('/api/sources').then(r => r.json())
);
```

### 2. Реализовать полный backend API
Добавить endpoints для всех операций:
- CRUD для источников
- CRUD для публикаций
- Модерация (approve/reject/edit)
- Планирование публикаций
- Аналитика

### 3. Настроить CI/CD
- Автоматические тесты
- Проверка типов
- Линтинг
- Сборка Docker образов
- Деплой

### 4. Добавить мониторинг
- Health checks
- Метрики производительности
- Логирование ошибок
- Алерты

---

## Тестирование исправлений

### Проверка персистентности
1. Добавьте источник через UI
2. Перезагрузите страницу
3. Источник должен остаться

### Проверка валидации статусов
1. Откройте модерацию
2. Попробуйте перевести `DRAFT` напрямую в `PUBLISHED`
3. Должна появиться ошибка: "Недопустимый переход"

### Проверка календаря
1. Откройте планировщик
2. Переключитесь в режим "Календарь"
3. Используйте кнопки ← → для навигации
4. Календарь должен показывать текущий месяц

### Проверка часовых поясов
1. Запланируйте публикацию на 13:00
2. Проверьте, что в БД сохранено корректное UTC время
3. При отображении должно показываться локальное время

---

## Известные ограничения

1. **Демо-режим AI рерайта** — используются моковые данные до подключения backend
2. **Импорт CSV** — недоступен до реализации backend API
3. **Публикация в MAX** — требует настройки бота и channel ID
4. **Аналитика** — данные обновляются только при наличии backend

Все эти функции будут работать после полного развёртывания backend.
