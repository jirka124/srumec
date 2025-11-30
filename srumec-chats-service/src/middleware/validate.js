import { produceFail } from "#lib/fail/fail.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success)
      throw produceFail("kpAykR5UXDLMdLFK", result.error.flatten());

    req.validated = result.data;
    next();
  };
}
