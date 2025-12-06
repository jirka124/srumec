import express from "express";
import errorHandler from "express-async-error";
import swaggerUi from "swagger-ui-express";
import redocExpress from "redoc-express";
import directRoomRoutes from "#routes/directRoomRoutes.js";
import groupRoomRoutes from "#routes/groupRoomRoutes.js";
import chatGroupMemberRoutes from "#routes/chatGroupMemberRoutes.js";
import directMessageRoutes from "#routes/directMessageRoutes.js";
import groupMessageRoutes from "#routes/groupMessageRoutes.js";
import { generateOpenApiSpec } from "#root/docs/openapi.js";
import { logger } from "#lib/log/log.js";
import { produceFail } from "#lib/fail/fail.js";
import { catchError } from "#middleware/error-catcher.js";
import { logEndpoint } from "#middleware/endpoint-log.js";
import { connectRabbit } from "#lib/rabbit.js";
import { registerMessaging } from "#messaging/consumer.js";

const openApiSpec = generateOpenApiSpec();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(errorHandler.Handler());
app.use(express.json());
app.use(logEndpoint);

app.get("/v1/chats/", (req, res) => {
  res.send("Chats service is running");
});

// REST API
app.use("/v1/chats/direct", directRoomRoutes);
app.use("/v1/chats/group", groupRoomRoutes);
app.use("/v1/chats/direct/messages", directMessageRoutes);
app.use("/v1/chats/group/messages", groupMessageRoutes);
app.use("/v1/chats/group/members", chatGroupMemberRoutes);

app.get(
  "/v1/chats/docs",
  redocExpress({
    title: "Srumec Chats API Docs (ReDoc)",
    specUrl: "/v1/chats/docs-raw",
    nonce: "",
  })
);
app.use(
  "/v1/chats/docs-swagger",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec)
);
app.get("/v1/chats/docs-raw", (req, res) => {
  res.json(openApiSpec);
});

app.use(catchError);

app.listen(PORT, () => {
  logger.info(`Chats service listening on port ${PORT}`);
});

async function main() {
  await connectRabbit();
  await registerMessaging();
}

const finalErrorCatch = (e) => {
  const err = produceFail("rL1h3Y7SJ11lL0Y2", e);
  logger[err.logger.literal](err.serverPrepare());
};

main().catch((e) => {
  finalErrorCatch(e);
});

process.on("unhandledRejection", (e) => {
  finalErrorCatch(e);
});

process.on("uncaughtException", (e) => {
  finalErrorCatch(e);
});

export default app;
