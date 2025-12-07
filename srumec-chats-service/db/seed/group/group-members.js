export function generateGroupMembers(users, groups) {
  const combined = [];

  for (const g of groups) {
    const members = new Set();

    // admin
    const admin = users[Math.floor(Math.random() * users.length)];
    members.add(admin);

    // 3–9 additional members
    const memberCount = 3 + Math.floor(Math.random() * 7);

    while (members.size < memberCount + 1) {
      members.add(users[Math.floor(Math.random() * users.length)]);
    }

    combined.push({
      room: g,
      admin,
      members: Array.from(members),
    });
  }

  return combined;
}
