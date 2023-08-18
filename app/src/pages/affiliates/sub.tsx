import Head from "next/head";

import { SubCreativeMaterial } from "../../components/affiliates/sub/SubCreativeMaterial";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Creative Materials</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <SubCreativeMaterial />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
