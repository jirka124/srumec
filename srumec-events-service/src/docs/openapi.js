import { createDocument } from "zod-openapi";
import * as z from "zod";
import { FailResponseSchema, DeleteResSchema } from "#validators/common.js";
import {
  EventCreateReqSchema,
  EventUpdateReqSchema,
  GetOneReqSchema,
  GetNearbyReqSchema,
  DeleteOneReqSchema,
  EventSchema,
} from "#validators/eventSchemas.js";
import {
  CommentSchema,
  CommentCreateReqSchema,
  CommentUpdateReqSchema,
  CommentGetAllReqSchema,
  CommentDeleteReqSchema,
} from "#validators/commentSchemas.js";

const defaultResponse = (code) => {
  let description = null;
  if (code === 400) description = "Invalid request";
  else if (code === 401) description = "Unauthorized";
  else if (code === 404) description = "Not Found";
  else if (code === 500) description = "Internal Server Error";
  else throw new Error("Unknown response code");

  return {
    [code]: {
      description,
      content: {
        "application/json": {
          schema: FailResponseSchema,
        },
      },
    },
  };
};

export function generateOpenApiSpec() {
  return createDocument({
    openapi: "3.1.0",
    info: {
      title: "Šrumec Events Service API",
      version: "1.0.0",
      description:
        "API for events and comments in the Šrumec microservice system",
    },

    servers: [
      {
        url: "http://localhost:4000",
        description: "Local dev server",
      },
    ],

    // ------------- PATHS -------------
    paths: {
      // ---------------- EVENTS ----------------
      "/v1/events/create-one": {
        post: {
          summary: "Create an event",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: EventCreateReqSchema.meta({
                  description: "Event create request payload",
                }),
              },
            },
          },
          responses: {
            200: {
              description: "Event created",
              content: {
                "application/json": {
                  schema: EventSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/update-one": {
        post: {
          summary: "Update an event",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: EventUpdateReqSchema.meta({
                  description: "Event update request payload",
                }),
              },
            },
          },
          responses: {
            200: {
              description: "Event updated",
              content: {
                "application/json": {
                  schema: EventSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(404),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/get-one": {
        post: {
          summary: "Get one event by ID",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetOneReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Event data",
              content: {
                "application/json": {
                  schema: EventSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(404),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/get-nearby": {
        post: {
          summary: "Get events near a location",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetNearbyReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Nearby events list",
              content: {
                "application/json": {
                  schema: z.array(EventSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/my-events": {
        post: {
          summary: "Get all events created by the authenticated user",
          description:
            "Returns all events created by the user based on JWT identity. Does not require request body.",
          responses: {
            200: {
              description: "List of user's own events",
              content: {
                "application/json": {
                  schema: z.array(EventSchema),
                },
              },
            },
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/pending": {
        post: {
          summary: "Get all pending events",
          description: "Returns all events whose status is 'pending'.",
          responses: {
            200: {
              description: "List of pending events",
              content: {
                "application/json": {
                  schema: z.array(EventSchema),
                },
              },
            },
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/events/delete-one": {
        post: {
          summary: "Delete an event by ID",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteOneReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Event deleted",
              content: {
                "application/json": {
                  schema: DeleteResSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      // ---------------- COMMENTS ----------------
      "/v1/comments/get-all": {
        post: {
          summary: "Get all comments for an event",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CommentGetAllReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "List of comments",
              content: {
                "application/json": {
                  schema: z.array(CommentSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/comments/create-one": {
        post: {
          summary: "Create a comment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CommentCreateReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Comment created",
              content: {
                "application/json": {
                  schema: CommentSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/comments/update-one": {
        post: {
          summary: "Update a comment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CommentUpdateReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Comment updated",
              content: {
                "application/json": {
                  schema: CommentSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(404),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/comments/delete-one": {
        post: {
          summary: "Delete a comment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CommentDeleteReqSchema,
              },
            },
          },
          responses: {
            200: {
              description: "Comment deletion result",
              content: {
                "application/json": {
                  schema: DeleteResSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },
    },
  });
}
