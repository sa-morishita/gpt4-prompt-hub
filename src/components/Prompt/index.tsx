import Markdown from "../Markdown";
import {
  ClipboardDocumentIcon,
  Cog8ToothIcon,
  GlobeAltIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { memo, type FC } from "react";
import { toast } from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";

const MemoizedGlobeAltIcon = memo(GlobeAltIcon);
const MemoizedCog8ToothIcon = memo(Cog8ToothIcon);
const MemoizedUserIcon = memo(UserIcon);
const MemoizedClipboardDocumentIcon = memo(ClipboardDocumentIcon);

type PromptProps = RouterOutputs["prompt"]["getPromptById"];

interface Props {
  prompt: PromptProps;
}

const Prompt: FC<Props> = ({ prompt }) => {
  const router = useRouter();

  const { id, title, description, model, referenceUrl, tags, messages } =
    prompt;

  const deletePrompt = api.prompt.deletePrompt.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await router.push("/");
    },
  });

  return (
    <>
      <div className="max-w-2xl mx-auto w-full">
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <div className="w-full">
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300">
              <p className="block text-xs font-medium text-gray-600">
                タイトル
              </p>
              <p className="block w-full border-0 p-0 text-gray-900 prose">
                {title}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300">
              <p className="block text-xs font-medium text-gray-600">概要</p>
              <p className="block w-full border-0 p-0 text-gray-900 prose whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
          {referenceUrl && (
            <div className="w-full">
              <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300">
                <p className="block text-xs font-medium text-gray-600">
                  参考URL
                </p>
                <a
                  href={referenceUrl}
                  className="block w-full border-0 p-0 text-blue-600 prose overflow-hidden"
                  target="_blank"
                  rel="noreferrer"
                >
                  {referenceUrl}
                </a>
              </div>
            </div>
          )}
          <div className="my-4 flex w-full flex-wrap items-center gap-2">
            <div className="whitespace-nowrap rounded-2xl bg-purple-600 px-5 py-2 text-white text-xs">
              {model}
            </div>
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="whitespace-nowrap rounded-2xl bg-emerald-600 px-5 py-2 text-white text-xs"
              >
                {tag.name}
              </div>
            ))}
          </div>

          {messages
            .sort((first, second) => {
              if (first.messageIndex > second.messageIndex) return 1;
              return -1;
            })
            .map((message, index) => {
              if (index === 0 || index % 2 === 1)
                return (
                  <div key={index} className="w-full space-y-4">
                    <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300">
                      <div className="block text-xs font-medium text-gray-600">
                        <div className="flex w-full justify-between items-center">
                          {index === 0 ? (
                            <div className="flex items-center">
                              <MemoizedCog8ToothIcon className="h-4 w-4" />
                              <span>AIの設定</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <MemoizedUserIcon className="h-4 w-4" />
                              <span>メッセージ</span>
                            </div>
                          )}
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                message.content
                              );
                              toast.success("コピーしました");
                            }}
                            className="rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900 active:scale-95 "
                          >
                            <MemoizedClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="block w-full border-0 px-0 py-2 text-gray-900 prose whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );

              return (
                <div key={index} className="w-full">
                  <div className="relative rounded-md rounded-b-none border-purple-600 border-2 bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300">
                    <div className="block text-xs font-medium text-gray-600">
                      <div className="flex items-center">
                        <MemoizedGlobeAltIcon className="h-4 w-4" />
                        <span>返答</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Markdown response={message.content} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="text-center mt-3">
        <button
          type="button"
          onClick={() => {
            deletePrompt.mutate({
              id,
            });
          }}
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          プロンプトを削除
        </button>
      </div>
    </>
  );
};

export default Prompt;
