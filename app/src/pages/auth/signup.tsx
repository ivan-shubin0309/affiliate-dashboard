import { FormSignup } from "@/components/affiliates/account/FormSignup";
import { Loading } from "@/components/common/Loading";
import AuthenticationHeader from "@/components/common/header/AuthenticationHeader";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";
import type { MyPage } from "@/components/common/types";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import AuthenticationFooter from "../../components/common/footer/AuthenticationFooter";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  const redirected = useAuth();

  if (redirected) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Affiliates create account</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex min-h-screen flex-col items-center px-5">
        <AuthenticationHeader>
          Register to your <br />
          Affillate account
        </AuthenticationHeader>
        <FormSignup />
        <AuthenticationFooter />
      </main>
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
