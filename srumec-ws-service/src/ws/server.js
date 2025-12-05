import { WebSocketServer } from "ws";
import { decodeJwtFromRequest } from "#lib/jwt.js";
import { logger } from "#lib/log/log.js";

const PORT = process.env.PORT || 4000;

export class WsServer {
  wss = null;
  clients = new Map();
  #keepAliveInterval = null;
  #port = 4000;

  constructor({ port }) {
    this.#port = port ?? this.#port;
  }

  async init() {
    return new Promise((res, rej) => {
      this.wss = new WebSocketServer({ port: this.#port }, () => {
        logger.info("WS service listening on port", this.#port);
        res(this.wss);
      });

      this.wss.on("connection", this.onWsConnection);

      this.#startKeepAlive();
    });
  }

  initWs({ ws, userId }) {
    ws.isAlive = true;
    ws.userId = userId;

    ws.on("pong", () => {
      this.onWsPong(ws);
    });

    ws.on("message", (rawMessage) => {
      this.onWsMessage(ws, rawMessage);
    });

    ws.on("close", () => {
      this.onWsClose(ws);
    });
  }

  sendToClientsJSON(clients, content) {
    this.sendToClients(clients, JSON.stringify(content));
  }

  sendToClients(clients = [], content) {
    if (typeof clients === "string") clients = [clients];

    if (clients === null) {
      for (const ws of this.wss.clients) {
        if (ws.readyState === ws.OPEN) ws.send(content);
      }
      return;
    }

    if (!Array.isArray(clients) || clients.length === 0) {
      return;
    }

    for (const userId of clients) {
      const set = this.clients.get(userId);
      if (!set) continue;

      for (const ws of set) {
        if (ws.readyState === ws.OPEN) ws.send(content);
      }
    }
  }

  addClient(ws) {
    const userId = ws.userId;
    if (!this.clients.has(userId)) this.clients.set(userId, new Set());
    this.clients.get(userId).add(ws);
    logger.debug("User connected:", userId);
  }

  removeClient(ws) {
    const userId = ws.userId;
    if (!this.clients.has(userId)) return;
    const set = this.clients.get(userId);
    set.delete(ws);
    if (set.size === 0) this.clients.delete(userId);
    logger.debug("User disconnected:", userId);
  }

  onWsConnection = (ws, req) => {
    try {
      const payload = decodeJwtFromRequest(req);
      const userId = payload?.id;

      if (!payload || !userId) {
        ws.close();
        return;
      }

      this.initWs({ ws, userId });
      this.addClient(ws);
    } catch (e) {
      ws.close();
      throw e;
    }
  };

  onWsPong = (ws) => {
    logger.debug("Received PONG from client: " + ws.userId);
    ws.isAlive = true;
  };

  onWsMessage = (ws, rawMessage) => {
    try {
      const data = JSON.parse(rawMessage);
      logger.debug("received: ", data);
    } catch (err) {
      logger.debug("Invalid WS message:", err.message);
    }
  };

  onWsClose = (ws) => {
    console.log("CLOSED");
    this.removeClient(ws);
  };

  #startKeepAlive() {
    this.#keepAliveInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) {
          ws.terminate();
          continue;
        }
        ws.isAlive = false;
        logger.debug("Sending PING to client: " + ws.userId);
        ws.ping();
      }
    }, 30000);

    this.wss.on("close", () => clearInterval(this.#keepAliveInterval));
  }
}

export const wsServer = new WsServer({ port: PORT });
