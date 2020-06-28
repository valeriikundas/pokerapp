.PHONY: redis postgres

install:
	poetry install

run:  
	poetry run python start_server.py

rabbitmq:
	docker run -d -p 5672:5672 -e RABBITMQ_PASSWORD=password --name poker-rabbitmq bitnami/rabbitmq

postgres:
	docker run -d -p 5434:5432 -e POSTGRES_DB=poker -e POSTGRES_PASSWORD=password --name poker-postgres postgres

redis:
	docker run -d -p 6379:6379 --name poker-redis redis

idb:
	dropdb --if-exists poker
	createdb poker
	flask db upgrade

install:
	poetry install

run: 
	poetry run python backend.py