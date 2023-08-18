import type { PrismaClient } from "@prisma/client";
import { z } from "zod";

export const ReportTraderDataItemSchema = z.object({
  volume: z.number(),
  trader_id: z.string(),
  trader_name: z.string(),
  leads: z.number(),
  demo: z.number(),
  real: z.number(),
  sale_status: z.number(),
  ftd: z.number(),
  depositingAccounts: z.number(),
  sumDeposits: z.number(),
  bonus: z.number(),
  withdrawal: z.number(),
  chargeback: z.number(),
  netRevenue: z.number(),
  pnl: z.number(),
  Qftd: z.number(),
  totalCom: z.number(),
});

type ReportTraderDataItem = z.infer<typeof ReportTraderDataItemSchema>;

export const getReportTraderData = async (
  prisma: PrismaClient,
  from: Date,
  uid: string[]
): Promise<Record<string, ReportTraderDataItem>> => {
  const ReportTradersData = await prisma.reporttraders.findMany({
    where: {
      Date: {
        gte: from,
      },
      ClickDetails: {
        in: uid,
      },
    },
    select: {
      ClickDetails: true,
      Type: true,
      Volume: true,
      TraderID: true,
      TraderAlias: true,
      SaleStatus: true,
      FirstDeposit: true,
      TotalDeposits: true,
      DepositAmount: true,
      BonusAmount: true,
      WithdrawalAmount: true,
      ChargeBackAmount: true,
      NetDeposit: true,
      PNL: true,
      Commission: true,
    },
  });

  const ReportTradersDataItems: Record<string, ReportTraderDataItem> = {};

  console.log(`muly:getReportTraderData`, {
    ReportTradersData: ReportTradersData.length,
    where: {
      Date: {
        gte: from,
      },
      ClickDetails: {
        in: uid,
      },
    },
  });

  for (const item of ReportTradersData) {
    const clickDetails = item.ClickDetails;

    if (!ReportTradersDataItems[clickDetails]) {
      ReportTradersDataItems[clickDetails] = {
        volume: 0,
        trader_id: "",
        trader_name: "",
        leads: 0,
        demo: 0,
        real: 0,
        sale_status: 0,
        ftd: 0,
        depositingAccounts: 0,
        sumDeposits: 0,
        bonus: 0,
        withdrawal: 0,
        chargeback: 0,
        netRevenue: 0,
        pnl: 0,
        Qftd: 0,
        totalCom: 0,
      };
    }

    const currentItem = ReportTradersDataItems[clickDetails];
    if (!currentItem) {
      throw new Error("currentItem is undefined");
    }
    currentItem.volume += Number(item.Volume);
    currentItem.trader_id = item.TraderID;
    currentItem.trader_name = item.TraderAlias;

    switch (item.Type) {
      case "lead":
        currentItem.leads += 1;
        break;
      case "demo":
        currentItem.demo += 1;
        break;
      case "real":
        currentItem.real += 1;
        break;
    }

    currentItem.sale_status += Number(item.SaleStatus);
    currentItem.ftd += Number(item.FirstDeposit);
    currentItem.depositingAccounts += Number(item.TotalDeposits);
    currentItem.sumDeposits += Number(item.DepositAmount);
    currentItem.bonus += Number(item.BonusAmount);
    currentItem.withdrawal += Number(item.WithdrawalAmount);
    currentItem.chargeback += Number(item.ChargeBackAmount);
    currentItem.netRevenue += Number(item.NetDeposit);
    currentItem.pnl += Number(item.PNL);

    if (
      Number(item.TotalDeposits) > 0 ||
      Number(item.Volume) > 0 ||
      Number(item.PNL) > 0
    ) {
      currentItem.Qftd++;
    }

    currentItem.totalCom += Number(item.Commission);
  }

  return ReportTradersDataItems;
};
