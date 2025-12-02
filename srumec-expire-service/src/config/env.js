export const config = {
  rabbitUrl: process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  eventsExchange: "events_exchange",
  expireExchange: "expire_exchange",
  serviceName: process.env.SERVICE_NAME ?? "expire-service",
};
