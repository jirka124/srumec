function randomInt(n) {
  return Math.floor(Math.random() * n);
}

export function generateDirectMessages(rooms) {
  const all = [];

  for (const room of rooms) {
    const count = 2 + randomInt(8); // 2–10 messages
    const messages = [];

    let sender = room.user1;

    for (let i = 0; i < count; i++) {
      messages.push({
        user_ref: sender,
        message: `DM message #${i + 1}`,
        offsetMinutes: randomInt(24 * 60), // within last 24 hours
      });

      sender = sender === room.user1 ? room.user2 : room.user1;
    }

    all.push({ room, messages });
  }

  return all;
}
