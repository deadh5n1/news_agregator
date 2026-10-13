.PHONY: help install dev build up down restart logs clean ps

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Показать справку
	@echo ""
	@echo "$(GREEN)MaxNews — Команды управления$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Установить зависимости
	@echo "$(GREEN)Установка зависимостей...$(NC)"
	npm install
	@echo "$(GREEN)Готово!$(NC)"

dev: ## Запустить в режиме разработки
	@echo "$(GREEN)Запуск development окружения...$(NC)"
	docker compose -f docker-compose.dev.yml up -d
	@echo ""
	@echo "$(GREEN)Сервисы запущены:$(NC)"
	@echo "  Frontend:  http://localhost:5173"
	@echo "  Backend:   http://localhost:3000"
	@echo "  Adminer:   http://localhost:8082"
	@echo "  Redis:     http://localhost:8081"
	@echo ""

build: ## Собрать production-образы
	@echo "$(GREEN)Сборка production образов...$(NC)"
	docker compose build
	@echo "$(GREEN)Сборка завершена!$(NC)"

up: ## Запустить production-версию
	@echo "$(GREEN)Запуск production окружения...$(NC)"
	docker compose up -d
	@echo ""
	@echo "$(GREEN)Сервисы запущены:$(NC)"
	@echo "  Frontend:  http://localhost"
	@echo "  Backend:   http://localhost:3000"
	@echo "  Adminer:   http://localhost:8082"
	@echo "  Redis:     http://localhost:8081"
	@echo ""

down: ## Остановить все сервисы
	@echo "$(YELLOW)Остановка сервисов...$(NC)"
	docker compose down
	@echo "$(GREEN)Сервисы остановлены$(NC)"

restart: ## Перезапустить все сервисы
	@echo "$(YELLOW)Перезапуск сервисов...$(NC)"
	docker compose restart
	@echo "$(GREEN)Сервисы перезапущены$(NC)"

logs: ## Показать логи всех сервисов
	docker compose logs -f

logs-backend: ## Показать логи backend
	docker compose logs -f backend

logs-frontend: ## Показать логи frontend
	docker compose logs -f frontend

ps: ## Показать статус контейнеров
	docker compose ps

clean: ## Остановить и удалить все данные
	@echo "$(YELLOW)Удаление всех данных...$(NC)"
	docker compose down -v --rmi local
	@echo "$(GREEN)Очистка завершена$(NC)"

db-migrate: ## Применить миграции БД
	@echo "$(GREEN)Применение миграций...$(NC)"
	docker compose exec backend npx prisma migrate deploy
	@echo "$(GREEN)Миграции применены$(NC)"

db-seed: ## Заполнить БД тестовыми данными
	@echo "$(GREEN)Заполнение тестовыми данными...$(NC)"
	docker compose exec backend npx prisma db seed
	@echo "$(GREEN)Готово$(NC)"

db-reset: ## Сбросить БД и применить миграции
	@echo "$(YELLOW)Сброс базы данных...$(NC)"
	docker compose exec backend npx prisma migrate reset --force
	@echo "$(GREEN)База данных сброшена$(NC)"

shell-backend: ## Войти в shell контейнера backend
	docker compose exec backend sh

shell-postgres: ## Войти в psql
	docker compose exec postgres psql -U maxnews -d maxnews

shell-redis: ## Войти в redis-cli
	docker compose exec redis redis-cli

health: ## Проверить здоровье всех сервисов
	@echo "$(GREEN)Проверка здоровья сервисов...$(NC)"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost/health > /dev/null && echo "  ✓ OK" || echo "  ✗ DOWN"
	@echo "Backend:"
	@curl -s http://localhost:3000/health > /dev/null && echo "  ✓ OK" || echo "  ✗ DOWN"
	@echo "PostgreSQL:"
	@docker compose exec -T postgres pg_isready > /dev/null && echo "  ✓ OK" || echo "  ✗ DOWN"
	@echo "Redis:"
	@docker compose exec -T redis redis-cli ping > /dev/null && echo "  ✓ OK" || echo "  ✗ DOWN"
	@echo ""

stats: ## Показать использование ресурсов
	docker stats

update: ## Обновить образы и перезапустить
	@echo "$(GREEN)Обновление образов...$(NC)"
	docker compose pull
	docker compose up -d --build
	@echo "$(GREEN)Обновление завершено$(NC)"

backup-db: ## Сделать бэкап PostgreSQL
	@echo "$(GREEN)Создание бэкапа БД...$(NC)"
	@mkdir -p ./backups
	@docker compose exec -T postgres pg_dump -U maxnews maxnews > ./backups/maxnews_backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Бэкап создан в ./backups/$(NC)"

restore-db: ## Восстановить БД из бэкапа (использование: make restore-db FILE=backups/backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)Укажите файл: make restore-db FILE=backups/backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Восстановление из $(FILE)...$(NC)"
	@cat $(FILE) | docker compose exec -T postgres psql -U maxnews maxnews
	@echo "$(GREEN)Восстановление завершено$(NC)"
