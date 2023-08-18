import { affiliatesModel, data_installModel } from "prisma/zod";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const QuickReportSummarySchema = z.object({
  Date: z.date().nullish(),
  merchant_id: z.number().nullish(),
  Year: z.number().nullish(),
  Month: z.number().nullish(),
  Week: z.number().nullish(),
  Impressions: z.number().nullish(),
  Clicks: z.number().nullish(),
  Install: z.number().nullish(),
  Leads: z.number().nullish(),
  Demo: z.number().nullish(),
  RealAccount: z.number().nullish(),
  FTD: z.number().nullish(),
  FTDAmount: z.number().nullish(),
  RawFTD: z.number().nullish(),
  RawFTDAmount: z.number().nullish(),
  Deposits: z.number().nullish(),
  DepositsAmount: z.number().nullish(),
  Bonus: z.number().nullish(),
  Withdrawal: z.number().nullish(),
  ChargeBack: z.number().nullish(),
  NetDeposit: z.number().nullish(),
  PNL: z.number().nullish(),
  Volume: z.number().nullish(),
  ActiveTrader: z.number().nullish(),
  Commission: z.number().nullish(),
  PendingDeposits: z.number().nullish(),
  PendingDepositsAmount: z.number().nullish(),
});

export const dataInstallSchema = data_installModel.partial().extend({
  merchant_creative: z.object({
    id: z.number().nullish(),
    title: z.string().nullish(),
    url: z.string().nullish(),
    language: z.object({
      title: z.string().nullish(),
    }),
  }),
  merchant: z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
  }),
  affiliate: z.object({
    id: z.number().nullish(),
    username: z.string().nullish(),
  }),
});

export const CommissionReportSchema = z.object({
  merchant_id: z.number().nullish(),
  affiliate_id: z.number().nullish(),
  traderID: z.string().nullish(),
  transactionID: z.string().nullish(),
  Date: z.date().nullish(),
  Type: z.string().nullish(),
  Amount: z.number().nullish(),
  DealType: z.string().nullish(),
  Commission: z.number().nullish(),
  DealTypeCondition: z.string().nullish(),
  level: z.string().nullish(),
  subAffiliateID: z.number().nullish(),
  status: z.string().nullish(),
  updated: z.date().nullish(),
  merchant: z.object({
    name: z.string().nullish(),
  }),
  affiliate: z.object({
    username: z.string().nullish(),
  }),
});

export const LandingPageReportSchema = z.object({
  id: z.number().nullish(),
  rdate: z.date().nullish(),
  last_update: z.date().nullish(),
  valid: z.number().nullish(),
  admin_id: z.number().nullish(),
  merchant_id: z.number().nullish(),
  product_id: z.number().nullish(),
  language_id: z.number().nullish(),
  promotion_id: z.number().nullish(),
  title: z.string().nullish(),
  type: z.string().nullish(),
  width: z.number().nullish(),
  height: z.number().nullish(),
  file: z.string().nullish(),
  url: z.string().nullish(),
  iframe_url: z.string().nullish(),
  alt: z.string().nullish(),
  scriptCode: z.string().nullish(),
  affiliate_id: z.number().nullish(),
  category_id: z.number().nullish(),
  featured: z.number().nullish(),
  affiliateReady: z.number().nullish(),
  language: z.object({
    title: z.string().nullish(),
  }),
  merchant: z.object({
    name: z.string().nullish(),
    producttype: z.string().nullish(),
  }),
  clicks: z.number().nullish(),
  views: z.number().nullish(),
  ctag: z.string().nullish(),
  group_id: z.number().nullish(),
  banner_id: z.number().nullish(),
  profile_id: z.number().nullish(),
  country: z.string().nullish(),
  trader_id: z.string().nullish(),
  sub_trader_id: z.number().nullish(),
  phone: z.string().nullish(),
  trader_alias: z.string().nullish(),
  freeParam: z.string().nullish(),
  freeParam2: z.string().nullish(),
  freeParam3: z.string().nullish(),
  freeParam4: z.string().nullish(),
  freeParam5: z.string().nullish(),
  status: z.string().nullish(),
  platform: z.string().nullish(),
  uid: z.string().nullish(),
  saleStatus: z.string().nullish(),
  lastSaleNote: z.string().nullish(),
  initialftdtranzid: z.string().nullish(),
  isSelfDeposit: z.boolean().nullish(),
  ftdamount: z.number().nullish(),
  traderVolume: z.number().nullish(),
  traderTrades: z.number().nullish(),
  traderValue: z.number().nullish(),
  email: z.string().nullish(),
  couponName: z.string().nullish(),
  campaign_id: z.string().nullish(),
  dummySource: z.number().nullish(),
  volume: z.number().nullish(),
  chargeback: z.number().nullish(),
  accounts: z.number().nullish(),
  lead: z.number().nullish(),
  demo: z.number().nullish(),
  ftd: z.number().nullish(),
  cpi: z.number().nullish(),
  real: z.number().nullish(),
});

export const profileReportSchema = z.object({
  id: z.number().nullish(),
  rdate: z.date().nullish(),
  valid: z.number().nullish(),
  affiliate_id: z.number().nullish(),
  name: z.string().nullish(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  source_traffic: z.string().nullish(),
  affiliate: affiliatesModel.nullish(),
  totalCPI: z.number().nullish(),
  totalReal: z.number().nullish(),
  ftd: z.number().nullish(),
  totalCom: z.number().nullish(),
  totalLeads: z.number().nullish(),
  totalDemo: z.number().nullish(),
  withdrawal: z.number().nullish(),
  chargeback: z.number().nullish(),
  volume: z.number().nullish(),
  totalPNL: z.number().nullish(),
  clicks: z.number().nullish(),
  views: z.number().nullish(),
});

export const CreativeReportSchema = z.object({
  id: z.string().nullish(),
  merchant_id: z.number().nullish(),
  affiliate_id: z.number().nullish(),
  totalViews: z.number().nullish(),
  totalClicks: z.number().nullish(),
  banner_id: z.number().nullish(),
});
const dataInstallSchemaArray = z.array(dataInstallSchema);
const CreativeReportSchemaArray = z.array(CreativeReportSchema);

export const getDataInstall = protectedProcedure.query(async ({ ctx }) => {
  const data = await ctx.prisma.data_install.findMany({
    select: {
      type: true,
    },
    where: {
      merchant_id: {
        gt: 1,
      },
      // valid: 1,
    },
  });

  return data;
});

export const getAllMerchants = protectedProcedure.query(async ({ ctx }) => {
  const merchants = await ctx.prisma.merchants.findMany({
    where: {
      valid: 1,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return merchants.map(({ id, name }) => ({ id, title: name }));
});

export const getAffiliateProfile = protectedProcedure.query(async ({ ctx }) => {
  const affiliates = await ctx.prisma.affiliates_profiles.findMany({
    where: {
      valid: 1,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return affiliates;
});

export const getLongCountries = protectedProcedure
  .input(
    z.object({
      table_type: z.string().optional(),
    })
  )
  .query(async ({ ctx, input: { table_type } }) => {
    const ww = await ctx.prisma.countries.findMany({
      where: {
        id: {
          gt: 1,
        },
      },
      select: {
        id: true,
        title: true,
        code: true,
      },
    });

    return ww;
  });
