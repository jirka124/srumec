export const LOG_LEVELS = Object.freeze({
  DEBUG: { literal: "debug", priority: 10 },
  INFO: { literal: "info", priority: 20 },
  WARN: { literal: "warn", priority: 30 },
  ERROR: { literal: "error", priority: 40 },
  FATAL: { literal: "fatal", priority: 50 },
});

const { LOG_LEVEL = "WARN" } = process.env;
const CURRENT_LEVEL = LOG_LEVELS[LOG_LEVEL] ?? LOG_LEVELS.WARN;

class Logger {
  constructor(level) {
    this.level = level;
  }

  debug(...args) {
    this.#log(LOG_LEVELS.DEBUG, console.debug, ...args);
  }

  info(...args) {
    this.#log(LOG_LEVELS.INFO, console.info, ...args);
  }

  warn(...args) {
    this.#log(LOG_LEVELS.WARN, console.warn, ...args);
  }

  error(...args) {
    this.#log(LOG_LEVELS.ERROR, console.error, ...args);
  }

  fatal(...args) {
    this.#log(LOG_LEVELS.FATAL, console.error, ...args);
  }

  #log(level, consoleFn, ...args) {
    if (level.priority >= this.level.priority) {
      consoleFn(...args);
    }
  }
}

export const logger = new Logger(CURRENT_LEVEL);
