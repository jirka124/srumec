FROM rabbitmq:3-management

# Nakopíruj konfiguraci a předdefinované queue/exchange/uživatele
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf
COPY definitions.json /etc/rabbitmq/definitions.json

# Povolíme načítání definic
ENV RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbitmq_management load_definitions \"/etc/rabbitmq/definitions.json\""

EXPOSE 5672 15672