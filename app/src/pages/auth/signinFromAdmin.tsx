import { Loading } from "@/components/common/Loading";
import type { MyPage } from "../../components/common/types";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

// http://localhost:3001/auth/signinFromAdmin?username=Trevil&password=9175e7f25ebc0ed919432b74377b1203
// http://localhost:3001/auth/signinFromAdmin?username=bd-500&password=backdoor

const Page: MyPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { username, password } = router.query;

  // console.log(`muly:loginAs:render`, { username, password, session, status });

  const loginAs = useCallback(async () => {
    const callbackUrl = "/";
    try {
      // console.log(`muly:loginAs:signOut`, { session });
      // await signOut();

      // console.log(`muly:loginAs:signIn`, {});
      const user = await signIn("credentials", {
        username,
        password,
        redirect: true,
        callbackUrl,
      });

      await router.replace("/");
    } catch (error) {
      console.error(`muly:loginAs:error`, { error });
    }
  }, [username, password, router]);

  useEffect(() => {
    if (status !== "loading") {
      console.log(`muly:use effect`, {});
      loginAs()
        .then(() => {
          console.log("redirected");
        })
        .catch(console.error);
    }
  }, [status, loginAs]);

  return <Loading />;
};

export default Page;
Page.Layout = "NoLayout";
