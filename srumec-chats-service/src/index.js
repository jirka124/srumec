import express from "express";
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

const openApiSpec = generateOpenApiSpec();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Chats service is running");
});

// REST API
app.use("/v1/chats/direct", directRoomRoutes);
app.use("/v1/chats/group", groupRoomRoutes);
app.use("/v1/chats/direct/messages", directMessageRoutes);
app.use("/v1/chats/group/messages", groupMessageRoutes);
app.use("/v1/chats/group/members", chatGroupMemberRoutes);

app.get(
  "/docs",
  redocExpress({
    title: "Srumec Chats API Docs (ReDoc)",
    specUrl: "/docs-raw",
    nonce: "",
  })
);
app.use("/docs-swagger", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get("/docs-raw", (req, res) => {
  res.json(openApiSpec);
});

app.listen(PORT, () => {
  logger.info(`Chats service listening on port ${PORT}`);
});

export default app;
