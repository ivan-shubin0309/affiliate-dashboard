import Head from "next/head";
import { Profiles } from "../../components/affiliates/profiles/Profiles";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const ProfilePage: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Profiles</title>
        <meta name="description" content="Affiliates Profiles" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Profiles />
    </>
  );
};

export default ProfilePage;

ProfilePage.Layout = "Affiliates";
