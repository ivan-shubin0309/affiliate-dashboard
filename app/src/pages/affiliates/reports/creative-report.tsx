import Head from "next/head";
import { CreativeReport } from "../../../components/affiliates/reports/CreativeReport";

import type { MyPage } from "../../../components/common/types";

import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Creative Report</title>
        <meta name="description" content="Creative Report" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <CreativeReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
