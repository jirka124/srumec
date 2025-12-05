import { service } from "#services/groupRoomService.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllGroupRooms(req, res) {
    try {
      const userId = req.user.id;

      const rooms = await service.getAllGroupRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      throw produceFail("4c0VJLR0rAqYnQKr", e);
    }
  },

  async getOneGroupRoom(req, res) {
    try {
      const data = req.validated;
      const room = await service.getOneGroupRoom(data);

      if (!room) {
        throw produceFail(
          "moyxlkCSZUmZ6oHc",
          `group room with given ID { ${data.id} } not found`
        );
      }

      return res.json(room);
    } catch (e) {
      throw produceFail("ckGAYzNnWCYkhWGV", e);
    }
  },

  async createOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const created = await service.createOneGroupRoom(data);
      return res.json(created);
    } catch (e) {
      throw produceFail("rBtJzMW6EgdCiyh6", e);
    }
  },

  async updateOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const updated = await service.updateOneGroupRoom(data);
      return res.json(updated);
    } catch (e) {
      throw produceFail("S6dMzCMOFJ3IiFpx", e);
    }
  },

  async deleteOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const count = await service.deleteOneGroupRoom(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("nRqUUUr431VBaFGq", e);
    }
  },
};
