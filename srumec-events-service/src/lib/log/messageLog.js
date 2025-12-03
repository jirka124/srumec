import { logger } from "#lib/log/log.js";

export function wrapMessageHandler(handler, label = "") {
  return async (content, ctx, queue) => {
    const start = Date.now();

    const routingKey = ctx.fields.routingKey;

    try {
      await handler(content, ctx, queue);

      const ms = Date.now() - start;

      logger.info(`Handled MSG ${routingKey} : ${ms}ms`);
    } catch (err) {
      const ms = Date.now() - start;

      logger.error(`Failed MSG ${routingKey} : ${ms}ms\n${err}`);

      throw err;
    }
  };
}
