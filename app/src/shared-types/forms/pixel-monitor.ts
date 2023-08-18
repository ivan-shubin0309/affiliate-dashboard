import { z } from "zod";
import { pixel_monitorModel } from "../../../prisma/zod";

export const schema = z.object({
  merchant_id: z.coerce.number().describe("Merchant // Select Merchant"),
  type: z
    .enum(["lead", "account", "sale", "ftd", "qftd"])
    .describe("Trigger // Select Trigger"),
  pixelCode: z.string().describe("Pixel Code"),
  method: z.enum(["post", "get", "client"]).describe("Method // Select Method"),
  valid: z.coerce.number().describe("Status"),
});
