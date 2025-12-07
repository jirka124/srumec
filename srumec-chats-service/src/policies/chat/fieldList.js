export const USER_CREATABLE_FIELDS_DIRECT_ROOM = ["user_1_ref", "user_2_ref"];
export const USER_UPDATABLE_FIELDS_DIRECT_ROOM = [];

export const USER_CREATABLE_FIELDS_DIRECT_MESSAGE = [
  "room_ref",
  "user_ref",
  "message",
];
export const USER_UPDATABLE_FIELDS_DIRECT_MESSAGE = ["id", "message"];

export const USER_CREATABLE_FIELDS_GROUP_ROOM = ["name"];
export const USER_UPDATABLE_FIELDS_GROUP_ROOM = ["id", "name"];

export const USER_CREATABLE_FIELDS_GROUP_MESSAGE = [
  "room_ref",
  "user_ref",
  "message",
];
export const USER_UPDATABLE_FIELDS_GROUP_MESSAGE = ["id", "message"];

export const USER_CREATABLE_FIELDS_GROUP_MEMBERSHIP = [
  "group_ref",
  "user_ref",
  "role",
];
export const USER_UPDATABLE_FIELDS_GROUP_MEMBERSHIP = [
  "group_ref",
  "user_ref",
  "role",
];
