import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { promptFormSchema } from "~/models/prompt";
import type { PromptFormType } from "~/models/prompt";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const PromptForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<PromptFormType>({
    resolver: zodResolver(promptFormSchema),
  });

  const promptRoute = api.useContext().prompt;

  const createPrompt = api.prompt.createPrompt.useMutation({
    onSuccess: () => {
      toast.success("post created successfully!");
    },
  });

  const onSubmit = async (data: PromptFormType) => {
    const promptId = await createPrompt.mutateAsync(data);
    console.log(promptId);
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
        {/* {createPost.isLoading && (
            <div className="absolute flex h-full w-full items-center justify-center">
      <div>
        <span className="grid grid-cols-3 grid-rows-3 gap-px">
          <span className="animate-fade mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-300 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-700 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>

          <span className="animate-fade animation-delay-100 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-500 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-300 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-700 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-500 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          <span className="animate-fade animation-delay-200 mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
        </span>
      </div>
            </div>
          )} */}
        <div className="w-full">
          <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
              htmlFor="title"
              className="block text-xs font-medium text-gray-900"
            >
              タイトル
            </label>
            <input
              type="text"
              id="title"
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              {...register("title")}
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
              className="block text-xs font-medium text-gray-900"
            >
              概要
            </label>
            <input
              type="text"
              {...register("description")}
              id="description"
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.description?.message}
          </p>
        </div>
        {/* <div className="w-full">
          <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
              htmlFor="setting"
              className="block text-xs font-medium text-gray-900"
            >
              AIの設定
            </label>
            <textarea
              {...register("setting")}
              id="setting"
              cols={10}
              rows={4}
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="設定はコンテキストや動作を提供するために使用されます。システムメッセージで、AIの役割や回答すべきトピック、行動の制約などを指定できます。このメッセージは、会話の初期設定を行う際に特に役立ちます。"
            />
          </div>
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.text?.message}
          </p>
        </div>

        <div className="w-full">
          <div className="relative rounded-md rounded-b-none bg-white px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
              htmlFor="message"
              className="block text-xs font-medium text-gray-900"
            >
              メッセージ
            </label>
            <textarea
              {...register("message")}
              id="message"
              cols={10}
              rows={4}
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.text?.message}
          </p>
        </div> */}

        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            AIからの応答を生成
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;
