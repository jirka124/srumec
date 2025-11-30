import { randomUUID } from "crypto";

export function generateUsers(count = 30) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(randomUUID());
  }
  return users;
}
