import { wsServer } from "#ws/server.js";
import { connectRabbit } from "#lib/rabbit.js";
import { logger } from "#lib/log/log.js";
import { produceFail } from "#lib/fail/fail.js";

async function main() {
  await connectRabbit();
  await wsServer.init();
}

const finalErrorCatch = (e) => {
  const err = produceFail("rL1h3Y7SJ11lL0Y2", e);
  logger[err.logger.literal](err.serverPrepare());
};

main().catch((e) => {
  finalErrorCatch(e);
});

process.on("unhandledRejection", (e) => {
  finalErrorCatch(e);
});

process.on("uncaughtException", (e) => {
  finalErrorCatch(e);
});
