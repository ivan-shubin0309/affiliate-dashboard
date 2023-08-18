import Head from "next/head";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

import { AccountPaymentDetails } from "../../components/affiliates/account/AccountPaymentDetails";
import type { MyPage } from "../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Creative Materials</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <AccountPaymentDetails />
    </>
  );
};

export default Page;

Page.Layout = "Affiliates";
