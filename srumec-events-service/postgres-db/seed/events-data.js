import { hradecEvents } from "./events/hradec.js";
import { pardubiceEvents } from "./events/pardubice.js";
import { prahaEvents } from "./events/praha.js";
import { brnoEvents } from "./events/brno.js";
import { liberecEvents } from "./events/liberec.js";

export const eventsData = [
  ...hradecEvents,
  ...pardubiceEvents,
  ...prahaEvents,
  ...brnoEvents,
  ...liberecEvents,
];
