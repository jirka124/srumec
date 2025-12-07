export function generateDirectRooms(users, count = 10) {
  const rooms = [];

  for (let i = 0; i < count; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    let user2 = user1;

    while (user2 === user1) {
      user2 = users[Math.floor(Math.random() * users.length)];
    }

    rooms.push({
      user1,
      user2,
      createOffsetHours: Math.floor(Math.random() * 72), // last 3 days
    });
  }

  return rooms;
}
