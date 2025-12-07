import { wsServer } from "#ws/server.js";
import { connectRabbit } from "#lib/rabbit.js";
import { registerMessaging } from "#messaging/consumer.js";
import { logger } from "#lib/log/log.js";
import { produceFail } from "#lib/fail/fail.js";
import { startDocsServer } from "#lib/staticServer.js";

async function main() {
  await connectRabbit();
  await registerMessaging();
  await wsServer.init();

  startDocsServer(process.env.DOCS_PORT || 4001);
}

const finalErrorCatch = (e) => {
  const err = produceFail("rL1h3Y7SJ11lL0Y2", e);
  logger[err.logger.literal](err.serverPrepare());
};

main().catch((e) => {
  finalErrorCatch(e);
});

process.on("unhandledRejection", finalErrorCatch);
process.on("uncaughtException", finalErrorCatch);
