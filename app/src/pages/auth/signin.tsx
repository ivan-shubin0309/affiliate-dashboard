import { Loading } from "@/components/common/Loading";
import AuthenticationHeader from "@/components/common/header/AuthenticationHeader";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { FormSignin } from "../../components/affiliates/account/FormSignin";
import AuthenticationFooter from "../../components/common/footer/AuthenticationFooter";
import type { MyPage } from "../../components/common/types";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

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
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="m-auto min-h-full items-center justify-center py-6">
          <div className="w-96 max-w-full px-10">
            <AuthenticationHeader>
              Login to your <br />
              Affillate account
            </AuthenticationHeader>
            <FormSignin />
            <AuthenticationFooter />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
