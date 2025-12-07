export const config = {
  rabbitUrl: process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672",
  chatsExchange: "chats_exchange",
};
