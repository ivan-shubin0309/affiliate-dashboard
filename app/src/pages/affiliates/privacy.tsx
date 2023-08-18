import Head from "next/head";

import Privacy from "../../components/affiliates/privacy/Privacy";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const PrivacyPage: MyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Privacy />
    </>
  );
};

export default PrivacyPage;

PrivacyPage.Layout = "Affiliates";
