import express from "express";
import errorHandler from "express-async-error";
import swaggerUi from "swagger-ui-express";
import redocExpress from "redoc-express";
import eventRoutes from "#routes/eventRoutes.js";
import commentRoutes from "#routes/commentRoutes.js";
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

app.get("/v1/events/", (req, res) => {
  res.send("Events service is running");
});

app.get(
  "/v1/events/docs",
  redocExpress({
    title: "Srumec Events API Docs (ReDoc)",
    specUrl: "/v1/events/docs-raw",
    nonce: "",
  })
);
app.use(
  "/v1/events/docs-swagger",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec)
);
app.get("/v1/events/docs-raw", (req, res) => {
  res.json(openApiSpec);
});

// REST API
app.use("/v1/events", eventRoutes);
app.use("/v1/comments", commentRoutes);

app.use(catchError);

app.listen(PORT, () => {
  logger.info(`Events service listening on port ${PORT}`);
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
