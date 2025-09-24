import { CardDataProps } from "@/types/constants";
import Anchor from "./Anchor";

interface Props {
  isVertical?: boolean;
  data?: CardDataProps;
}

const CardDetailContent = ({ isVertical = false, data }: Props) => {
  const className = isVertical
    ? "-translate-x-1/2 w-[80vw]"
    : "mr-[8%] -translate-y-1/2 h-[40vw]";

  return (
    <div
      className={`bg-[#fefefecc] rounded-2xl shadow-md p-8 overflow-y-auto duration-0.2 z-10 absolute left-1/2 top-1/2 ${className}`}
    >
      <h1 className="text-3xl font-bold text-[#1b2a24] mb-6">
        {data?.link ? (
          <Anchor href={data.link}>
            {data.title}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 3h7v7m0-7L10 14"></path>
            </svg>
          </Anchor>
        ) : (
          data?.title
        )}
      </h1>

      <h2 className="text-xl font-bold text-[#1b2a24] mb-3">설명</h2>
      <p className="text-[#2d3a34] mb-8">{data?.description}</p>

      <h2 className="text-xl font-semibold text-[#1b2a24] mb-3">작업 기간</h2>
      <p className="text-base text-gray-700 mb-8">{data?.period}</p>

      <h2 className="text-xl font-semibold text-[#1b2a24] mb-3">
        주요 기여 및 성과
      </h2>

      {data?.contributions.map((contribution, index) => (
        <div
          key={index}
          className={index < data?.contributions.length - 1 ? "mb-6" : ""}
        >
          <h3 className="text-l font-semibold text-[#1b2a24] mb-2">
            {contribution.title}
          </h3>

          {contribution.type === "list" && contribution.items && (
            <ul className="list-disc list-inside space-y-2 text-[#2d3a34]">
              {contribution.items.map((listItem, itemIndex) => (
                <li key={itemIndex}>{listItem}</li>
              ))}
            </ul>
          )}

          {contribution.type === "paragraph" && contribution.content && (
            <p className="text-[#2d3a34]">{contribution.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardDetailContent;
