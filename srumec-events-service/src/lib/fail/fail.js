import { LOG_LEVELS } from "#lib/log/log.js";

const { DEBUG_LEVEL_SERVER = "AVG", DEBUG_LEVEL_CLIENT = "AVG" } = process.env;

export const DEBUG_LEVELS = Object.freeze({
  MAX: "MAX",
  AVG: "AVG",
  MIN: "MIN",
});

export class Fail {
  constructor(failHash, message, detail, code, logger) {
    this.failHash = failHash;
    if (message) this.message = message;
    if (detail) this.detail = detail;
    if (code) this.code = code;
    if (logger) this.logger = logger;
  }

  serverPrepare() {
    // prepare fail payload depening on DEBUG_LEVEL_SERVER set
    return this.#prepare(DEBUG_LEVEL_SERVER);
  }

  clientPrepare() {
    // prepare fail payload depening on DEBUG_LEVEL_SERVER set
    return this.#prepare(DEBUG_LEVEL_CLIENT).encode();
  }

  encode() {
    // prepare fail for transport
    try {
      if (this.detail && this.detail instanceof Error)
        this.detail = this.detail.toString();
    } catch (_) {}

    return this;
  }

  #prepare(level) {
    const fail = new Fail(this.failHash);

    if (level === DEBUG_LEVELS.AVG || level === DEBUG_LEVELS.MAX)
      fail.message = this.message;
    if (level === DEBUG_LEVELS.MAX) {
      fail.detail = this.detail;
    }

    return fail;
  }
}

export const fails = {
  kpAykR5UXDLMdLFK: {
    message: "Invalid request parameters",
    logLevel: LOG_LEVELS.ERROR,
    code: 400,
  },
  Wv8o7lWyrWhnV6Ka: {
    message: "Authentication failed",
    logLevel: LOG_LEVELS.INFO,
    code: 401,
  },
  fIhz89IJJEKE44CU: {
    message: "Authentication failed",
    logLevel: LOG_LEVELS.INFO,
    code: 401,
  },
  MoC7EZHdBULE1Kq7: {
    message: "Authentication failed",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  rL1h3Y7SJ11lL0Y2: {
    message: "UNHANDLED_ERROR",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  "1TgWGUTBV3UTogTc": {
    message: "Failed to get nearby events",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  C0LoEpU54HpKrcSk: {
    message: "Failed to get event by id",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  oXC3mOcio5KQMt2M: {
    message: "Failed to get event by id",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  iC2V355CDCYFTI9J: {
    message: "Failed to get event by id",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  d5xC5Hfd9L4qN5Oc: {
    message: "Failed to get event by id",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  T0UXlS6xs2tvp2hJ: {
    message: "Failed to create event",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  JwhExzMzdJRiNDrH: {
    message: "Failed to update event",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  "8sNY4yBPBmlQdV2n": {
    message: "Failed to update event",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  pT6xNrqqC6PAV20J: {
    message: "Failed to update event",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  TwlcQjNvJpEhfnLz: {
    message: "Failed to delete event",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  QjhXwq0MCPKu36L8: {
    message: "Failed to delete event",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  uzgMMFIN6JCaB7ER: {
    message: "Failed to fetch comments",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  D2sdXWgw3AcgTuiC: {
    message: "Failed to fetch comment",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  bQZDS7VrdVUhETa9: {
    message: "Failed to fetch comment",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  cOxyZuGDMDUqgzyD: {
    message: "Failed to create comment",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  gFVBfVaogwjLe1CK: {
    message: "Failed to update comment",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  F3hmSSsCoP4xsOVO: {
    message: "Failed to update comment",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  ZZu4ghBUlxie7YA5: {
    message: "Failed to update comment",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  i2CezSCBpg9PO6F3: {
    message: "Failed to delete comment",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  LgG6bt5I163ufpmi: {
    message: "Failed to delete comment",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  AIhVz4L5GzpbzL4J: {
    message: "Failed to delete expired event",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },

  vPCfnXmsiwLlZ5PI: {
    message: "Request failed policy check",
    logLevel: LLOG_LEVELS.INFO,
    code: 403,
  },
  "2hzcG8oklWB568Ub": {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  fUJ6nWaUeOVZCW5F: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  MmsjudGgcjhKPL3k: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  gHPKiJPG30SkBEr9: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  gvSh2EPNekZNX8R4: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  eat8rREklgttGCQ7: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  RjuWiE3soHyRYi5m: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  NJKiZkKzMvFtHJGv: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  "8iZ0tCyXlIiuu02O": {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  "8QRfcIGlSh1wpuZz": {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
};

export const isFail = (fail) => {
  return fail instanceof Fail;
};

export const produceFail = (failHash, detail = null) => {
  if (isFail(detail)) return detail;

  if (Object.hasOwn(fails, failHash))
    return new Fail(
      failHash,
      fails[failHash].message,
      detail,
      fails[failHash].code,
      fails[failHash].logLevel
    );

  throw new Error("Fail not found");
};
