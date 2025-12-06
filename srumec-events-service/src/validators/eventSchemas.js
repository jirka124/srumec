import z from "zod";
import { UUID } from "#validators/common.js";

export const fields = {
  id: UUID,
  organizer_ref: UUID.meta({
    description: "Reference to User",
    example: "a34f1cc4-7dc0-4f0e-85bb-bcd660df3b11",
  }),
  title: z.string().min(1).max(32).meta({
    description: "Title of Event",
    example: "Interesting Event",
  }),
  description: z.string().min(1).max(512).nullable().meta({
    description: "Description of Event",
    example: "We will be going around an lamp for 1 hour.",
  }),
  latitude: z.number().min(-90).max(90).meta({
    description: "Latitude (WGS84)",
    example: 50.087,
  }),
  longitude: z.number().min(-180).max(180).meta({
    description: "Longitude (WGS84)",
    example: 14.42,
  }),
  radius_m: z.number().min(1).max(100000).meta({
    description: "Distance in meters",
    example: 10.6,
  }),
  happen_time: z.iso.datetime({ offset: true }).meta({
    description: "When will the event happen ISO datetime string",
    example: "2025-11-22T21:28:46.533Z",
  }),
  status: z.enum(["pending", "approved", "rejected"]).meta({
    description: "Event approval status",
    example: "approved",
  }),
};

export const EventSchema = z
  .object({
    id: fields.id,
    organizer_ref: fields.organizer_ref,
    title: fields.title,
    description: fields.description,
    latitude: fields.latitude,
    longitude: fields.longitude,
    happen_time: fields.happen_time,
    status: fields.status,
  })
  .meta({
    id: "EventSchema",
    description: "Event Schema",
  });

export const GetNearbyReqSchema = z
  .object({
    latitude: fields.latitude,
    longitude: fields.longitude,
    radius_m: fields.radius_m,
  })
  .meta({
    id: "GetNearby",
    description: "Get approved events near a given point",
  });

export const GetOneReqSchema = z
  .object({
    id: fields.id,
  })
  .meta({
    id: "GetOne",
    description: "Get single event by ID",
  });

export const EventCreateReqSchema = z.object({
  id: fields.id.optional(),
  organizer_ref: fields.organizer_ref,
  title: fields.title,
  description: fields.description.optional().default(null),
  latitude: fields.latitude,
  longitude: fields.longitude,
  happen_time: fields.happen_time.refine(
    (val) => {
      if (val === undefined) return true;

      const t = new Date(val);
      return t.getTime() > Date.now() + 5 * 60 * 1000;
    },
    {
      message: "happen_time must be at least 5 minutes in the future",
    }
  ),
  status: fields.status.optional(),
});

export const EventUpdateReqSchema = z.object({
  id: fields.id,
  organizer_ref: fields.organizer_ref.optional(),
  title: fields.title.optional(),
  description: fields.description.optional(),
  latitude: fields.latitude.optional(),
  longitude: fields.longitude.optional(),
  happen_time: fields.happen_time.optional().refine(
    (val) => {
      if (val === undefined) return true;

      const t = new Date(val);
      return t.getTime() > Date.now() + 5 * 60 * 1000;
    },
    {
      message: "happen_time must be at least 5 minutes in the future",
    }
  ),
  status: fields.status.optional(),
});

export const DeleteOneReqSchema = z
  .object({
    id: fields.id,
  })
  .meta({
    id: "DeleteEventReq",
    description: "Delete event by ID",
  });
