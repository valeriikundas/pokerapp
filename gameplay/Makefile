.PHONY: rabbitmq postgres install run

rabbitmq:
	docker start poker-rabbitmq || docker run -d -p 5672:5672 -e RABBITMQ_PASSWORD=password --name poker-rabbitmq bitnami/rabbitmq

redis:
	docker run --name redis -d -p 6379:6379 redis

postgres:
	docker start postgres || docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password --name poker-postgres postgres

install:
	poetry install

run:  
	poetry run python start_server.py