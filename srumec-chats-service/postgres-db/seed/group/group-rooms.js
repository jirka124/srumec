export function generateGroupRooms(count = 5) {
  const rooms = [];

  for (let i = 0; i < count; i++) {
    rooms.push({
      name: `Group Chat ${i + 1}`,
      createOffsetHours: Math.floor(Math.random() * 168), // last 7 days
    });
  }

  return rooms;
}
