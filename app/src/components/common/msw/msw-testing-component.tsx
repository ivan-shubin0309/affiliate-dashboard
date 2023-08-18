import { useTranslation } from "next-i18next";
import { api } from "@/utils/api";
import React from "react";
import { useRouter } from "next/router";

export const MswTestingComponent = () => {
  const router = useRouter();
  const { user, debug, link } = router.query;

  const { t } = useTranslation("landing-page");
  const { data } = api.misc.sampleQuery.useQuery(undefined);
  return (
    <div>
      {t("msw.sample-translated-text", "MSW TEST v2")}
      <h1>useRouter</h1>
      <pre>{JSON.stringify({ user, debug, link }, null, 2)}</pre>
      <h1>useQuery</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
