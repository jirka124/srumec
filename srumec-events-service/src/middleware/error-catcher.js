import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export function catchError(e, req, res, next) {
  const err = produceFail("rL1h3Y7SJ11lL0Y2", e);
  logger[err.logger.literal](err.serverPrepare());
  res.status(err.code).json(err.clientPrepare());
}
