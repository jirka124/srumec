import { customType } from "drizzle-orm/pg-core";

export const geographyPoint = customType({
  dataType() {
    return "geography(Point,4326)";
  },
});
