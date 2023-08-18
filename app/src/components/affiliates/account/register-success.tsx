import Head from "next/head";

import type { MyPage } from "../../common/types";
import Link from "next/link";

export const RegisterSuccess = () => {
  return (
    <div className="flex max-w-2xl flex-col gap-6 py-5">
      <p>
        Thank you for registering with Affiliate Dashboard. We are thrilled to
        have you on board and we appreciate the opportunity to serve you.
      </p>
      <p>
        Your registration is being processed and you will receive an email
        confirmation shortly. In the meantime, please feel free to explore our
        platform and familiarize yourself with the features and functionalities
        that we offer.
      </p>
      <p>
        Our team is dedicated to providing you with the best possible user
        experience, and we are committed to ensuring that your needs are met at
        every step of the way. If you have any questions or concerns, please do
        not hesitate to reach out to our support team for assistance.
      </p>
      <p>
        Thank you again for choosing us. We look forward to working with you and
        helping you achieve your goals.
      </p>

      <Link
        className="ml-1 inline-block font-bold text-primary"
        href="/auth/signin"
      >
        Sign In
      </Link>
    </div>
  );
};
