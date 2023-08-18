import { createTRPCRouter } from "../../trpc";
import {
  getAccount,
  getAdminInfo,
  recoverPassword,
  registerAccount,
  updateAccount,
} from "./account";
import { getPaymentDetails, getPaymentsPaid } from "./billing";
import { getMerchantCreative, getMerchantCreativeMeta } from "./creative";
import {
  getAllPerformanceChart,
  getConversionChart,
  getDashboard,
  getPerformanceChart,
  getTopMerchantCreative,
} from "./dashboard";

import {
  getReportsColumns,
  upsertReportsColumns,
} from "./reports/columns-setup";

import { getDashboardDeviceReport } from "./dashboard-device-report";
import { deleteProfile, getProfiles, upsertProfile } from "./profile";
import { getMerchantSubCreative, getMerchantSubCreativeMeta } from "./sub";
import { deleteTicket, getTickets, upsertTicket } from "./ticket";

import { badQuerySample } from "@/server/api/routers/affiliates/bad-query-sample";
import { generateBannerCode } from "@/server/api/routers/affiliates/get-tracking-code";
import {
  getAllMerchants,
  getLongCountries,
} from "@/server/api/routers/affiliates/reports";
import {
  exportClicksReport,
  getClicksReport,
} from "@/server/api/routers/affiliates/reports/clicks-report";
import {
  exportCommissionReport,
  getCommissionReport,
} from "@/server/api/routers/affiliates/reports/commission-report";
import {
  exportCountryReport,
  getCountryReport,
} from "@/server/api/routers/affiliates/reports/country-report";
import { getCountryReportDashboard } from "@/server/api/routers/affiliates/reports/country-report-dashboard";
import {
  exportCreativeReport,
  getCreativeReport,
} from "@/server/api/routers/affiliates/reports/creative-report";
import {
  exportInstallReport,
  getInstallReport,
} from "@/server/api/routers/affiliates/reports/install-reports";
import {
  exportLandingPageData,
  getLandingPageData,
} from "@/server/api/routers/affiliates/reports/landing-page";
import {
  exportPixelLogReportData,
  getPixelLogReport,
} from "@/server/api/routers/affiliates/reports/pixel-log-report";
import {
  exportProfileReportData,
  getProfileReportData,
} from "@/server/api/routers/affiliates/reports/profile-report";
import {
  exportQuickSummaryReport,
  getQuickReportSummary,
} from "@/server/api/routers/affiliates/reports/quick-summary";
import {
  exportSubAffiliateReport,
  getSubAffiliateReport,
} from "@/server/api/routers/affiliates/reports/sub-affiliate-report";
import {
  exportTraderReport,
  getTraderReport,
} from "@/server/api/routers/affiliates/reports/trader-report";
import {
  exportTranslateReportFake,
  getTranslateReportFake,
} from "@/server/api/routers/affiliates/reports/translate-report-fake";
import { getCommissions } from "./commission";
import { getDocuments } from "./document";
import {
  deletePixelMonitor,
  getPixelMonitor,
  getPixelMonitorMeta,
  upsertPixelMonitor,
} from "./pixel";

export const affiliatesRouter = createTRPCRouter({
  getDashboard,
  getTopMerchantCreative,
  getPerformanceChart,
  getAllPerformanceChart,
  getConversionChart,
  getReportsColumns,
  upsertReportsColumns,

  getMerchantCreativeMeta,
  getMerchantCreative,
  generateBannerCode,

  getMerchantSubCreativeMeta,
  getMerchantSubCreative,

  getProfiles,
  upsertProfile,
  deleteProfile,

  getAccount,
  updateAccount,
  registerAccount,
  recoverPassword,
  getAdminInfo,

  getPaymentsPaid,
  getPaymentDetails,

  getTickets,
  upsertTicket,
  deleteTicket,

  getQuickReportSummary,
  exportQuickSummaryReport,

  getInstallReport,
  exportInstallReport,

  getAllMerchants,

  getCommissionReport,
  exportCommissionReport,

  getClicksReport,
  getTranslateReportFake,
  exportTranslateReportFake,
  exportClicksReport,

  getCountryReport,
  exportCountryReport,

  getDocuments,

  getCommissions,

  getCreativeReport,
  exportCreativeReport,

  getLandingPageData,
  exportLandingPageData,

  getTraderReport,
  exportTraderReport,
  getLongCountries,

  exportPixelLogReportData,
  getPixelLogReport,

  getProfileReportData,
  exportProfileReportData,

  getSubAffiliateReport,
  exportSubAffiliateReport,

  getPixelMonitorMeta,
  getPixelMonitor,
  upsertPixelMonitor,
  deletePixelMonitor,

  badQuerySample,

  getCountryReportDashboard,
  getDashboardDeviceReport,
});
