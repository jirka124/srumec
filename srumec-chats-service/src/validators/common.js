import z from "zod";

// Shared UUID schema with metadata
export const UUID = z.uuidv4().meta({
  description: "UUID v4 compatible string",
  example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
});

export const FailResponseSchema = z.object({
  failHash: z.string().length(16).meta({
    description: "A unique hash code describing fail",
    example: "MID2H0VEAXwYjTkL",
  }),
  message: z.string().optional().meta({
    description: "A brief human readable description of what failed",
    example: "reading from database failed",
  }),
  detail: z.string().optional().meta({
    description: "A detail information about fail for debugging",
    example: "stack trace / detail / ...",
  }),
});

export const DeleteResSchema = z
  .object({
    count: z.number().min(0).meta({
      description: "Number of deleted entities in db",
      example: 3,
    }),
  })
  .meta({
    id: "DeleteRes",
    description: "Entity delete response",
  });
