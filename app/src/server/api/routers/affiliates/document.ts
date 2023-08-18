import { z } from "zod";

import { protectedProcedure } from "../../trpc";
import { checkIsUser } from "@/server/api/utils";
import { serverStoragePath } from "@/server/utils";

export const getDocuments = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const data = await ctx.prisma.documents.findMany({
    where: {
      affiliate_id,
    },
  });

  return data.map(({ path, ...rest }) => ({
    ...rest,
    path: serverStoragePath(path),
  }));
});
