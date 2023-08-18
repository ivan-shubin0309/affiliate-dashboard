import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { convertToNumber, formatPrice } from "../../../utils/format";
import { PayAbleTo } from "../invoice/PayAbleTo";
import { Table } from "../invoice/Table";
import { HeaderInformation } from "../invoice/header-information";
import { Heading } from "../invoice/heading";
import { styles } from "../invoice/styles";
const tables = {
  table1: {
    columns: ["Merchant", "Deal Type", "Quantity", "Total Price"],
    footers: [{ title: "Sub Total", value: 0 }],
    data: [
      {
        merchant: "",
        deal: "",
        quantity: "",
        total_price: "",
      },
    ],
  },
  table2: {
    columns: ["Merchant", "Deal", "Unit Price", "Quantity", "Price"],
    footers: [
      { title: "Gap from Previous month", value: 0 },
      { title: "Extra Total", value: 0 },
      { title: "Commission Total", value: 0 },
      { title: "Total Payment", value: 0 },
    ],
    data: [
      {
        merchant: "",
        deal: "",
        unitPrice: "",
        quantity: "",
        price: "",
      },
    ],
  },
};
export interface affiliatesDetail {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  mail: string;
  phone: string;
  city: string;
  company: string;
  country: string;
  paymentMethod: string;
  pay_account: string;
  pay_email: string;
  pay_country: number;
  pay_company: string;
  pay_bank: string;
  pay_branch: string;
  pay_swift: string;
  credit: number;
  sub_com: number;
  pay_firstname: string;
  pay_lastname: string;
}
interface payments_details {
  id: number;
  rdate: Date;
  status: string;
  reportType: string;
  month: string;
  year: string;
  paymentID: string;
  merchant_id: number;
  affiliate_id: number;
  trader_id: string;
  amount: number;
  deposit: number;
  withdrawal: number;
  reason: string;
}
interface Props {
  billingLogoPath: string;
  merchant: string;
  affiliatesDetail: affiliatesDetail;
  payments_details: payments_details[];
  payments_paid: {
    id: number;
    month: string;
    year: string;
    affiliate_id: number;
    paid: number;
    paymentID: string;
    transaction_id: string;
    notes: string;
    extras: string;
    total: number;
    sentMail: number;
    amount_gap_from_previous_month: number;
  };
}

const PaymentDetail = ({
  billingLogoPath,
  payments_paid,
  affiliatesDetail,
  payments_details,
  merchant,
}: Props) => {
  const previousMonthGap = payments_paid?.amount_gap_from_previous_month;
  const extraTotal =
    parseFloat(payments_paid?.extras.split("|")[2] ?? "0") *
    parseFloat(payments_paid?.extras.split("|")[3] ?? "0");

  const calcPaymentDetails = (detail_list: payments_details[]) => {
    let type_list = detail_list.map((x) => x.reportType);
    type_list = type_list.filter((item, i, ar) => ar.indexOf(item) === i);

    const result_list = type_list.map((x) => {
      const amount_list = detail_list.map((p_info) => p_info["amount"]);
      return {
        merchant: merchant,
        deal: x.toUpperCase(),
        quantity: `${amount_list.length}`,
        total_price: formatPrice(
          amount_list.reduce((partialSum, v) => partialSum + v, 0)
        ),
      };
    });
    return result_list;
  };
  tables.table1.data = calcPaymentDetails(payments_details);

  const totalCommission = tables.table1.data.reduce(
    (partialSum, v) => partialSum + convertToNumber(v.total_price),
    0
  );
  const totalPayment = previousMonthGap + extraTotal + totalCommission;

  tables.table1.footers.forEach((i) => (i.value = totalCommission));
  tables.table2.footers.forEach((i, index) => {
    if (index === 0) {
      i.value = previousMonthGap;
    } else if (index === 1) {
      i.value = extraTotal;
    } else if (index === 2) {
      i.value = totalCommission;
    } else if (index === 3) {
      i.value = totalPayment;
    }
  });

  const extras = payments_paid?.extras.split("[var]");

  tables.table2.data = extras.map((extra) => {
    return {
      merchant,
      deal: extra.split("|")[1] ?? "",
      unitPrice: extra
        ? formatPrice(parseFloat(extra.split("|")[2] ?? "0"))
        : "",
      quantity: extra.split("|")[3] ?? "",
      price: formatPrice(extraTotal),
    };
  });

  return (
    <>
      <Document>
        <Page size="A4">
          <div style={styles.page}>
            <View style={styles.section}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image style={styles.img} src={billingLogoPath} />
            </View>
            <View style={styles.section}>
              <Heading
                style={styles.paymentForm}
                title="Affiliate Payment Form"
              />
              <HeaderInformation
                style={styles.headerFlexDiv}
                title="Payment #"
                value={payments_paid?.paymentID}
              />
              <HeaderInformation
                style={styles.headerFlexDiv}
                title="Month"
                value={`${payments_paid?.month}/${payments_paid?.year}`}
              />
            </View>
          </div>

          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>
          <div style={styles.page}>
            <View style={styles.section}>
              <Heading title="Payable to :" />
              <PayAbleTo
                bank={affiliatesDetail?.paymentMethod}
                affiliatesDetail={affiliatesDetail}
              />
            </View>
            <View style={styles.section}>
              <Heading title="Affiliate Information:" />
              <HeaderInformation
                title="Affiliate #"
                value={String(affiliatesDetail?.id)}
              />
              <HeaderInformation
                title="Full Name:"
                value={`${affiliatesDetail?.first_name} ${affiliatesDetail?.last_name}`}
              />
              <HeaderInformation
                title="Username:"
                value={affiliatesDetail?.username}
              />
              <HeaderInformation
                title="Country:"
                value={affiliatesDetail?.country}
              />
              <HeaderInformation
                title="Phone:"
                value={affiliatesDetail?.phone}
              />
              <HeaderInformation
                title="Email:"
                value={affiliatesDetail?.mail}
              />
            </View>
          </div>
          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>

          {/* //--------first table ------------- */}
          <View style={styles.section}>
            <div style={styles.page}>
              <View style={styles.CommissionSection}>
                <Heading
                  title="Commission payments"
                  style={styles.textMedium}
                />
              </View>
            </div>
            <Table
              data={tables.table1.data}
              columns={tables.table1.columns}
              footers={tables.table1.footers}
            />
            {/* //------second table-------- */}
            <div style={styles.page}>
              <View style={styles.ExtraSection}>
                <Heading title="Extra payments" style={styles.textMedium} />
              </View>
            </div>
            <Table
              data={tables.table2.data}
              columns={tables.table2.columns}
              footers={tables.table2.footers}
            />
            <div style={styles.page}>
              <View style={styles.section}>
                <Heading style={styles.textSmall} title="Transection ID" />
                <Heading
                  style={styles.textBold}
                  title={payments_paid?.transaction_id}
                />
              </View>
              <View style={styles.section}>
                <Heading style={styles.textSmall} title="Notes" />
                <Heading style={styles.textBold} title={payments_paid?.notes} />
              </View>
            </div>
            <div style={styles.page}>
              <View style={styles.section}>
                <Heading
                  style={styles.textLarge}
                  title={"Thank you for your business\nGamingAffiliates"}
                />
              </View>
            </div>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default PaymentDetail;
