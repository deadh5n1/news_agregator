# 🚀 Инструкция по запуску MaxNews

## Системные требования

### Минимальные
- **CPU**: 2 ядра
- **RAM**: 4 GB
- **Диск**: 10 GB
- **Docker**: 24.0+
- **Docker Compose**: 2.20+

### Рекомендуемые
- **CPU**: 4+ ядра
- **RAM**: 8+ GB
- **Диск**: 20+ GB SSD

---

## Быстрый старт (5 минут)

### 1. Установите Docker

**Linux (Ubuntu/Debian):**
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Перелогиньтесь или выполните:
newgrp docker
```

**macOS:**
Скачайте [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Windows:**
1. Установите [WSL2](https://docs.microsoft.com/ru-ru/windows/wsl/install)
2. Скачайте [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Проверьте установку

```bash
docker --version      # Должна быть 24.0+
docker compose version # Должна быть 2.20+
```

### 3. Настройте переменные окружения

```bash
cp .env.example .env
```

Откройте `.env` и заполните:

```env
# Получите на https://maxstat.ru/promo/api
MAXSTAT_API_KEY=ваш_ключ_от_maxstat

# Создайте бота в MAX и получите токен
MAX_BOT_TOKEN=токен_вашего_бота
MAX_CHANNEL_ID=id_вашего_канала

# Сгенерируйте случайную строку:
# openssl rand -hex 32
JWT_SECRET=случайная_строка_для_jwt
```

### 4. Запустите приложение

**Production-версия:**
```bash
docker compose up -d --build
```

**Development-версия (с hot-reload):**
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 5. Откройте в браузере

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Adminer (БД)**: http://localhost:8082
- **Redis Commander**: http://localhost:8081

---

## Использование Makefile (удобные команды)

Если у вас установлен `make`, используйте готовые команды:

```bash
# Показать все команды
make help

# Запустить development
make dev

# Запустить production
make up

# Остановить
make down

# Посмотреть логи
make logs

# Проверить здоровье сервисов
make health

# Сбросить и пересобрать
make clean && make up
```

---

## Управление контейнерами

### Остановка

```bash
docker compose down
```

### Перезапуск

```bash
docker compose restart
```

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Только backend
docker compose logs -f backend
```

### Очистка данных

```bash
# Удалить volumes (БД, Redis)
docker compose down -v

# Полная очистка (образы + volumes)
docker compose down -v --rmi local
```

---

## Работа с базой данных

### Подключение через Adminer

1. Откройте http://localhost:8082
2. Заполните:
   - **Сервер**: `postgres`
   - **Пользователь**: `maxnews`
   - **Пароль**: `maxnews_secret`
   - **База данных**: `maxnews`

### Подключение через командную строку

```bash
# PostgreSQL
docker compose exec postgres psql -U maxnews -d maxnews

# Redis
docker compose exec redis redis-cli
```

---

## Решение проблем

### Порт уже занят

Измените порты в `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # вместо 80:80
```

### Контейнер не запускается

```bash
# Посмотреть логи
docker compose logs backend

# Проверить статус
docker compose ps
```

### Ошибка подключения к БД

```bash
# Перезапустить PostgreSQL
docker compose restart postgres

# Подождать 10 секунд и проверить
docker compose exec postgres pg_isready
```

### Нет данных после запуска

```bash
# Применить миграции
docker compose exec backend npx prisma migrate deploy

# Заполнить тестовыми данными
docker compose exec backend npx prisma db seed
```

---

## Обновление

```bash
# Скачать новые образы
docker compose pull

# Пересобрать и перезапустить
docker compose up -d --build
```

---

## Бэкап и восстановление

### Создать бэкап БД

```bash
mkdir -p ./backups
docker compose exec -T postgres pg_dump -U maxnews maxnews > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановить из бэкапа

```bash
cat ./backups/backup.sql | docker compose exec -T postgres psql -U maxnews maxnews
```

---

## Мониторинг ресурсов

```bash
# Использование CPU/RAM контейнерами
docker stats
```

---

## Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker compose logs -f`
2. Убедитесь, что все переменные в `.env` заполнены
3. Проверьте системные требования
4. Попробуйте полную очистку: `docker compose down -v && docker compose up -d --build`

При необходимости создайте issue в репозитории с описанием проблемы и логами.
