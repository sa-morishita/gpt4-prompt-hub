import PromptCards from "../PromptCards";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { api, type RouterOutputs } from "~/utils/api";

type TagsProps = RouterOutputs["tag"]["getTags"];

interface Props {
  tags: TagsProps;
}

const TagSearch: FC<Props> = ({ tags }) => {
  const router = useRouter();

  const {
    query: { tagId },
  } = router;

  const [selectTagId, setSelectTagId] = useState<string>(
    (tagId as string) || ""
  );

  const getPromptsByTag = api.prompt.getPromptsByTag.useQuery(
    {
      tagId: selectTagId,
    },
    {
      enabled: Boolean(selectTagId),
    }
  );

  return (
    <>
      <div className="my-4 flex w-full flex-wrap items-center gap-2 lg:gap-4">
        {tags.map((tag) => (
          <button
            type="button"
            onClick={() => setSelectTagId(tag.id)}
            key={tag.id}
            className={`
                ${tag.id === selectTagId ? "bg-emerald-900" : "bg-emerald-600"}
                flex items-center justify-center space-x-2 whitespace-nowrap rounded-2xl px-5 py-2 text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 text-xs lg:text-base
                `}
          >
            {tag.name}
            <span className="pl-1">({tag._count.prompt})</span>
          </button>
        ))}
      </div>
      {getPromptsByTag.isFetching && getPromptsByTag.isLoading && (
        <div className="text-center py-6">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-emerald-600 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-purple-600 after:border-x-transparent"></span>
        </div>
      )}
      {getPromptsByTag.isSuccess && (
        <PromptCards prompts={getPromptsByTag.data} />
      )}
    </>
  );
};

export default TagSearch;
