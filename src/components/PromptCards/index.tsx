import dayjs from "dayjs";
import Link from "next/link";
import { type FC } from "react";
import { type RouterOutputs } from "~/utils/api";

type PromptsProps = RouterOutputs["prompt"]["getPrompts"];

interface Props {
  prompts: PromptsProps;
}

const PromptCards: FC<Props> = ({ prompts }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {prompts.map((prompt) => {
        const { id, title, model, description, createdAt, tags } = prompt;

        return (
          <article
            className="animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-[length:400%_400%] p-0.5 shadow-xl transition [animation-duration:_6s] hover:shadow-sm h-full"
            key={id}
          >
            <div className="rounded-[10px] bg-white p-4 sm:p-6 h-full flex flex-col">
              <time
                dateTime="2022-10-10"
                className="block text-xs text-gray-500"
              >
                {dayjs(createdAt).format("YYYY-MM-DD")}
              </time>

              <Link href={`/prompt/${id}`} className="h-full">
                <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                  {title}
                </h3>
                <p className="text-xs mt-3 whitespace-pre-line overflow-x-hidden">
                  {description}
                </p>
              </Link>

              <div className="flex flex-wrap gap-1 mt-auto pt-4">
                <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600">
                  {model}
                </span>
                {tags.map((tag) => {
                  const { id, name } = tag;

                  return (
                    <Link
                      href={`/?tagId=${id}`}
                      className="whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-600"
                      key={id}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PromptCards;
