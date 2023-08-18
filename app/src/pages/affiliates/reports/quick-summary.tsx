import Head from "next/head";
import { QuickSummaryReport } from "../../../components/affiliates/reports/QuickSummaryReport";
import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Quick Summary Report</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <QuickSummaryReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
