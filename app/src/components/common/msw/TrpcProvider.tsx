import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { httpBatchLink } from "@trpc/client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";
import SuperJSON from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = (p) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3002/api/trpc",
          // You can pass any HTTP headers you wish here
          // async headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
      transformer: SuperJSON,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {p.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
