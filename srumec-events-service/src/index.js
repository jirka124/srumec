import express from "express";
import errorHandler from "express-async-error";
import swaggerUi from "swagger-ui-express";
import redocExpress from "redoc-express";
import eventRoutes from "#routes/eventRoutes.js";
import commentRoutes from "#routes/commentRoutes.js";
import { generateOpenApiSpec } from "#root/docs/openapi.js";
import { logger } from "#lib/log/log.js";
import { catchError } from "#middleware/error-catcher.js";
import { logEndpoint } from "#middleware/endpoint-log.js";

const openApiSpec = generateOpenApiSpec();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(errorHandler.Handler());
app.use(express.json());
app.use(logEndpoint);

app.get("/v1/events/", (req, res) => {
  res.send("Events service is running");
});

// REST API
app.use("/v1/events", eventRoutes);
app.use("/v1/comments", commentRoutes);

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

app.use(catchError);

app.listen(PORT, () => {
  logger.info(`Events service listening on port ${PORT}`);
});
