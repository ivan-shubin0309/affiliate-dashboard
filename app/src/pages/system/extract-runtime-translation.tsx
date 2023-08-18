import { useState } from "react";
import { extractRuntimeTranslation } from "../../server/process/extract-runtime-translation";
import { useTranslation } from "next-i18next";
import { i18nGetServerSideProps } from "@/utils/i18n-ssr";
import ComponentTest from "@/pages/system/comonents-test";

export const getServerSideProps = i18nGetServerSideProps(["affiliate"]);

const ExtractRuntimeTranslation = () => {
  const { t: affiliate } = useTranslation("affiliate");
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = () => {
    setIsLoading(true);
    const answer = extractRuntimeTranslation({
      affiliate,
    });
    console.log(`extractRuntimeTranslation ${answer.message}`, { answer });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div>ExtractRuntimeTranslation</div>
      <button onClick={() => handleExtract()}>EXTRACT</button>
    </div>
  );
};

export default ExtractRuntimeTranslation;
ExtractRuntimeTranslation.Layout = "NoLayout";
