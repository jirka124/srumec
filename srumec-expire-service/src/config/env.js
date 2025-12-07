export const config = {
  rabbitUrl: `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:5672`,
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  eventsExchange: "events_exchange",
  expireExchange: "expire_exchange",
  serviceName: process.env.SERVICE_NAME ?? "expire-service",
};
