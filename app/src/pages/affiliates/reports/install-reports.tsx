import Head from "next/head";
import { InstallReport } from "../../../components/affiliates/reports/InstallReport";

import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Install Report</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <InstallReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
