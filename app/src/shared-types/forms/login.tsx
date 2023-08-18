import { z } from "zod";
import Link from "next/link";
import React from "react";

export const loginSchema = z.object({
  username: z.string().describe("Username"),
  password: z
    .string()
    .describe("Password")
    .meta({
      type: "password",
      afterElement: () => (
        <div className="mb-3 flex w-full justify-end">
          <Link
            className="ml-1 inline-block font-bold text-primary"
            href="/auth/lost-password"
          >
            Forgot your password?
          </Link>
        </div>
      ),
    }),
});
