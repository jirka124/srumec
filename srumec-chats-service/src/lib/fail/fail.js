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
  "4c0VJLR0rAqYnQKr": {
    message: "Failed to get group rooms",
  },
  moyxlkCSZUmZ6oHc: {
    message: "Failed to get one group room",
  },
  ckGAYzNnWCYkhWGV: {
    message: "Failed to get one group room",
  },
  rBtJzMW6EgdCiyh6: {
    message: "Failed to create group room",
  },
  S6dMzCMOFJ3IiFpx: {
    message: "Failed to update group room",
  },
  nRqUUUr431VBaFGq: {
    message: "Failed to delete group room",
  },
  TJdMl5QKdmUjneJi: {
    message: "Failed to get direct rooms",
  },
  "5DkTtaIOyxYvO41n": {
    message: "Failed to get one direct room",
  },
  dPzicAmhxPQV3TiR: {
    message: "Failed to get one direct room",
  },
  bxJIfB6nxlSOzTGk: {
    message: "Failed to create direct room",
  },
  MGhHfSA5nuALyYuy: {
    message: "Failed to update direct room",
  },
  "8m4JFoHIruZf8iHc": {
    message: "Failed to delete direct room",
  },
  uTngf8rBFMGl2kG9: {
    message: "Failed to get messages of group room",
  },
  "9KcNFh86gHjwlCVn": {
    message: "Failed to create group message",
  },
  Jy23koECl49i2xJC: {
    message: "Failed to update group message",
  },
  kWo4VQsP8eE2Ju9b: {
    message: "Failed to update group message",
  },
  sGo1aopwfF46boKb: {
    message: "Failed to delete group message",
  },
  Ya6Z2FzCIA3NvxGL: {
    message: "Failed to get messages of direct room",
  },
  RNKOK3u0ZmKxCgeu: {
    message: "Failed to create direct message",
  },
  PMD7ZyzK2fQm6sqQ: {
    message: "Failed to update direct message",
  },
  AC5GC5tGJWjanhGH: {
    message: "Failed to update direct message",
  },
  KTaKlBo3mVinXUXn: {
    message: "Failed to delete direct message",
  },
  TIjIYLfwEDZ62Akf: {
    message: "Failed to get members of group room",
  },
  "1FIhyHBTUlLcL7js": {
    message: "Failed to create member of group room",
  },
  yyIABXBK85axWgp5: {
    message: "Failed to update member of group room",
  },
  "0Xv61NTDGpKAEt1c": {
    message: "Failed to update member of group room",
  },
  r8KwwKq0XZbKAp5s: {
    message: "Failed to delete member of group room",
  },
};

export const produceFail = (failHash, detail = null) => {
  if (Object.hasOwn(fails, failHash))
    return new Fail(failHash, fails[failHash].message, detail);

  throw new Error("Fail not found");
};
