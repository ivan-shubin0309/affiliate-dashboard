import Head from "next/head";

import { Commissions } from "../../components/affiliates/commissions/Commissions";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Commission Structure</title>
        <meta name="description" content="Affiliates Commission Structure" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Commissions />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
