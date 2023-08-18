import PaymentDetail from "@/components/affiliates/billing/payment-detail";
import type { MyPage } from "@/components/common/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { payments_details } from "@prisma/client";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
const Page: MyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.affiliates.getPaymentDetails.useQuery({
    paymentId: String(id),
  });
  const {
    payments_paid,
    affiliatesDetail,
    merchants,
    payments_details,
    billingLogoPath,
  } = data || {};
  console.log(data);

  return (
    <>
      <Head>
        <title>PaymentView</title>
        <meta name="description" content="PaymentView" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* <main className={styles.main}> */}
      {typeof window !== "undefined" &&
        payments_paid &&
        affiliatesDetail &&
        payments_details && (
          <PDFViewer height={window.innerHeight} width={window.innerWidth}>
            <PaymentDetail
              billingLogoPath={billingLogoPath || ""}
              payments_paid={payments_paid}
              affiliatesDetail={affiliatesDetail}
              payments_details={payments_details}
              merchant={
                Number(affiliatesDetail?.merchants) === 0
                  ? "OTHER"
                  : merchants?.name ?? ""
              }
            />
          </PDFViewer>
        )}
      {/* </main> */}
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
