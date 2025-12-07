import { logger } from "#lib/log/log.js";

export function wrapMessageHandler(handler, label = "") {
  return async (content, ctx, queue) => {
    const start = Date.now();

    const routingKey = ctx.fields.routingKey;
    const msgType = content?.type ?? "unknown.type";

    try {
      await handler(content, ctx, queue);

      const ms = Date.now() - start;

      logger.info(
        `Handled MSG -> route: ${routingKey} | type: ${msgType} | exec: ${ms}ms`
      );
    } catch (err) {
      const ms = Date.now() - start;

      logger.error(
        `Failed MSG -> route: ${routingKey} | type: ${msgType} | exec :${ms}ms\n${err}`
      );

      throw err;
    }
  };
}
