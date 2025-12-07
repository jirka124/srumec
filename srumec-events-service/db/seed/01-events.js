import { randomUUID } from "crypto";
import { eventsData } from "./events-data.js";

export default async function seedEvents(sql) {
  console.log("→ Seeding EVENTS…");

  const organizerId = randomUUID();

  for (const ev of eventsData) {
    await sql`
      INSERT INTO events (
        organizer_ref,
        title,
        description,
        location,
        happen_time,
        status
      )
      VALUES (
        ${organizerId},
        ${ev.title},
        ${ev.description},
        ST_SetSRID(ST_MakePoint(${ev.lng}, ${ev.lat}), 4326)::GEOGRAPHY,
        NOW() + make_interval(
          days  => ${ev.dayOffset},
          hours => ${ev.hourOffset},
          mins  => ${ev.minuteOffset}
        ),
        ${ev.status}
      )
      ON CONFLICT DO NOTHING
    `;
  }

  console.log("✔ EVENTS seeded");
}
