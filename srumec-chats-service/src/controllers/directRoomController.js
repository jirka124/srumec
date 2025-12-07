import { service as directRoomService } from "#services/directRoomService.js";
import { policy as directRoomPolicy } from "#policies/chat/directRoomPolicy.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllDirectRooms(req, res) {
    try {
      const userId = req.user.id;

      const rooms = await directRoomService.getAllDirectRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      throw produceFail("TJdMl5QKdmUjneJi", e);
    }
  },

  async getOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const room = await directRoomService.getOneDirectRoom({ id: data.id });
      if (!room) {
        throw produceFail(
          "5DkTtaIOyxYvO41n",
          `direct room with given ID { ${data.id} } not found`
        );
      }

      directRoomPolicy.validateGetOne(req, room);

      return res.json(room);
    } catch (e) {
      throw produceFail("dPzicAmhxPQV3TiR", e);
    }
  },

  async createOneDirectRoom(req, res) {
    try {
      let data = req.validated;

      data = directRoomPolicy.validateCreate(req, data);

      const created = await directRoomService.createOneDirectRoom(data);
      return res.json(created);
    } catch (e) {
      throw produceFail("bxJIfB6nxlSOzTGk", e);
    }
  },

  async updateOneDirectRoom(req, res) {
    try {
      let data = req.validated;

      const existing = await directRoomService.getOneDirectRoom({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "qfyUHgdTurIcknii",
          `Direct room with ID ${data.id} not found`
        );
      }

      data = directRoomPolicy.validateUpdate(req, data, existing);

      const updated = await service.updateOneDirectRoom(data);
      return res.json(updated);
    } catch (e) {
      throw produceFail("MGhHfSA5nuALyYuy", e);
    }
  },

  async deleteOneDirectRoom(req, res) {
    try {
      const data = req.validated;

      const existing = await directRoomService.getOneDirectRoom({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "w2WWwhUVImgs0HLd",
          `Direct room with ID ${data.id} not found`
        );
      }

      directRoomPolicy.validateDelete(req, data, existing);

      const count = await directRoomService.deleteOneDirectRoom(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("8m4JFoHIruZf8iHc", e);
    }
  },
};
