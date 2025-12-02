# Shrumec RabbitMQ Client

A lightweight, resilient RabbitMQ client for Node.js with:

- automatic reconnect
- full topology recovery (exchanges, queues, bindings, consumers)
- offline message buffering
- publisher confirms
- built-in RPC request/response
- simple and friendly API

---

## 📦 Installation

```bash
npm install @srumec/rabbitmq-client
```

Import:

```js
import { RabbitClient } from "shrumec-rabbitmq-client/js/RabbitClient.js";
```

---

## 🚀 Getting Started

```js
const rabbit = new RabbitClient("amqp://localhost:5672");
await rabbit.connect();
```

---

# 📚 Public API Reference

Below are **all public methods** with consistent parameter tables.

---

# 1️⃣ connect()

```js
await rabbit.connect();
```

### Parameters

| Name      | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| `retries` | number | Max reconnect attempts (default 20) |
| `options` | object | Internal use (`isFirstTimeInit`)    |

### Description

Establishes a connection, creates channels, registers reconnect handlers, starts auto‑flush, and creates the internal replyTo queue.

---

# 2️⃣ assertExchange()

```js
await rabbit.assertExchange("my-exchange", "topic");
```

### Parameters

| Name       | Type   | Description                                          |
| ---------- | ------ | ---------------------------------------------------- |
| `exchange` | string | Exchange name                                        |
| `type`     | string | Exchange type (default: `"topic"`)                   |
| `options`  | object | AMQP exchange options (default: `{ durable: true }`) |

### Description

Declares an exchange and registers it for topology recovery.

---

# 3️⃣ assertQueue()

```js
await rabbit.assertQueue("queue", { durable: true });
```

### Parameters

| Name      | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| `queue`   | string | Queue name                                  |
| `options` | object | Queue options (`durable: true` recommended) |

### Description

Declares a queue and registers it for topology recovery.

---

# 4️⃣ bindQueue()

```js
await rabbit.bindQueue("queue", "exchange", "routing.key");
```

### Parameters

| Name         | Type   | Description         |
| ------------ | ------ | ------------------- |
| `queue`      | string | Queue to bind       |
| `exchange`   | string | Exchange name       |
| `routingKey` | string | Binding routing key |

### Description

Binds a queue to an exchange and stores the binding for recovery.

---

# 5️⃣ consume()

```js
await rabbit.consume("queue", async (msg, ctx) => {});
```

### Parameters

| Name      | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `queue`   | string   | Queue to consume                        |
| `handler` | function | `(msg, ctx, queueName)` message handler |

### Description

Registers a consumer (restored on reconnect).  
Messages are JSON‑parsed. ACK/NACK handled automatically.

---

# 6️⃣ publish()

```js
await rabbit.publish("exchange", "key", { hello: "world" });
```

### Parameters

| Name         | Type          | Description                                       |
| ------------ | ------------- | ------------------------------------------------- |
| `exchange`   | string        | Target exchange                                   |
| `routingKey` | string        | Routing key                                       |
| `message`    | object        | JSON payload                                      |
| `options`    | object        | AMQP publish options (`persistent: true` default) |
| `timeout`    | number / null | Publish confirm timeout                           |

### Description

Publishes a message using publisher confirms.  
If offline, message is added to the offline buffer and sent later.

---

# 7️⃣ publishRPC()

```js
const res = await rabbit.publishRPC("exchange", "rpc.key", payload);
```

### Parameters

| Name             | Type          | Description                      |
| ---------------- | ------------- | -------------------------------- |
| `exchange`       | string        | Target exchange                  |
| `routingKey`     | string        | Routing key                      |
| `message`        | object        | JSON payload                     |
| `options`        | object        | Additional publish options       |
| `publishTimeout` | number / null | Timeout for publish confirm      |
| `rpcTimeout`     | number        | Timeout waiting for RPC response |

### Description

Sends a message and waits for a reply through a temporary exclusive replyTo queue.  
Handles correlation IDs, publish confirms, timeouts, offline buffering.

---

# 8️⃣ answerRPC()

```js
await rabbit.answerRPC(ctx, { result: 123 });
```

### Parameters

| Name      | Type          | Description                                         |
| --------- | ------------- | --------------------------------------------------- |
| `ctx`     | object        | AMQP message containing `replyTo` + `correlationId` |
| `data`    | object        | RPC response payload                                |
| `options` | object        | Publish options                                     |
| `timeout` | number / null | Publish confirm timeout                             |

### Description

Sends an RPC response to the client's temporary replyTo queue.  
Automatically applies correct correlationId.

---

# 9️⃣ waitFor()

```js
await rabbit.waitFor("connected");
```

### Parameters

| Name    | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| `event` | string | Event name emitted by RabbitClient |

### Description

Returns a promise that resolves when the event is next emitted.

---

## 🔄 Automatic Reconnect

On reconnect, the client automatically restores:

- exchanges
- queues
- bindings
- consumers
- reply queue
- and flushes offline messages

Available events:

```
connected
reconnected
conn-closed
offline-queue-flushed
```

---

## 🧠 Best Practices

- use `durable: true` for all main queues
- don’t manually recreate consumers after reconnect

---

## 📝 License

MIT  
Created by jirka124
