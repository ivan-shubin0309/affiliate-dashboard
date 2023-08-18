import { TRPCError } from "@trpc/server";

export const checkIsAdmin = ({ user }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (true) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "UNAUTHORIZED",
    });
  }
};

export const checkIsUser = ({ session }: any): number => {
  const userId = session?.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing user.",
    });
  }

  return Number(userId);
};
