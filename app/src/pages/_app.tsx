import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import { appWithTranslation } from "next-i18next";
import { i18nConfig } from "../../next-i18next.config.mjs";

import { api } from "../utils/api";

import type { NextComponentType, NextPageContext } from "next";
import type { LayoutKeys } from "../layouts/Layouts";
import { Layouts } from "../layouts/Layouts";

import { Toaster } from "@/components/ui/toaster";
import { ConfigProvider } from "@/components/common/config/config-context";
import { FlagBagProvider } from "@happykit/flags/context";
import { useFlags } from "../flags/client";
import { missingKeyHandler } from "../utils/i18n-utils";
import "../utils/zod-meta";

import "@etchteam/next-pagination/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { ProSidebarProvider } from "react-pro-sidebar";
import "../styles/globals.css";
import Head from "next/head";
import { Loading } from "@/components/common/Loading";
// import { Inter as FontSans } from "next/font/google";
//
// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   display: "swap",
// });

type MyAppProps = AppProps<{ session: Session | null }> & {
  Component: NextComponentType<NextPageContext, any, any> & {
    Layout: LayoutKeys;
  };
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  const flagBag = useFlags({});

  const Layout = Layouts[Component.Layout] ?? ((page) => page);
  const { data: config } = api.misc.getConfig.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const faviconPath = config?.config.faviconPath;

  if (!config || !flagBag.flags) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <link rel="icon" href={faviconPath ? faviconPath : "/favicon.ico"} />
      </Head>
      {/*<style jsx global>{`*/}
      {/*	:root {*/}
      {/*		--font-sans: ${fontSans.style.fontFamily};*/}
      {/*	}*/}
      {/*}`}</style>*/}
      <ProSidebarProvider>
        <SessionProvider session={session}>
          <ConfigProvider value={{ flags: flagBag.flags, ...config }}>
            <Layout>
              <Component {...pageProps} />
              <Toaster />
            </Layout>
          </ConfigProvider>
        </SessionProvider>
      </ProSidebarProvider>
    </>
  );
};

const I18nApp = appWithTranslation(MyApp, {
  ...i18nConfig,
  missingKeyHandler,
});
export default api.withTRPC(I18nApp);
