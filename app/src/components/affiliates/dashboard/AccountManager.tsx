import { PhoneNumberIcon, SupportIcon } from "@/components/icons";
import { firstLetterUpperCase } from "@/utils/format";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { api } from "@/utils/api";

const AccountManager = () => {
  const { data } = api.affiliates.getAdminInfo.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  console.log(`AccountManager`, { data });

  const {
    first_name,
    last_name,
    email,
    phone,
    IMUser,
    group_title,
    additionalLinkUrl,
    level,
  } = data || {};

  console.log(`muly:AccountManager`, { data });

  return email || phone || IMUser ? (
    <div className="rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
      <div className="mb-3 text-xl font-bold text-[#2262C6]">
        Your Account Manager
      </div>
      <div className="align-center mb-2 flex justify-center">
        <User size={72} />
      </div>
      <div className="align-center mb-5 text-center text-base">
        <div className="font-bold text-black">
          {firstLetterUpperCase(first_name)} {firstLetterUpperCase(last_name)}{" "}
        </div>
        <div className="text-[#717579]">{firstLetterUpperCase(level)}</div>
      </div>
      <div className="rounded-2xl bg-[#F4F7F9] px-4 py-5 drop-shadow">
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <Mail className="h-6 w-6" />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            <Link href={`mailto:${email}`}>{email}</Link>
          </div>
        </div>
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <PhoneNumberIcon />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">{phone}</div>
        </div>
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <img width="23" src="/img/icons/skype.png" alt="worldmap" />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            <Link href={`skype:${IMUser}?call`}>{IMUser}</Link>
          </div>
        </div>
        <div className="flex ">
          <div className="flex items-center justify-center px-3">
            <SupportIcon />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            {group_title}
          </div>
        </div>
      </div>

      <div className="mt-5 px-4">
        {additionalLinkUrl && (
          <Link
            className="inline-block w-full rounded-lg border border-solid pb-3 pt-3 text-center text-sm duration-100 ease-in hover:bg-gray-100 "
            // variant="outline"
            href={additionalLinkUrl ? additionalLinkUrl : ""}
          >
            Open a Ticket
          </Link>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AccountManager;
