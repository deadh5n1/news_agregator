# MaxNews — Система сбора и публикации новостей из каналов MAX

Полнофункциональное веб-приложение для автоматического сбора новостей из публичных каналов мессенджера MAX через API MaxStat, их обработки и публикации на ваш канал.

## 🏗️ Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   PostgreSQL    │
│   React + Vite  │     │    NestJS       │     │                 │
│   Port: 80      │     │    Port: 3000   │     │   Port: 5432    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │      Redis      │
                        │   (BullMQ)      │
                        │   Port: 6379    │
                        └─────────────────┘
```

## 📋 Системные требования

### Минимальные требования
- **CPU**: 2 ядра
- **RAM**: 4 GB
- **Диск**: 10 GB свободного места
- **ОС**: Linux, macOS, Windows (с WSL2)

### Рекомендуемые требования
- **CPU**: 4+ ядра
- **RAM**: 8+ GB
- **Диск**: 20+ GB SSD
- **ОС**: Ubuntu 22.04+, macOS 13+, Windows 11 с WSL2

### Программное обеспечение
- **Docker**: 24.0+ ([установить](https://docs.docker.com/get-docker/))
- **Docker Compose**: 2.20+ (входит в Docker Desktop)
- **Git**: 2.30+ (для клонирования репозитория)

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd maxnews
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
nano .env  # или ваш редактор
```

Заполните обязательные поля:
- `MAXSTAT_API_KEY` — ключ API MaxStat (получить на https://maxstat.ru/promo/api)
- `MAX_BOT_TOKEN` — токен бота MAX для публикации
- `MAX_CHANNEL_ID` — ID вашего канала в MAX
- `JWT_SECRET` — случайная строка для JWT (можно сгенерировать: `openssl rand -hex 32`)

### 3. Запуск production-версии

```bash
# Сборка и запуск всех сервисов
docker compose up -d --build

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

Приложение будет доступно:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Adminer** (PostgreSQL): http://localhost:8082
- **Redis Commander**: http://localhost:8081

### 4. Запуск в режиме разработки

```bash
# Запуск dev-окружения с hot-reload
docker compose -f docker-compose.dev.yml up -d

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 📦 Структура проекта

```
maxnews/
├── src/                    # Frontend (React + Vite)
│   ├── components/         # UI компоненты
│   ├── pages/              # Страницы приложения
│   ├── store/              # Zustand store
│   ├── types/              # TypeScript типы
│   └── data/               # Моковые данные
├── backend/                # Backend (NestJS)
│   ├── src/
│   │   ├── modules/        # Бизнес-логика
│   │   │   ├── sources/    # Управление источниками
│   │   │   ├── collector/  # Сбор публикаций
│   │   │   ├── processor/  # Обработка текста
│   │   │   ├── adapter/    # Адаптация под шаблоны
│   │   │   ├── moderation/ # Модерация
│   │   │   ├── scheduler/  # Планирование
│   │   │   ├── publisher/  # Публикация в MAX
│   │   │   └── analytics/  # Аналитика
│   │   ├── prisma/         # Схема БД
│   │   └── main.ts         # Точка входа
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Production окружение
├── docker-compose.dev.yml  # Development окружение
├── Dockerfile              # Frontend Dockerfile
├── nginx.conf              # Nginx конфигурация
└── .env.example            # Пример переменных окружения
```

## 🔧 Управление контейнерами

### Остановка всех сервисов

```bash
docker compose down
```

### Перезапуск конкретного сервиса

```bash
docker compose restart backend
```

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
```

### Очистка данных

```bash
# Остановить и удалить volumes (БД, Redis)
docker compose down -v

# Пересобрать образы
docker compose up -d --build --force-recreate
```

## 🗄️ Работа с базой данных

### Инициализация схемы (первый запуск)

```bash
# Войти в контейнер backend
docker compose exec backend sh

# Применить миграции
npx prisma migrate deploy

# Выйти
exit
```

### Заполнение тестовыми данными

```bash
docker compose exec backend npx prisma db seed
```

### Подключение к PostgreSQL

```bash
# Через psql
docker compose exec postgres psql -U maxnews -d maxnews

# Или через Adminer: http://localhost:8082
# Сервер: postgres
# Пользователь: maxnews
# Пароль: maxnews_secret
# БД: maxnews
```

## 🔌 API Endpoints

### Источники
- `GET /api/sources` — список источников
- `POST /api/sources` — добавить источник
- `PATCH /api/sources/:id` — обновить источник
- `DELETE /api/sources/:id` — удалить источник

### Публикации
- `GET /api/publications` — список собранных публикаций
- `POST /api/publications/:id/prepare` — подготовить к публикации
- `PATCH /api/prepared/:id` — обновить подготовленную публикацию
- `POST /api/prepared/:id/approve` — одобрить
- `POST /api/prepared/:id/reject` — отклонить

### Планирование
- `GET /api/schedule` — расписание публикаций
- `POST /api/schedule` — запланировать публикацию
- `DELETE /api/schedule/:id` — отменить публикацию

### Очередь
- `GET /api/queue/status` — статус очереди
- `POST /api/queue/retry/:id` — повторная попытка

### Аналитика
- `GET /api/analytics/dashboard` — статистика дашборда
- `GET /api/analytics/publications` — аналитика публикаций
- `GET /api/analytics/sources` — аналитика источников

## 🔐 Безопасность

### Рекомендации для production

1. **Измените все пароли по умолчанию** в `.env`
2. **Используйте HTTPS** (настройте reverse proxy с SSL)
3. **Ограничьте доступ** к Adminer и Redis Commander
4. **Настройте firewall** (откройте только 80/443 порты)
5. **Регулярно обновляйте** Docker образы: `docker compose pull && docker compose up -d`

### Пример Nginx reverse proxy с SSL

```nginx
server {
    listen 443 ssl http2;
    server_name maxnews.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Мониторинг

### Проверка здоровья сервисов

```bash
# Frontend
curl http://localhost/health

# Backend
curl http://localhost:3000/health

# PostgreSQL
docker compose exec postgres pg_isready

# Redis
docker compose exec redis redis-cli ping
```

### Просмотр ресурсов

```bash
# Использование ресурсов контейнерами
docker stats
```

## 🐛 Troubleshooting

### Проблема: Контейнер не запускается

```bash
# Посмотреть логи
docker compose logs backend

# Проверить зависимости
docker compose ps
```

### Проблема: Ошибка подключения к БД

```bash
# Проверить, что PostgreSQL запущен
docker compose ps postgres

# Перезапустить
docker compose restart postgres
```

### Проблема: Порт уже занят

```bash
# Найти процесс
lsof -i :80  # или 3000, 5432, 6379

# Изменить порт в docker-compose.yml
ports:
  - "8080:80"  # вместо 80:80
```

### Проблема: Нет данных после первого запуска

```bash
# Применить миграции
docker compose exec backend npx prisma migrate deploy

# Запустить сбор данных
docker compose exec backend npm run collect:sources
```

## 📝 Лицензия

MIT

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker compose logs -f`
2. Убедитесь, что все переменные окружения заполнены
3. Проверьте системные требования
4. Попробуйте пересобрать: `docker compose down -v && docker compose up -d --build`
