import Head from "next/head";

import Terms from "../../components/affiliates/terms/Terms";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const TermsPage: MyPage = () => {
  return (
    <>
      <Head>
        <title>Terms & Condition</title>
        <meta name="description" content="Terms" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Terms />
    </>
  );
};

export default TermsPage;

TermsPage.Layout = "Affiliates";
