FROM rabbitmq:3-management

# Add envsubst
RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

# Copy template and entrypoint
COPY definitions.template.json /etc/rabbitmq/definitions.template.json
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Mark as executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Tell RabbitMQ to load definitions.json
ENV RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbitmq_management load_definitions \"/etc/rabbitmq/definitions.json\""

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]