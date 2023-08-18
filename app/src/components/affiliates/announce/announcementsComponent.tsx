import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PropsType {
  propsdata: DataType;
}

interface DataType {
  title: string;
  time: string;
  content: string;
}

const AnnouncementsComponent = ({ propsdata }: PropsType) => {
  const [expanded1, setExpanded1] = useState(true);

  return (
    <div className="mt-4 flex h-auto cursor-pointer flex-col justify-between rounded-md  bg-[#F5F8FA] p-4 pt-3 transition-all duration-500 md:px-5">
      <div className="text-base font-medium md:text-xl ">
        {propsdata.title}
        <div className="mt-2 text-sm font-medium text-[#636363] md:mt-2.5">
          {propsdata.time}
        </div>
        <div
          className={
            "mt-3.5 p-3 text-base  font-medium  transition duration-150 ease-in-out  md:mt-4 md:pr-56 " +
            (expanded1 ? " max-h-9 truncate " : "")
          }
        >
          {propsdata.content}
        </div>
      </div>
      <div className="mt-5 flex md:mt-6">
        <button
          className="text-left text-sm  font-medium text-blue-500"
          onClick={() => setExpanded1(!expanded1)}
        >
          <div className="ml-2 inline-flex items-center justify-center text-blue-500 duration-300">
            {expanded1 ? (
              <>
                More
                <ChevronRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Less
                <ChevronLeft className="h-5 w-5" />
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsComponent;
