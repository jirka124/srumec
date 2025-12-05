import { createDocument } from "zod-openapi";
import * as z from "zod";

import { FailResponseSchema, DeleteResSchema } from "#validators/common.js";

import {
  ChatRoomGroupMemberSchema,
  GetAllGroupMembersReq,
  GetAllGroupMembersRes,
  CreateGroupMemberReq,
  CreateGroupMemberRes,
  UpdateGroupMemberReq,
  UpdateGroupMemberRes,
  DeleteGroupMemberReq,
} from "#validators/chatGroupMemberSchemas.js";

import {
  ChatMessageSchema,
  GetAllMessagesReq,
  GetOneMessageReq,
  CreateMessageReq,
  UpdateMessageReq,
  DeleteOneMessageReq,
} from "#validators/chatMessageSchemas.js";

import {
  ChatRoomDirectSchema,
  ChatRoomGroupSchema,
  GetAllDirectRoomsReq,
  GetOneDirectRoomReq,
  CreateOneDirectRoomReq,
  UpdateOneDirectRoomReq,
  DeleteOneDirectRoomReq,
  GetAllGroupRoomsReq,
  GetOneGroupRoomReq,
  CreateOneGroupRoomReq,
  UpdateOneGroupRoomReq,
  DeleteOneGroupRoomReq,
} from "#validators/chatRoomSchemas.js";

// ------------------------
// DEFAULT ERROR RESPONSES
// ------------------------
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
      title: "Šrumec Chats Service API",
      version: "1.0.0",
      description: "API for private messages, group chats and chat rooms.",
    },

    servers: [
      {
        url: "http://localhost:4001",
        description: "Local development server",
      },
    ],

    // ============================
    // PATHS
    // ============================
    paths: {
      /* ===========================
   DIRECT ROOMS
=========================== */

      "/v1/chats/direct/get-all": {
        post: {
          summary: "Get all direct chat rooms of current user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetAllDirectRoomsReq,
              },
            },
          },
          responses: {
            200: {
              description: "List of direct rooms",
              content: {
                "application/json": {
                  schema: z.array(ChatRoomDirectSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/direct/get-one": {
        post: {
          summary: "Get one direct chat room by ID",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetOneDirectRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Direct room data",
              content: {
                "application/json": {
                  schema: ChatRoomDirectSchema,
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

      "/v1/chats/direct/create-one": {
        post: {
          summary: "Create a direct (1:1) chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CreateOneDirectRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Direct room created",
              content: {
                "application/json": {
                  schema: ChatRoomDirectSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/direct/update-one": {
        post: {
          summary: "Update a direct chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: UpdateOneDirectRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Direct room updated",
              content: {
                "application/json": {
                  schema: ChatRoomDirectSchema,
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

      "/v1/chats/direct/delete-one": {
        post: {
          summary: "Delete a direct chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteOneDirectRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Direct room deletion result",
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

      /* ===========================
   GROUP ROOMS
=========================== */

      "/v1/chats/group/get-all": {
        post: {
          summary: "Get all group chat rooms",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetAllGroupRoomsReq,
              },
            },
          },
          responses: {
            200: {
              description: "List of group rooms",
              content: {
                "application/json": {
                  schema: z.array(ChatRoomGroupSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/get-one": {
        post: {
          summary: "Get one group chat room by ID",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetOneGroupRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Group room data",
              content: {
                "application/json": {
                  schema: ChatRoomGroupSchema,
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

      "/v1/chats/group/create-one": {
        post: {
          summary: "Create a group chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CreateOneGroupRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Group room created",
              content: {
                "application/json": {
                  schema: ChatRoomGroupSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/update-one": {
        post: {
          summary: "Update a group chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: UpdateOneGroupRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Group room updated",
              content: {
                "application/json": {
                  schema: ChatRoomGroupSchema,
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

      "/v1/chats/group/delete-one": {
        post: {
          summary: "Delete a group chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteOneGroupRoomReq,
              },
            },
          },
          responses: {
            200: {
              description: "Group room deletion result",
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

      /* ===========================
   GROUP MEMBERS
=========================== */

      "/v1/chats/group/members/get-all": {
        post: {
          summary: "Get all members of a group chat",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetAllGroupMembersReq,
              },
            },
          },
          responses: {
            200: {
              description: "List of group members (user UUIDs)",
              content: {
                "application/json": {
                  schema: GetAllGroupMembersRes,
                  // nebo: schema: z.array(z.string().uuid()),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/members/create-one": {
        post: {
          summary: "Add a member to a group chat",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CreateGroupMemberReq,
              },
            },
          },
          responses: {
            200: {
              description: "Member added",
              content: {
                "application/json": {
                  schema: CreateGroupMemberRes, // = ChatRoomGroupMemberSchema
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/members/update-one": {
        post: {
          summary: "Update a member's role in a group chat",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: UpdateGroupMemberReq,
              },
            },
          },
          responses: {
            200: {
              description: "Member updated",
              content: {
                "application/json": {
                  schema: UpdateGroupMemberRes, // = ChatRoomGroupMemberSchema
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

      "/v1/chats/group/members/delete-one": {
        post: {
          summary: "Remove a member from a group chat",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteGroupMemberReq,
              },
            },
          },
          responses: {
            200: {
              description: "Member removed",
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

      /* ===========================
   DIRECT MESSAGES
=========================== */

      "/v1/chats/direct/messages/get-all": {
        post: {
          summary: "Get all messages in a direct chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetAllMessagesReq,
              },
            },
          },
          responses: {
            200: {
              description: "List of messages",
              content: {
                "application/json": {
                  schema: z.array(ChatMessageSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/direct/messages/get-one": {
        post: {
          summary: "Get one direct chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetOneMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Direct message data",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
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

      "/v1/chats/direct/messages/create-one": {
        post: {
          summary: "Create a new message in a direct chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CreateMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message created",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/direct/messages/update-one": {
        post: {
          summary: "Update an existing direct chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: UpdateMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message updated",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
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

      "/v1/chats/direct/messages/delete-one": {
        post: {
          summary: "Delete one direct chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteOneMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message deleted",
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

      /* ===========================
   GROUP MESSAGES
=========================== */

      "/v1/chats/group/messages/get-all": {
        post: {
          summary: "Get all messages in a group chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetAllMessagesReq,
              },
            },
          },
          responses: {
            200: {
              description: "List of messages",
              content: {
                "application/json": {
                  schema: z.array(ChatMessageSchema),
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/messages/get-one": {
        post: {
          summary: "Get one group chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: GetOneMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Group message data",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
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

      "/v1/chats/group/messages/create-one": {
        post: {
          summary: "Create a new message in a group chat room",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: CreateMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message created",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
                },
              },
            },
            ...defaultResponse(400),
            ...defaultResponse(401),
            ...defaultResponse(500),
          },
        },
      },

      "/v1/chats/group/messages/update-one": {
        post: {
          summary: "Update an existing group chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: UpdateMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message updated",
              content: {
                "application/json": {
                  schema: ChatMessageSchema,
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

      "/v1/chats/group/messages/delete-one": {
        post: {
          summary: "Delete one group chat message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: DeleteOneMessageReq,
              },
            },
          },
          responses: {
            200: {
              description: "Message deleted",
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
