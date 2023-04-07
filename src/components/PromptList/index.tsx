import PromptCards from "../PromptCards";
import { type FC } from "react";
import { api } from "~/utils/api";

const PromptList: FC = () => {
  const getPrompts = api.prompt.getPrompts.useQuery();

  return (
    <>
      {getPrompts.isLoading && (
        <div className="text-center py-6">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-emerald-600 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-purple-600 after:border-x-transparent"></span>
        </div>
      )}

      {getPrompts.isSuccess && <PromptCards prompts={getPrompts.data} />}
    </>
  );
};

export default PromptList;
