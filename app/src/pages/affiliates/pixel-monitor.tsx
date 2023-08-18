import Head from "next/head";

import PixelMonitor from "../../components/affiliates/pixel/PixelMonitor";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Pixel Monitor</title>
        <meta name="description" content="Affiliates Pixel Monitor" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <PixelMonitor />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
