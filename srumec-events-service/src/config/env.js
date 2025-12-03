export const config = {
  rabbitUrl: process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672",
  eventsExchange: "events_exchange",
  expireExchange: "expire_exchange",
};
