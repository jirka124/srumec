import { logger } from "#lib/log/log.js";

export function logEndpoint(req, res, next) {
  const start = Date.now();
  logger.info(`Received ${req.method} ${req.originalUrl || req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      `Handled  ${req.method} ${
        req.originalUrl || req.url
      } : ${duration}ms HTTP-${res.statusCode}`
    );
  });

  next();
}
