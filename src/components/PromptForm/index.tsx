import { useState, type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { messageFormSchema, promptFormSchema } from "~/models/prompt";
import type {
  MessageFormType,
  MessageType,
  PromptFormType,
} from "~/models/prompt";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { z } from "zod";

type formType = PromptFormType & MessageFormType;
const formSchema = z.intersection(promptFormSchema, messageFormSchema);

const PromptForm: FC = () => {
  const [displayMessages, setDisplayMessages] = useState<MessageType[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messages: [
        { role: "system", content: "", exampleIndex: 0, messageIndex: 0 },
        { role: "user", content: "", exampleIndex: 0, messageIndex: 1 },
      ],
    },
  });

  interface testtype {
    user: number;
  }

  const { fields, append } = useFieldArray({
    control,
    name: "messages",
  });

  const createPrompt = api.prompt.createPrompt.useMutation({
    onSuccess: () => {
      toast.success("post created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      toast.success("example created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: formType) => {
    const { title, description, messages } = data;

    try {
      const promptData = {
        title,
        description,
      };

      const promptId = await createPrompt.mutateAsync(promptData);
      console.log(promptId);

      setIsSaved(true);

      const content = await createMessage.mutateAsync({
        messages,
        promptId,
      });

      setDisplayMessages([
        ...messages,
        {
          role: "assistant",
          content,
          exampleIndex: 0,
          messageIndex: messages.length,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
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
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
            <input
              type="text"
              {...register("description")}
              id="description"
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              disabled={isSaved}
            />
          </div>
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.description?.message}
          </p>
        </div>

        {fields.map((field, index) => (
          <div className="w-full space-y-4" key={field.id}>
            <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor={`user${index}`}
                className="block text-xs font-medium text-gray-600"
              >
                {index === 0 ? "AIの設定" : "メッセージ"}
              </label>
              <textarea
                {...register(`messages.${index}.content`)}
                id={`user${index}`}
                cols={10}
                rows={4}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder={
                  index === 0
                    ? "設定はコンテキストや動作を提供するために使用されます。システムメッセージで、AIの役割や回答すべきトピック、行動の制約などを指定できます。このメッセージは、会話の初期設定を行う際に特に役立ちます。"
                    : ""
                }
                disabled={isSaved && index < displayMessages.length / 2}
              />
            </div>
            {displayMessages.length > 2 && index !== 0 && (
              <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                  htmlFor={`assistant${index}`}
                  className="block text-xs font-medium text-gray-600"
                >
                  返答
                </label>
                <textarea
                  id={`assistant${index}`}
                  cols={10}
                  rows={20}
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={displayMessages[index * 2]?.content}
                  disabled
                />
              </div>
            )}
            {errors.messages && errors.messages[index]?.content && (
              <p className="w-full pb-2 text-left text-sm text-red-500">
                {errors.messages[index]?.content?.message}
              </p>
            )}
          </div>
        ))}

        <div className="mx-auto w-full space-y-3 text-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            AIからの応答を生成
          </button>
          <p className="text-sm text-gray-600">
            ※2023/4/1時点では20秒以上かかる時があります
          </p>
        </div>
      </form>
      {(createPrompt.isLoading || createMessage.isLoading) && (
        <div className="mt-6 text-center">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-gray-300 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-x-transparent after:border-y-indigo-500"></span>
        </div>
      )}
    </div>
  );
};

export default PromptForm;
