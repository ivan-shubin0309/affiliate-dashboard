import Head from "next/head";

import { ProfileReport } from "../../../components/affiliates/reports/ProfileReport";
import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Profile Report</title>
        <meta name="description" content="Creative Report" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <ProfileReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
