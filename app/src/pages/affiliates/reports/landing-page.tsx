import Head from "next/head";
import { LandingPageReport } from "../../../components/affiliates/reports/LandingPageReport";

import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  return (
    <>
      {}
      <Head>
        <title>Landing Page Report</title>
        <meta name="description" content="Creative Report" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <LandingPageReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
