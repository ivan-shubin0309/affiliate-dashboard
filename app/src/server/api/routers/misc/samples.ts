import { protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";

export const sampleQuery = protectedProcedure.query(async ({ ctx }) => {
  //   const affiliate_id = 500;
  //   const cond = `AffiliateID = ${affiliate_id}`;
  //
  //   console.log(`muly:cond`, { cond });
  //
  //   const sqlString = `
  //   SELECT COUNT(*)
  //   FROM ReportTraders
  //   WHERE ${cond}
  // `;
  //
  //   const answer = await ctx.prisma.$queryRaw<unknown[]>(Prisma.raw(sqlString));

  // return answer;
  return Promise.resolve({
    hello: "world",
  });
});
