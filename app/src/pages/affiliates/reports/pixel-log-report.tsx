import Head from "next/head";
import { PixelLogReports } from "../../../components/affiliates/reports/PixelLogReports";
import type { MyPage } from "../../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Pixel Logs Report</title>
        <meta name="description" content="Creative Report" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <PixelLogReports />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
