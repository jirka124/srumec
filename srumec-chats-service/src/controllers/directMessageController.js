import { service as directMessageService } from "#services/directMessageService.js";
import { service as directRoomService } from "#services/directRoomService.js";
import { policy as directMessagePolicy } from "#policies/chat/directMessagePolicy.js";
import { produceFail } from "#lib/fail/fail.js";

export const controller = {
  async getAllDirectMessages(req, res) {
    try {
      const data = req.validated;

      const room = await directRoomService.getOneDirectRoom({
        id: data.room_ref,
      });
      if (!room) {
        throw produceFail(
          "WjmabVPRrhSEacUF",
          `Direct room with ID ${data.room_ref} not found`
        );
      }

      directMessagePolicy.validateGetAll(req, room);

      const rows = await directMessageService.getAllDirectMessages(data);
      return res.json(rows);
    } catch (e) {
      throw produceFail("Ya6Z2FzCIA3NvxGL", e);
    }
  },

  async getOneDirectMessage(req, res) {
    try {
      const data = req.validated;
      const msg = await directMessageService.getOneDirectMessage({
        id: data.id,
      });
      if (!msg) {
        throw produceFail(
          "egqRzJ5kYDGZS2ts",
          `Direct message ( ${data.id} ) not found`
        );
      }

      const room = await directRoomService.getOneDirectRoom({
        id: msg.room_ref,
      });
      if (!room) {
        throw produceFail(
          "jABtk29m80RQLfPe",
          `Direct room with ID ( ${msg.room_ref} ) not found`
        );
      }

      directMessagePolicy.validateGetOne(req, room);

      return res.json(msg);
    } catch (e) {
      throw produceFail("q9cRBoh8ERQnU5yl", e);
    }
  },

  async createDirectMessage(req, res) {
    try {
      let data = req.validated;

      const room = await directRoomService.getOneDirectRoom({
        id: data.room_ref,
      });
      if (!room) {
        throw produceFail(
          "YSR4eMl3NYVRQivW",
          `Direct room with ID ${data.room_ref} not found`
        );
      }

      data = directMessagePolicy.validateCreate(req, data, room);

      const result = await directMessageService.createDirectMessage(data);
      return res.json(result);
    } catch (e) {
      throw produceFail("RNKOK3u0ZmKxCgeu", e);
    }
  },

  async updateDirectMessage(req, res) {
    try {
      let data = req.validated;

      const existing = await directMessageService.getOneDirectMessage({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "SuimqpUkrU1cbaQ1",
          `Direct message with ID ${data.id} not found`
        );
      }

      const room = await directRoomService.getOneDirectRoom({
        id: existing.room_ref,
      });
      if (!room) {
        throw produceFail(
          "a49TjX06VogslYNW",
          `Direct room with ID ${existing.room_ref} not found`
        );
      }

      data = directMessagePolicy.validateUpdate(req, data, { existing, room });

      const result = await directMessageService.updateDirectMessage(data);

      if (!result) {
        throw produceFail(
          "PMD7ZyzK2fQm6sqQ",
          `Message with ID ${data.id} not found`
        );
      }

      return res.json(result);
    } catch (e) {
      throw produceFail("AC5GC5tGJWjanhGH", e);
    }
  },

  async deleteDirectMessage(req, res) {
    try {
      const data = req.validated;

      const existing = await directMessageService.getOneDirectMessage({
        id: data.id,
      });
      if (!existing) {
        throw produceFail(
          "wUf7uMBcb0zvciev",
          `Direct message with ID ${data.id} not found`,
          404
        );
      }

      directMessagePolicy.validateDelete(req, existing);

      const count = await directMessageService.deleteDirectMessage(data);
      return res.json({ count });
    } catch (e) {
      throw produceFail("KTaKlBo3mVinXUXn", e);
    }
  },
};
