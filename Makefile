# clean up, build and run
run-clean: clean run

run:
	docker compose up -d
	$(MAKE) build
	docker compose up rustapp

# build the docker image
build:
	docker compose build

# clean up docker compose containers
clean:
	docker compose down -v