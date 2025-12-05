import { service } from "#services/directRoomService.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllDirectRooms(req, res) {
    try {
      const userId = req.user.id;

      const rooms = await service.getAllDirectRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      throw produceFail("TJdMl5QKdmUjneJi", e);
    }
  },

  async getOneDirectRoom(req, res) {
    try {
      const data = req.validated;
      const room = await service.getOneDirectRoom(data);

      if (!room) {
        throw produceFail(
          "5DkTtaIOyxYvO41n",
          `direct room with given ID { ${data.id} } not found`
        );
      }

      return res.json(room);
    } catch (e) {
      throw produceFail("dPzicAmhxPQV3TiR", e);
    }
  },

  async createOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const created = await service.createOneDirectRoom(data);
      return res.json(created);
    } catch (e) {
      throw produceFail("bxJIfB6nxlSOzTGk", e);
    }
  },

  async updateOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const updated = await service.updateOneDirectRoom(data);
      return res.json(updated);
    } catch (e) {
      throw produceFail("MGhHfSA5nuALyYuy", e);
    }
  },

  async deleteOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteOneDirectRoom(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("8m4JFoHIruZf8iHc", e);
    }
  },
};
