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
  rL1h3Y7SJ11lL0Y2: {
    message: "UNHANDLED_ERROR",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  MWa2A5C7eqoeCaGb: {
    message: "WS failed to decode JWT",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
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
