import { Form } from "@/components/common/forms/Form";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useTranslation } from "next-i18next";
import type { z } from "zod";
import { lostPasswordSchema } from "../../../shared-types/forms/lost-password";
import { api } from "../../../utils/api";

interface IProps {
  setIsSent: (open: boolean) => void;
}
export const RecoverLostPassword = ({ setIsSent }: IProps) => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, lostPasswordSchema);
  const mutation = api.affiliates.recoverPassword.useMutation();

  const handleSubmit = async (values: z.infer<typeof lostPasswordSchema>) => {
    await mutation.mutateAsync(values);
    setIsSent(true);
  };

  return (
    <div>
      <Form
        formContext={formContext}
        schema={lostPasswordSchema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        formProps={{
          submit: {
            text: "Reset Password",
            notification: false,
            className: "w-full",
          },
        }}
      />
      {/* {!isSent && (
        <div className="mt-6">
          We have received your password reset request. If an account with the
          provided email address or user name exists, you will receive an email
          containing password reset instructions. Please check your inbox and
          follow the instructions to reset your password. If you don&apos;t see
          the email, make sure to check your spam or junk folders.
        </div>
      )} */}
    </div>
  );
};
