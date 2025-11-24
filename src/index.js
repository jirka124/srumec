import express from "express";
import swaggerUi from "swagger-ui-express";
import redocExpress from "redoc-express";
import eventRoutes from "#routes/eventRoutes.js";
import commentRoutes from "#routes/commentRoutes.js";
import { generateOpenApiSpec } from "#root/docs/openapi.js";
import { logger } from "#lib/log/log.js";

const openApiSpec = generateOpenApiSpec();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Events service is running");
});

// REST API
app.use("/v1/events", eventRoutes);
app.use("/v1/comments", commentRoutes);

app.get(
  "/docs",
  redocExpress({
    title: "Srumec Events API Docs (ReDoc)",
    specUrl: "/docs-raw",
    nonce: "",
  })
);
app.use("/docs-swagger", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get("/docs-raw", (req, res) => {
  res.json(openApiSpec);
});

app.listen(PORT, () => {
  logger.info(`Events service listening on port ${PORT}`);
});
