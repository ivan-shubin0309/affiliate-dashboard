import Head from "next/head";
import { CommissionReport } from "../../../components/affiliates/reports/CommissionReport";

import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Commission Report</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <CommissionReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
