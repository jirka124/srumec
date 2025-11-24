import { RabbitClient } from "../js/index.js";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

const rabbit1 = new RabbitClient(RABBIT_URL);
const rabbit2 = new RabbitClient(RABBIT_URL);

const consumeFunction = async (content, ctx, queue) => {
  if (ctx.properties.correlationId && ctx.properties.replyTo) {
    if (content?.key === "add_numbers") {
      rabbit2.answerRPC(ctx, {
        result: Number(content?.op1) + Number(content?.op2),
      });
    } else {
      rabbit2.answerRPC(ctx, {
        result: "unknown key: " + content?.key,
      });
    }
  } else {
    console.log("Received message:", content, queue, ctx.fields.consumerTag);
  }
};

(async () => {
  try {
    await rabbit1.connect();
    await rabbit2.connect();

    const EXCHANGE = "sandbox-exchange";
    const QUEUE_1 = "sandbox-queue";
    const QUEUE_2 = "sandbox-queue-1";
    const QUEUE_3 = "sandbox-queue-2";

    await rabbit1.assertExchange(EXCHANGE, "topic", { durable: true });
    await rabbit2.assertExchange(EXCHANGE, "topic", { durable: true });

    await rabbit1.assertQueue(QUEUE_1, { durable: true });
    await rabbit1.assertQueue(QUEUE_2, { durable: true });
    await rabbit2.assertQueue(QUEUE_1, { durable: true });
    await rabbit2.assertQueue(QUEUE_3, { durable: true });

    await rabbit1.bindQueue(QUEUE_1, EXCHANGE, "sandbox"); // load-balance any sandbox
    await rabbit1.bindQueue(QUEUE_2, EXCHANGE, "sandbox.1"); // unique direct queue
    await rabbit1.bindQueue(QUEUE_2, EXCHANGE, "orange.*"); // subscribe to any event interested
    await rabbit2.bindQueue(QUEUE_1, EXCHANGE, "sandbox"); // load-balance any sandbox
    await rabbit2.bindQueue(QUEUE_3, EXCHANGE, "sandbox.2"); // unique direct queue
    await rabbit2.bindQueue(QUEUE_3, EXCHANGE, "apple.*"); // subscribe to any event interested

    await rabbit1.consume(QUEUE_1, consumeFunction);
    await rabbit1.consume(QUEUE_2, consumeFunction);
    await rabbit2.consume(QUEUE_1, consumeFunction);
    await rabbit2.consume(QUEUE_3, consumeFunction);

    console.log("Sandbox ready! Sending test messages...");

    rabbit1.publish(EXCHANGE, "sandbox.2", {
      message: "From sandbox-1 to sandbox-2",
    });
    for (let i = 0; i < 10; i++) {
      rabbit1.publish(EXCHANGE, "sandbox", {
        message: "From sandbox-1 to any sandbox",
      });
    }
    rabbit1.publish(EXCHANGE, "orange.update", {
      message: "From sandbox-1 to subscribers of orange (sandbox-1)",
    });
    rabbit1.publish(EXCHANGE, "apple.delete", {
      message: "From sandbox-1 to subscribers of apple (sandbox-2)",
    });
    let reqParams = {
      key: "add_numbers",
      op1: 45,
      op2: 56,
    };
    const res1 = await rabbit1.publishRPC(EXCHANGE, "sandbox.2", reqParams);
    console.log(
      `RPC returned (${reqParams.op1} + ${reqParams.op2}) = ${res1.result}`
    );

    const closePromise = Promise.all([
      rabbit1.waitFor("conn-closed"),
      rabbit2.waitFor("conn-closed"),
    ]);

    const reconnPromise = Promise.all([
      rabbit1.waitFor("reconnected"),
      rabbit2.waitFor("reconnected"),
    ]);

    const flushPromise = rabbit1.waitFor("offline-queue-flushed");

    console.log("------ TURN OFF RABBITMQ ------");
    await closePromise;

    console.log("Sending offline messages");
    const waitForSendPublish = rabbit1.publish(EXCHANGE, "sandbox.2", {
      message: "From sandbox-1 to sandbox-2 while offline",
    });
    waitForSendPublish.then((val) => {
      console.log(
        "waitForSendPublish RESOLVED WITH: ",
        val,
        waitForSendPublish
      );
    });

    reqParams = {
      key: "add_numbers",
      op1: 1,
      op2: 2,
    };

    const offlineRPCPromise = rabbit1
      .publishRPC(EXCHANGE, "sandbox.2", reqParams, {}, null, 30000)
      .then((res) =>
        console.log(
          `RPC returned after offline (${reqParams.op1} + ${reqParams.op2}) = ${res.result}`
        )
      );

    console.log("------ TURN ON RABBITMQ ------");
    await reconnPromise;
    console.log("------ RABBITMQ RECONNECTED ------");
    await flushPromise;
    console.log("------ RABBITMQ FLUSHED ------");
    await offlineRPCPromise;

    console.log("Sending online messages after recovery");
    rabbit1.publish(EXCHANGE, "sandbox.2", {
      message: "From sandbox-1 to sandbox-2 after recovery",
    });

    reqParams = {
      key: "add_numbers",
      op1: 1000,
      op2: 220000,
    };

    const res3 = await rabbit1.publishRPC(
      EXCHANGE,
      "sandbox.2",
      reqParams,
      {},
      1200000
    );
    console.log(
      `RPC returned after recovery (${reqParams.op1} + ${reqParams.op2}) = ${res3.result}`
    );
  } catch (e) {
    console.error(e);
  }
})();
