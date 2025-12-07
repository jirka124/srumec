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
    if (level === DEBUG_LEVELS.MAX) fail.detail = this.detail;

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
  "4c0VJLR0rAqYnQKr": {
    message: "Failed to get group rooms",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  moyxlkCSZUmZ6oHc: {
    message: "Failed to get one group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  ckGAYzNnWCYkhWGV: {
    message: "Failed to get one group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  rBtJzMW6EgdCiyh6: {
    message: "Failed to create group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  RkwhV7ULEauZSi91: {
    message: "Failed to update group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  S6dMzCMOFJ3IiFpx: {
    message: "Failed to update group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  "2aARk23JDGH2Xtr8": {
    message: "Failed to delete group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  nRqUUUr431VBaFGq: {
    message: "Failed to delete group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  TJdMl5QKdmUjneJi: {
    message: "Failed to get direct rooms",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  "5DkTtaIOyxYvO41n": {
    message: "Failed to get one direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  dPzicAmhxPQV3TiR: {
    message: "Failed to get one direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  bxJIfB6nxlSOzTGk: {
    message: "Failed to create direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  qfyUHgdTurIcknii: {
    message: "Failed to update direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  MGhHfSA5nuALyYuy: {
    message: "Failed to update direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  w2WWwhUVImgs0HLd: {
    message: "Failed to delete direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  "8m4JFoHIruZf8iHc": {
    message: "Failed to delete direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  uTngf8rBFMGl2kG9: {
    message: "Failed to get messages of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  m6KVhxq9qrYalkxm: {
    message: "Failed to get message of group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  Ve9gvXGIfyZ7OWwp: {
    message: "Failed to get message of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  "9KcNFh86gHjwlCVn": {
    message: "Failed to create group message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  Jy23koECl49i2xJC: {
    message: "Failed to update group message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  zdSE7hudqYfAS0pV: {
    message: "Failed to update group message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  kWo4VQsP8eE2Ju9b: {
    message: "Failed to update group message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  Op6MLAVOGSmEIHjT: {
    message: "Failed to delete group message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  sGo1aopwfF46boKb: {
    message: "Failed to delete group message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  WjmabVPRrhSEacUF: {
    message: "Failed to get messages of direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  Ya6Z2FzCIA3NvxGL: {
    message: "Failed to get messages of direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  egqRzJ5kYDGZS2ts: {
    message: "Failed to get message of direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  jABtk29m80RQLfPe: {
    message: "Failed to get message of direct room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  q9cRBoh8ERQnU5yl: {
    message: "Failed to get message of direct room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  YSR4eMl3NYVRQivW: {
    message: "Failed to create direct message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  RNKOK3u0ZmKxCgeu: {
    message: "Failed to create direct message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  SuimqpUkrU1cbaQ1: {
    message: "Failed to update direct message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  a49TjX06VogslYNW: {
    message: "Failed to update direct message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  PMD7ZyzK2fQm6sqQ: {
    message: "Failed to update direct message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  AC5GC5tGJWjanhGH: {
    message: "Failed to update direct message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  wUf7uMBcb0zvciev: {
    message: "Failed to delete direct message",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  KTaKlBo3mVinXUXn: {
    message: "Failed to delete direct message",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  TIjIYLfwEDZ62Akf: {
    message: "Failed to get members of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  "1FIhyHBTUlLcL7js": {
    message: "Failed to create member of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  yyIABXBK85axWgp5: {
    message: "Failed to update member of group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  "1THgDr0JauTDZpPW": {
    message: "Failed to update member of group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  "0Xv61NTDGpKAEt1c": {
    message: "Failed to update member of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  aaOlHQ63D5lhanen: {
    message: "Failed to delete member of group room",
    logLevel: LOG_LEVELS.INFO,
    code: 404,
  },
  r8KwwKq0XZbKAp5s: {
    message: "Failed to delete member of group room",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },
  YouizOnxAcqsIdkh: {
    message: "Failed to handle chat.message.get-consumers",
    logLevel: LOG_LEVELS.ERROR,
    code: 500,
  },

  j8EfOSXfaXHDynLJ: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  OrpBge3XS7DQMMgM: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  QsmuAMuVC5nfkbta: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  D3j1yilcfEp6AZm3: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  Atl3znHWpvR8qHve: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  "8hctBjphsTJtbCdq": {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  BgblPyoHXO4QjPfh: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  jTxAqhsXGaeBjIQV: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  pjFw66uuHZ6ABSk7: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  sB9B04L1kY1zy5YS: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  fshQRO7w97mcydXd: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  fF3oSrjhLkv6cSOK: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  MCa2EkEjcYzysfu4: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  TTgEERs1oyceawBY: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  hwKxAj1vNgjBdmHw: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  "4gCDsXQ2zdXbU5An": {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  ml2afNDLZ49rIMfw: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  RlWMj4RfrrY3samA: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  m0Y3zoqekLT3Haar: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  Nzz1zBsISkWqYmaI: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  L5Kw6I8sVTQ6GQib: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  fPljzlb9N2ePAD8y: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  y3HHFYazsMVAdg5u: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  qWoegT03orUEMge6: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  RZUUhCwrUp3PBNOu: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  IgO4202UNuPRkoKu: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  j1YQYhGrBNCtBfWj: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  mlvOQbuYa6VTZBRQ: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  KvqkdaTfQ9mqnqMe: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  vf2qsEbow2u6JORL: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  MzkCp4Xc5xuyvRLv: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  QgPgTrOgIxW8rOC5: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  ToHFb5B95jXBjiMh: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  TDIbXKi6SnZC8HIF: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  oB1FkQVefThQfk5g: {
    message: "Request failed policy check",
    logLevel: LOG_LEVELS.INFO,
    code: 403,
  },
  oriMk9Sq5w8KxBm7: {
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
