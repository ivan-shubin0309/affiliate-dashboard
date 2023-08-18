import { createTRPCMsw } from "msw-trpc";
import type { AppRouter } from "./root";
import superjson from "superjson";

export const trpcMsw = createTRPCMsw<AppRouter>({
  basePath: "/api/trpc",
  baseUrl: "/api/trpc",
  transformer: {
    input: superjson,
    output: superjson,
  },
});
