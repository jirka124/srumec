import jwt from "jsonwebtoken";
import { produceFail } from "#lib/fail/fail.js";

export function decodeJwtFromRequest(req) {
  const auth = req.headers["authorization"];
  if (!auth) return null;

  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.decode(token);
  } catch (e) {
    throw produceFail("MWa2A5C7eqoeCaGb", e);
  }
}
