import { produceFail } from "#lib/fail/fail.js";
import { logger } from "#lib/log/log.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const err = produceFail("kpAykR5UXDLMdLFK", result.error.flatten());
      logger.error(err.serverPrepare());
      return res.status(400).json(err.clientPrepare());
    }

    req.validated = result.data;
    next();
  };
}
