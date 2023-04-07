import Markdown from "../Markdown";
import { useModal } from "../Modal/hooks";
import TagForm from "../TagForm";
import TagsAutocompletion from "../TagsAutocompletion";
import { useOpenAIApi } from "./hooks";
import {
  Cog8ToothIcon,
  GlobeAltIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState, type FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import type { MessageFormType, PromptFormType } from "~/models/prompt";
import { messageFormSchema, promptFormSchema } from "~/models/prompt";
import type { TagType } from "~/models/tag";
import { api } from "~/utils/api";

const MemoizedGlobeAltIcon = memo(GlobeAltIcon);
const MemoizedCog8ToothIcon = memo(Cog8ToothIcon);
const MemoizedUserIcon = memo(UserIcon);
const MemoizedXMarkIcon = memo(XMarkIcon);

type formType = PromptFormType & MessageFormType;
const formSchema = z.intersection(promptFormSchema, messageFormSchema);

const PromptForm: FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [promptId, setPromptId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  const { openModal } = useModal("tagFormModal");

  const { isLoading, response, setResponse, error, fetchResponse } =
    useOpenAIApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      referenceUrl: "",
      messages: [
        { role: "system", content: "", exampleIndex: 0, messageIndex: 0 },
        { role: "user", content: "", exampleIndex: 0, messageIndex: 1 },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, update } = useFieldArray({
    control,
    name: "messages",
  });

  const getTags = api.tag.getTags.useQuery();

  const createPrompt = api.prompt.createPrompt.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createMessage = api.message.createMessages.useMutation({
    onSuccess: () => {
      toast.success("登録しました!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: formType) => {
    const { title, description, referenceUrl, messages } = data;

    try {
      let createdPromptId = "";
      if (fields.length === 2) {
        const promptData = {
          title,
          description,
          referenceUrl,
        };

        createdPromptId = await createPrompt.mutateAsync(
          selectedTags.length > 0
            ? { ...promptData, tagsIds: selectedTags }
            : promptData
        );
        setPromptId(createdPromptId);
      }
      setIsSaved(true);

      const fixedMessages = messages.map((message) => {
        const { role, content, messageIndex } = message;

        const systemPrompt = `${content}（返答の最後に、返答内容の自信度や正確さを10段階で評価し追加してください。）（返答は必ずマークダウン形式にしてください。）`;

        return { role, content: messageIndex === 0 ? systemPrompt : content };
      });

      // fieldsにapiからのresponseを表示する欄を作る
      append({
        role: "assistant",
        content: "",
        exampleIndex: 0,
        messageIndex: fields.length,
      });

      const content = await fetchResponse(fixedMessages);

      if (!content) throw new Error("返答がありませんでした。");

      messages.push({
        role: "assistant",
        content,
        exampleIndex: 0,
        messageIndex: messages.length,
      });

      // 初回（messages.length < 4）は全て保存、2回目以降は最後の2つだけ保存
      const createMessages = messages.filter((message, index) => {
        if (messages.length < 4) {
          return message;
        } else if (
          index === messages.length - 2 ||
          index === messages.length - 1
        ) {
          return message;
        }
      });

      await createMessage.mutateAsync({
        messages: createMessages,
        promptId: promptId || createdPromptId,
      });

      setResponse("");

      // apiからのresponseのstreamが終わったらfieldsを更新
      update(fields.length, {
        role: "assistant",
        content,
        exampleIndex: 0,
        messageIndex: fields.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addMessage = () => {
    append({
      role: "user",
      content: "",
      exampleIndex: 0,
      messageIndex: fields.length,
    });
  };

  return (
    <>
      <div className="max-w-2xl mx-auto w-full">
        <form
          className="relative flex flex-col items-center justify-center space-y-4"
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            await onSubmit(data);
          })}
        >
          <div className="w-full">
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-600"
              >
                タイトル
              </label>
              <input
                type="text"
                id="title"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 prose"
                {...register("title")}
                disabled={isSaved}
              />
            </div>
            <p className="w-full pb-2 text-left text-sm text-red-500">
              {errors.title?.message}
            </p>
          </div>
          <div className="w-full">
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-600"
              >
                概要
              </label>
              <textarea
                cols={10}
                rows={2}
                {...register("description")}
                id="description"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 prose"
                disabled={isSaved}
              />
            </div>
            <p className="w-full pb-2 text-left text-sm text-red-500">
              {errors.description?.message}
            </p>
          </div>
          <div className="w-full">
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="referenceUrl"
                className="block text-xs font-medium text-gray-600"
              >
                参考URL
              </label>
              <input
                type="text"
                id="referenceUrl"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 prose"
                {...register("referenceUrl")}
                disabled={isSaved}
              />
            </div>
            <p className="w-full pb-2 text-left text-sm text-red-500">
              {errors.referenceUrl?.message}
            </p>
          </div>

          {getTags.isSuccess && (
            <>
              <TagForm />
              <div className="my-4 flex w-full items-center space-x-4">
                <div className="z-10 w-4/5">
                  <TagsAutocompletion
                    tags={getTags.data}
                    setSelectedTags={setSelectedTags}
                    selectedTags={selectedTags}
                  />
                </div>
                <button
                  onClick={() => openModal()}
                  className="space-x-3 whitespace-nowrap rounded border border-gray-200 px-4 py-2 text-sm transition bg-white hover:border-gray-900 hover:text-gray-900 ring-1 ring-inset ring-gray-300"
                >
                  タグを生成
                </button>
              </div>
              <div className="my-4 flex w-full flex-wrap items-center gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="whitespace-nowrap rounded-2xl bg-emerald-600 px-5 py-2 text-white text-xs"
                  >
                    <div>{tag.name}</div>
                    <div
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.filter((currTag) => currTag.id !== tag.id)
                        )
                      }
                      className="cursor-pointer"
                    >
                      <MemoizedXMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {fields.map((field, index) => {
            if (index === 0 || index % 2 === 1)
              return (
                <div key={field.id} className="w-full space-y-4">
                  <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                    <label
                      htmlFor={`user${index}`}
                      className="block text-xs font-medium text-gray-600"
                    >
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
                    </label>
                    <textarea
                      {...register(`messages.${index}.content`)}
                      id={`user${index}`}
                      cols={10}
                      rows={4}
                      className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 prose"
                      placeholder={
                        index === 0
                          ? "設定はコンテキストや動作を提供するために使用されます。システムメッセージで、AIの役割や回答すべきトピック、行動の制約などを指定できます。このメッセージは、会話の初期設定を行う際に特に役立ちます。"
                          : ""
                      }
                      disabled={isSaved && index + 1 !== fields.length}
                    />
                  </div>

                  {errors.messages && errors.messages[index]?.content && (
                    <p className="w-full pb-2 text-left text-sm text-red-500">
                      {errors.messages[index]?.content?.message}
                    </p>
                  )}
                </div>
              );

            return (
              <div key={field.id} className="w-full">
                <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor={`assistant${index}`}
                    className="block text-xs font-medium text-gray-600"
                  >
                    <div className="flex items-center">
                      <MemoizedGlobeAltIcon className="h-4 w-4" />
                      <span>返答</span>
                    </div>
                  </label>

                  <div className="mt-2">
                    <Markdown
                      response={(fields[index]?.content as string) || response}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {fields.length % 2 !== 0 && !isLoading && (
            <div className="text-center">
              <button
                type="button"
                onClick={addMessage}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                disabled={
                  isLoading || createPrompt.isLoading || createMessage.isLoading
                }
              >
                メッセージを追加
              </button>
            </div>
          )}
          <div>
            <button
              className="relative overflow-hidden rounded-lg bg-black px-28 py-6 ring-red-500/50 ring-offset-black will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2"
              disabled={
                isLoading ||
                createPrompt.isLoading ||
                createMessage.isLoading ||
                fields.length % 2 !== 0
              }
            >
              <span className="absolute inset-px z-10 grid place-items-center rounded-lg bg-black bg-gradient-to-t from-neutral-800 text-neutral-200">
                <span className="flex space-x-1">
                  <span>AIからの応答を生成</span>
                  {(isLoading ||
                    createPrompt.isLoading ||
                    createMessage.isLoading) && (
                    <span className="animate-pulse font-bold">...</span>
                  )}
                </span>
              </span>
              <span
                aria-hidden
                className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-purple-700 before:via-red-500 before:to-amber-400"
              />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PromptForm;
