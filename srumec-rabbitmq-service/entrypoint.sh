#!/bin/sh
set -e

echo "→ Generating RabbitMQ definitions.json using env vars..."
envsubst < /etc/rabbitmq/definitions.template.json > /etc/rabbitmq/definitions.json

echo "→ Starting RabbitMQ..."
exec rabbitmq-server
