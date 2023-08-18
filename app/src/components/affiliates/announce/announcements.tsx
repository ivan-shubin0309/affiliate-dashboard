import { PageHeader } from "@/components/common/page/page-header";
import Affiliates from "../../../layouts/AffiliatesLayout";

import AnnouncementsComponent from "./announcementsComponent";

const Announcements = () => {
  const data = [
    {
      title: "New minimum withdrawal amount for stablecoins",
      time: "2023-07-02 17:21:04",
      content:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content.",
    },
    {
      title: "New minimum withdrawal amount for stablecoins",
      time: "2023-07-02 17:21:04",
      content:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content.",
    },
    {
      title: "New minimum withdrawal amount for stablecoins",
      time: "2023-07-02 17:21:04",
      content:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content. demonstrate the visual form of a document or a typeface without relying on meaningful content.",
    },
  ];

  return (
    <div className="pb-4 pt-5">
      <PageHeader title="Announcements"></PageHeader>
      <div className="h-auto rounded-md bg-white px-4 pb-20 pt-4 shadow-md md:mb-10 md:rounded-2xl">
        {data.map((data, i) => {
          return <AnnouncementsComponent propsdata={data} key={i} />;
        })}
      </div>
    </div>
  );
};

export default Announcements;

Announcements.getLayout = Affiliates;
