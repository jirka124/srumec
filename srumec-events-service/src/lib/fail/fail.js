const { DEBUG_LEVEL_SERVER = "AVG", DEBUG_LEVEL_CLIENT = "AVG" } = process.env;

export const DEBUG_LEVELS = Object.freeze({
  MAX: "MAX",
  AVG: "AVG",
  MIN: "MIN",
});

class Fail {
  constructor(failHash, message, detail) {
    this.failHash = failHash;
    if (message) this.message = message;
    if (detail) this.detail = detail;
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
    if (level === DEBUG_LEVELS.MAX) fail.detail = this.detail;

    return fail;
  }
}

export const fails = {
  kpAykR5UXDLMdLFK: {
    message: "Invalid request parameters",
  },
  "1TgWGUTBV3UTogTc": {
    message: "Failed to get nearby events",
  },
  iC2V355CDCYFTI9J: {
    message: "Failed to get event by id",
  },
  d5xC5Hfd9L4qN5Oc: {
    message: "Failed to get event by id",
  },
  T0UXlS6xs2tvp2hJ: {
    message: "Failed to create event",
  },
  "8sNY4yBPBmlQdV2n": {
    message: "Failed to update event",
  },
  pT6xNrqqC6PAV20J: {
    message: "Failed to update event",
  },
  TwlcQjNvJpEhfnLz: {
    message: "Failed to delete event",
  },
  uzgMMFIN6JCaB7ER: {
    message: "Failed to fetch comments",
  },
  cOxyZuGDMDUqgzyD: {
    message: "Failed to create comment",
  },
  gFVBfVaogwjLe1CK: {
    message: "Failed to update comment",
  },
  ZZu4ghBUlxie7YA5: {
    message: "Failed to update comment",
  },
  LgG6bt5I163ufpmi: {
    message: "Failed to delete comment",
  },
};

export const produceFail = (failHash, detail = null) => {
  if (Object.hasOwn(fails, failHash))
    return new Fail(failHash, fails[failHash].message, detail);

  throw new Error("Fail not found");
};
