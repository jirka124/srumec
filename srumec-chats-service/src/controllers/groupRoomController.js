import { service as groupRoomService } from "#services/groupRoomService.js";
import { service as groupMemberService } from "#services/chatGroupMemberService.js";
import { policy as groupRoomPolicy } from "#policies/chat/groupRoomPolicy.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllGroupRooms(req, res) {
    try {
      const userId = req.user.id;

      const rooms = await groupRoomService.getAllGroupRooms({ userId });
      return res.json(rooms);
    } catch (e) {
      throw produceFail("4c0VJLR0rAqYnQKr", e);
    }
  },

  async getOneGroupRoom(req, res) {
    try {
      const data = req.validated;
      const room = await groupRoomService.getOneGroupRoom(data);

      if (!room) {
        throw produceFail(
          "moyxlkCSZUmZ6oHc",
          `group room with given ID { ${data.id} } not found`
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: room.id,
        user_ref: req.user.id,
      });

      groupRoomPolicy.validateGetOne(req, data, membership);

      return res.json(room);
    } catch (e) {
      throw produceFail("ckGAYzNnWCYkhWGV", e);
    }
  },

  async createOneGroupRoom(req, res) {
    try {
      let data = req.validated;
      const userId = req.user.id;

      data = groupRoomPolicy.validateCreateOne(req, data);

      const created = await groupRoomService.createOneGroupRoom(data, userId);
      return res.json(created);
    } catch (e) {
      throw produceFail("rBtJzMW6EgdCiyh6", e);
    }
  },

  async updateOneGroupRoom(req, res) {
    try {
      let data = req.validated;

      const room = await groupRoomService.getOneGroupRoom({ id: data.id });
      if (!room) {
        throw produceFail(
          "RkwhV7ULEauZSi91",
          `Group room with ID ${data.id} not found`
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: room.id,
        user_ref: req.user.id,
      });

      data = groupRoomPolicy.validateUpdateOne(req, data, membership);

      const updated = await groupRoomService.updateOneGroupRoom(data);
      return res.json(updated);
    } catch (e) {
      throw produceFail("S6dMzCMOFJ3IiFpx", e);
    }
  },

  async deleteOneGroupRoom(req, res) {
    try {
      const data = req.validated;

      const room = await groupRoomService.getOneGroupRoom({ id: data.id });
      if (!room) {
        throw produceFail(
          "2aARk23JDGH2Xtr8",
          `Group room with ID ${data.id} not found`
        );
      }

      const membership = await groupMemberService.getMember({
        group_ref: room.id,
        user_ref: req.user.id,
      });

      groupRoomPolicy.validateDelete(req, data, membership);

      const count = await groupRoomService.deleteOneGroupRoom(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("nRqUUUr431VBaFGq", e);
    }
  },
};
