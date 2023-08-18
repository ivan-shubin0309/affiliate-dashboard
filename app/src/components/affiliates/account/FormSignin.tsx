import { Form } from "../../common/forms/Form";
import type { z } from "zod";
import { loginSchema } from "../../../shared-types/forms/login";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import Link from "next/link";

// Sample user
// user001
// password user1

export const FormSignin = () => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, loginSchema);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    const callbackUrl = "/";
    setLoginError(null);

    const answer = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    console.log(`muly:handleSubmit`, { answer });

    if (answer && !answer.ok && answer.error) {
      console.error(`authorize ERROR: ${answer.error}`);
      setLoginError(answer.error);
    }
  };

  // console.log(`muly:FormSignin`, { session });

  return (
    <>
      <Form
        formContext={formContext}
        schema={loginSchema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        formProps={{
          submit: {
            className: "w-full",
            text: "Sign In",
            notification: false,
          },
        }}
      ></Form>
      {!!loginError && (
        <div className="mt-2 text-sm text-red-500">{loginError}</div>
      )}
      <div className="mb-6 mt-6 text-center">
        Don’t have an account yet?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          href="/auth/signup"
        >
          Sign Up
        </Link>
      </div>
      {/* <hr />
      <div className="mt-6 text-center">
        Are you an admin?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          href="/auth/signin"
        >
          Sign In here
        </Link>
      </div> */}
    </>
  );
};
