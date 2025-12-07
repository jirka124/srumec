export const config = {
  rabbitUrl: `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:5672`,
  eventsExchange: "events_exchange",
  expireExchange: "expire_exchange",
};
