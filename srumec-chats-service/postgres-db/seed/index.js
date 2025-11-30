import { sql, waitForDatabase } from "./db.js";

import { generateUsers } from "./users/users.js";

import { generateDirectRooms } from "./direct/direct-rooms.js";
import { generateDirectMessages } from "./direct/direct-messages.js";

import { generateGroupRooms } from "./group/group-rooms.js";
import { generateGroupMembers } from "./group/group-members.js";
import { generateGroupMessages } from "./group/group-messages.js";

async function main() {
  if (process.env.SEED_ENABLED !== "true") {
    console.log("Seed disabled");
    process.exit(0);
  }

  console.log("Waiting for database...");
  await waitForDatabase();

  // ---------------------------
  // CHECK IF ALREADY SEEDED
  // ---------------------------
  const serviceName = "chats-service"; // nebo events-service podle projektu

  const already = await sql`
    SELECT 1 FROM seeding_log WHERE service = ${serviceName}
  `;

  if (already.length > 0) {
    console.log(`✔ Seed already executed for ${serviceName}, skipping.`);
    process.exit(0);
  }

  console.log(`→ Seeding ${serviceName}...`);

  // ======================
  // USERS
  // ======================
  console.log("→ Generating USERS");
  const users = generateUsers(30);

  // ======================
  // DIRECT ROOMS
  // ======================
  console.log("→ Generating DIRECT ROOMS");
  const directRooms = generateDirectRooms(users);

  console.log("→ Inserting DIRECT ROOMS");
  for (const r of directRooms) {
    const [row] = await sql`
      INSERT INTO chat_room_direct (user_1_ref, user_2_ref, create_time)
      VALUES (
        ${r.user1},
        ${r.user2},
        NOW() - make_interval(hours => ${r.createOffsetHours})
      )
      RETURNING id
    `;
    r.id = row.id;
  }

  // ======================
  // DIRECT MESSAGES
  // ======================
  console.log("→ Generating DIRECT MESSAGES");
  const directMessages = generateDirectMessages(directRooms);

  console.log("→ Inserting DIRECT MESSAGES");
  for (const entry of directMessages) {
    for (const msg of entry.messages) {
      await sql`
        INSERT INTO chat_message (room_ref, user_ref, message, type, sent_time)
        VALUES (
          ${entry.room.id},
          ${msg.user_ref},
          ${msg.message},
          'direct',
          NOW() - make_interval(mins => ${msg.offsetMinutes})
        )
      `;
    }
  }

  // ======================
  // GROUP ROOMS
  // ======================
  console.log("→ Generating GROUP ROOMS");
  const groupRooms = generateGroupRooms(5);

  console.log("→ Inserting GROUP ROOMS");
  for (const r of groupRooms) {
    const [row] = await sql`
      INSERT INTO chat_room_group (name, create_time)
      VALUES (
        ${r.name},
        NOW() - make_interval(hours => ${r.createOffsetHours})
      )
      RETURNING id
    `;
    r.id = row.id;
  }

  // ======================
  // GROUP MEMBERS
  // ======================
  console.log("→ Generating GROUP MEMBERS");
  const groupMembers = generateGroupMembers(users, groupRooms);

  console.log("→ Inserting GROUP MEMBERS");
  for (const gm of groupMembers) {
    for (const user of gm.members) {
      const role = user === gm.admin ? "admin" : "guest";

      await sql`
        INSERT INTO chat_room_group_member (group_ref, user_ref, role)
        VALUES (${gm.room.id}, ${user}, ${role})
      `;
    }
  }

  // ======================
  // GROUP MESSAGES
  // ======================
  console.log("→ Generating GROUP MESSAGES");
  const groupMessages = generateGroupMessages(groupMembers);

  console.log("→ Inserting GROUP MESSAGES");
  for (const entry of groupMessages) {
    for (const msg of entry.messages) {
      await sql`
        INSERT INTO chat_message (room_ref, user_ref, message, type, sent_time)
        VALUES (
          ${entry.gm.room.id},
          ${msg.user_ref},
          ${msg.message},
          'group',
          NOW() - make_interval(mins => ${msg.offsetMinutes})
        )
      `;
    }
  }

  // ---------------------------
  // REGISTER THAT SEED WAS EXECUTED
  // ---------------------------
  await sql`
    INSERT INTO seeding_log (service)
    VALUES (${serviceName})
    ON CONFLICT (service) DO NOTHING
  `;

  console.log(`✔ Seed completed for ${serviceName}`);
  process.exit(0);
}

main();
