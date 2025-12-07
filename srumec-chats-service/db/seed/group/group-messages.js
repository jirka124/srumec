function randomInt(n) {
  return Math.floor(Math.random() * n);
}

export function generateGroupMessages(groupMembers) {
  const all = [];

  for (const gm of groupMembers) {
    const messageCount = 5 + randomInt(10); // 5–15 messages
    const messages = [];

    for (let i = 0; i < messageCount; i++) {
      const user = gm.members[randomInt(gm.members.length)];

      messages.push({
        user_ref: user,
        message: `Group message #${i + 1}`,
        offsetMinutes: randomInt(48 * 60), // last 48 hours
      });
    }

    all.push({
      gm,
      messages,
    });
  }

  return all;
}
