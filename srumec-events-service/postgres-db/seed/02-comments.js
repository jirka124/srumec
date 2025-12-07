import { randomUUID } from "crypto";

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

export default async function seedComments(sql) {
  console.log("→ Seeding COMMENTS…");

  const events = await sql`SELECT id FROM events`;

  for (const ev of events) {
    const commentCount = Math.floor(Math.random() * 3) + 1;
    const commentIds = [];
    const commentTimes = []; // uložíme create_time root komentářů

    for (let i = 0; i < commentCount; i++) {
      const id = randomUUID();

      let replyTo = null;
      let createTimeExpr;

      // ------------------------------
      // ROOT komentář (i === 0)
      // ------------------------------
      if (i === 0) {
        // náhodný čas v minulosti
        const hoursAgo = randomInt(48);
        const minutesAgo = randomInt(60);

        createTimeExpr = sql`
          NOW() - make_interval(
            hours => ${hoursAgo},
            mins  => ${minutesAgo}
          )
        `;

        commentTimes.push({ id, sqlTime: createTimeExpr });
      } else {
        // ------------------------------
        // REPLY komentář
        // ------------------------------
        if (Math.random() > 0.5) {
          // reply k předchozímu komentáři
          replyTo = commentIds[i - 1];

          // čas previous komentáře
          const prevTime = commentTimes.find((c) => c.id === replyTo).sqlTime;

          // reply bude o 0–30 min později
          const replyMinutes = randomInt(31);

          createTimeExpr = sql`${prevTime} + make_interval(mins => ${replyMinutes})`;

          commentTimes.push({ id, sqlTime: createTimeExpr });
        } else {
          // nový root-level komentář
          const hoursAgo = randomInt(48);
          const minutesAgo = randomInt(60);

          createTimeExpr = sql`
            NOW() - make_interval(
              hours => ${hoursAgo},
              mins  => ${minutesAgo}
            )
          `;

          commentTimes.push({ id, sqlTime: createTimeExpr });
        }
      }

      commentIds.push(id);

      await sql`
        INSERT INTO event_comments (
          id,
          event_ref,
          user_ref,
          user_name,
          reply_to_ref,
          content,
          create_time
        )
        VALUES (
          ${id},
          ${ev.id},
          ${randomUUID()},
          ${
            [
              "ShadowFox",
              "LunarByte",
              "PixelWolf",
              "NeonRider",
              "DarkNova",
              "GhostSpark",
              "IronPulse",
              "StormByte",
              "CyberHawk",
              "SilentBlade",
            ][Math.floor(Math.random() * 10)]
          },
          ${replyTo},
          ${"This is an auto-generated test comment."},
          ${createTimeExpr}
        )
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log("✔ COMMENTS seeded");
}
