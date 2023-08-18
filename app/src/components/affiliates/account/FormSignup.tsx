import { Form } from "@/components/common/forms/Form";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { z } from "zod";
import { registerSchema } from "../../../shared-types/forms/register";
import { api } from "../../../utils/api";
export const FormSignup = () => {
  const router = useRouter();
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, registerSchema);
  // const { data: languages } = api.misc.getLanguages.useQuery();

  const registerAccount = api.affiliates.registerAccount.useMutation();
  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    await registerAccount.mutateAsync(values);
    void router.replace(`/auth/register-success`);
  };

  return (
    <div>
      <Form
        formContext={formContext}
        schema={registerSchema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        formProps={{
          submit: { text: "Sign Up", notification: false, className: "w-full" },
        }}
        onSubmit={handleSubmit}
      />
      <div className="mb-6 mt-6 text-center">
        Already have an account?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          href="/auth/signin"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
