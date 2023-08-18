import type { affiliatesDetail } from "../billing/payment-detail";
import { HeaderInformation } from "./header-information";

export const PayAbleTo = ({
  bank,
  affiliatesDetail,
}: {
  bank: string;
  affiliatesDetail: affiliatesDetail;
}) => {
  return (
    <>
      {bank === "bank" ? (
        <>
          <HeaderInformation title="Payment Method:" value={"Wire Transfer"} />
          <HeaderInformation
            title="Address:"
            value={affiliatesDetail?.pay_account}
          />
          <HeaderInformation
            title="Bank Name:"
            value={affiliatesDetail?.pay_bank}
          />
          <HeaderInformation
            title="Bank Address:"
            value={affiliatesDetail?.pay_account}
          />
          <HeaderInformation
            title="Bank City:"
            value={affiliatesDetail?.pay_branch}
          />
          <HeaderInformation
            title="Bank Country:"
            value={affiliatesDetail?.pay_email}
          />
          <HeaderInformation
            title="Swift:"
            value={affiliatesDetail?.pay_swift}
          />
        </>
      ) : bank === "moneyBookers" ? (
        <>
          <HeaderInformation
            title="Payment Method:"
            value={"MoneyBookers (Skrill)"}
          />
          <HeaderInformation
            title="MoneyBookers Address:"
            value={affiliatesDetail?.pay_email}
          />
        </>
      ) : bank === "webmoney" ? (
        <>
          <HeaderInformation title="Payment Method:" value={"Web Money"} />
          <HeaderInformation
            title="WebMoney Address:"
            value={affiliatesDetail?.pay_email}
          />
        </>
      ) : bank === "neteller" ? (
        <>
          <HeaderInformation title="Payment Method:" value={"Neteller"} />
          <HeaderInformation
            title="Neteller Address:"
            value={affiliatesDetail?.pay_email}
          />
        </>
      ) : bank === "paypal" ? (
        <>
          <HeaderInformation title="Payment Method:" value={"PayPal"} />
          <HeaderInformation
            title="PayPal Address:"
            value={affiliatesDetail?.pay_account}
          />
        </>
      ) : (
        <>
          <HeaderInformation
            title="Payment Method:"
            value={affiliatesDetail.paymentMethod}
          />
          <HeaderInformation
            title="Address:"
            value={affiliatesDetail?.pay_account}
          />
        </>
      )}
      <HeaderInformation
        title="Account Name:"
        value={`${affiliatesDetail?.pay_firstname} ${affiliatesDetail?.pay_lastname}`}
      />
    </>
  );
};
