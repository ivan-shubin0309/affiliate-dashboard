import { z } from "zod";
import { publicProcedure } from "@/server/api/trpc";
import { getConfig as _getConfig, settingFullModel } from "@/server/get-config";
import type { PrismaClient } from "@prisma/client";

// "af-quick|af-creative|af-traffic|af-trader|-af-trnsct|af-country|af-landing|af-comm|-af-install";

const parsePermissions = (input?: string): Record<string, boolean> => {
  const permissionsArray = input?.split("|") ?? [];
  const permissionsRecord: Record<string, boolean> = {};

  for (const permission of permissionsArray) {
    if (permission.startsWith("-")) {
      permissionsRecord[permission.slice(1)] = false;
    } else {
      permissionsRecord[permission] = true;
    }
  }

  return permissionsRecord;
};

const getPermissions = async (prisma: PrismaClient, affiliate_id?: string) => {
  if (affiliate_id) {
    const affiliate = await prisma.affiliates.findUniqueOrThrow({
      where: { id: Number(affiliate_id) },
      select: {
        permissionProfile: {
          select: {
            id: true,
            reportsPermissions: true,
            fieldsPermissions: true,
          },
        },
      },
    });

    return {
      reports: parsePermissions(
        affiliate.permissionProfile?.reportsPermissions
      ),
      fields: parsePermissions(affiliate.permissionProfile?.fieldsPermissions),
    };
  }

  return { reports: {}, fields: {} };
};

export const getConfig = publicProcedure
  .output(
    z.object({
      config: settingFullModel,
      permissions: z.object({
        reports: z.record(z.boolean()),
        fields: z.record(z.boolean()),
      }),
    })
  )
  .query(async ({ ctx }) => {
    const affiliate_id = ctx.session?.user?.id;

    console.log(`#### muly:affiliate_id ${affiliate_id}`, {});
    const [config, permissions] = await Promise.all([
      _getConfig(ctx.prisma),
      getPermissions(ctx.prisma, affiliate_id),
    ]);
    return { config, permissions };
  });
