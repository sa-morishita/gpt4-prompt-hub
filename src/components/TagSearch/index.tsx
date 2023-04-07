import PromptCards from "../PromptCards";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { api } from "~/utils/api";

const TagSearch: FC = () => {
  const router = useRouter();

  const {
    query: { tagId },
  } = router;

  const [selectTagId, setSelectTagId] = useState<string>(
    (tagId as string) || ""
  );

  const getTags = api.tag.getTags.useQuery();

  const getPromptsWithTag = api.prompt.getPromptsWithTag.useQuery(
    {
      tagId: selectTagId,
    },
    {
      enabled: Boolean(selectTagId),
    }
  );

  console.log(getPromptsWithTag);

  return (
    <>
      {getTags.isSuccess && (
        <div className="my-4 flex w-full flex-wrap items-center gap-4">
          {getTags.data.map((tag) => (
            <button
              type="button"
              onClick={() => setSelectTagId(tag.id)}
              key={tag.id}
              className={`
                ${tag.id === selectTagId ? "bg-emerald-900" : "bg-emerald-600"}
                flex items-center justify-center space-x-2 whitespace-nowrap rounded-2xl px-5 py-2 text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600
                `}
            >
              {tag.name}
              <span className="pl-1">({tag._count.prompt})</span>
            </button>
          ))}
        </div>
      )}
      {(getTags.isLoading ||
        (getPromptsWithTag.isFetching && getPromptsWithTag.isLoading)) && (
        <div className="text-center py-6">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-emerald-600 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-purple-600 after:border-x-transparent"></span>
        </div>
      )}
      {getPromptsWithTag.isSuccess && (
        <PromptCards prompts={getPromptsWithTag.data} />
      )}
    </>
  );
};

export default TagSearch;
