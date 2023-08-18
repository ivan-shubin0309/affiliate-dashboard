import { Loading } from "@/components/common/Loading";
import AuthenticationFooter from "@/components/common/footer/AuthenticationFooter";
import AuthenticationHeader from "@/components/common/header/AuthenticationHeader";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { RecoverLostPassword } from "../../components/affiliates/account/RecoverLostPassword";
import type { MyPage } from "../../components/common/types";
import React, { useEffect } from "react";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const Page: MyPage = () => {
  const redirected = useAuth();
  const [isSent, setIsSent] = React.useState(false);
  if (redirected) {
    return <Loading />;
  }
  // useEffect(() => {
  //   console.log(isSent, "isSent");
  // }, [isSent]);
  return (
    <>
      <Head>
        <title>Affiliates Tickets</title>
        <meta name="description" content="Affiliates Tickets" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="m-auto min-h-full items-center justify-center py-12">
          <div className="m-auto w-full max-w-xs">
            <AuthenticationHeader>
              Reset password for your <br />
              Affillate account
            </AuthenticationHeader>
            <RecoverLostPassword setIsSent={setIsSent} />
          </div>
          <div className="m-auto w-full max-w-xl">
            {isSent && (
              <div className="mt-6">
                We have received your password reset request. If an account with
                the provided email address or user name exists, you will receive
                an email containing password reset instructions. Please check
                your inbox and follow the instructions to reset your password.
                If you don&apos;t see the email, make sure to check your spam or
                junk folders.
              </div>
            )}
          </div>
          <div className="m-auto w-full max-w-xs">
            <AuthenticationFooter />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
