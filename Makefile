.PHONY: help up down logs url sh lint format

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

up: ## Start the dev server in the background
	docker compose up -d

down: ## Stop the dev server
	docker compose down

logs: ## Follow the dev server logs
	docker compose logs -f web

url: ## Print the dev server URL
	@echo "http://localhost:$$(docker compose port web 3000 | cut -d: -f2)"

sh: ## Open a shell in the web container
	docker compose exec web sh

lint: ## Run ESLint
	docker compose exec web yarn lint

format: ## Run Prettier
	docker compose exec web yarn format
