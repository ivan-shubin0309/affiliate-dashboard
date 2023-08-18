import { z } from "zod";
import { accountSchema as accountSchema } from "./account";
import { numericCheckbox } from "./common";

export const lostPasswordSchema = z
  .object({
    username: z.string().optional().describe("Username"),
    mail: z.string().email().optional().describe("email"),
  })
  .refine(
    ({ username, mail }) => {
      return username || mail;
    },
    {
      message: "Please choose username or password.",
      path: ["username"],
    }
  );
