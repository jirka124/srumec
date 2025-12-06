import jwt from "jsonwebtoken";
import { produceFail } from "#lib/fail/fail.js";

export function authUser(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      throw produceFail(
        "Wv8o7lWyrWhnV6Ka",
        "Anonymous users are not permitted, supply valid JWT token"
      );
    }

    const token = auth.substring("Bearer ".length).trim();

    const payload = jwt.decode(token);

    if (!payload || !payload.id || !payload.role || !payload.name) {
      throw produceFail(
        "fIhz89IJJEKE44CU",
        "Anonymous users are not permitted, id, role or name missing in JWT token"
      );
    }

    req.user = {
      id: payload.id,
      role: payload.role,
      name: payload.name,
      exp: payload.exp,
    };

    next();
  } catch (e) {
    throw produceFail("MoC7EZHdBULE1Kq7", e);
  }
}
