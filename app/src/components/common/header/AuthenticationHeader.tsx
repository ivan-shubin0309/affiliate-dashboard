import { api } from "@/utils/api";
import Image from "next/image";
import { useConfigContext } from "../config/config-context";
import ImageWithFallback from "@/components/common/image-fallback";

interface Props {
  children?: React.ReactNode;
}

const AuthenticationHeader = ({ children }: Props) => {
  const { config } = useConfigContext();
  const logoPath = config?.logoPath;
  return (
    <header className="rounded-lg pb-6 pt-6 font-['Inter'] font-normal">
      <div className="mb-7 text-center text-4xl">
        <ImageWithFallback
          className="ml-1 mr-2 inline-block h-auto w-[115px]"
          src={logoPath ? logoPath : "/img/logo.png"}
          fallbackSrc={"/img/logo.png"}
          width="115"
          height="115"
          alt="logo"
        />
      </div>
      <hr className="min-w-[240px]" />
      <div className="mt-6 text-center text-3xl">{children}</div>
    </header>
  );
};

export default AuthenticationHeader;
