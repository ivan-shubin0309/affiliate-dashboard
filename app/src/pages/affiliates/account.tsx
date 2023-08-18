import Head from "next/head";

import { AccountDetails } from "../../components/affiliates/account/AccountDetails";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates My Account</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <AccountDetails />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
