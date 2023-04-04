import Markdown from "../Markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import type { MessageFormType, PromptFormType } from "~/models/prompt";
import { messageFormSchema, promptFormSchema } from "~/models/prompt";
import { api } from "~/utils/api";

type formType = PromptFormType & MessageFormType;
const formSchema = z.intersection(promptFormSchema, messageFormSchema);

const PromptForm: FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [promptId, setPromptId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const { fields, append } = useFieldArray({
    control,
    name: "messages",
  });

  const createPrompt = api.prompt.createPrompt.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      toast.success("登録しました!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: formType) => {
    const { title, description, messages } = data;

    try {
      let createdPromptId = "";
      if (fields.length === 2) {
        const promptData = {
          title,
          description,
        };

        createdPromptId = await createPrompt.mutateAsync(promptData);
        setPromptId(createdPromptId);
      }
      setIsSaved(true);

      const content = await createMessage.mutateAsync({
        messages,
        promptId: promptId || createdPromptId,
      });

      append({
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

  // …………………………………………………
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("こんにちは");
  const [response, setResponse] = useState<string>("");

  const prompt = `Q: ${input} Generate a response with less than 200 characters.`;

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResponse("");
    // setLoading(true);

    const response = await fetch("/api/generate/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return console.log("error");
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      const formattedJsonString = `[${chunkValue.replace(/}{/g, "},{")}]`;

      const object = JSON.parse(formattedJsonString) as { content: string }[];

      object.forEach((ob) => {
        if (ob.content) {
          setResponse((prev) => prev + ob.content);
        }
      });
    }
    console.log(response);
    setLoading(false);
  };

  return (
    <div className="p-8 h-screen overflow-y-scroll w-full">
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

          {fields.map((field, index) => {
            if (index === 0 || index % 2 === 1)
              return (
                <div key={field.id} className="w-full space-y-4">
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
                      disabled={isSaved && index + 1 !== fields.length}
                    />
                  </div>

                  {fields[index]?.content &&
                    errors.messages &&
                    errors.messages[index]?.content && (
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
                    返答
                  </label>
                  <textarea
                    id={`assistant${index}`}
                    cols={10}
                    rows={20}
                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    value={fields[index]?.content}
                    disabled
                  />
                </div>
              </div>
            );
          })}
          {fields.length % 2 === 0 ? (
            <div className="">
              <button
                className="relative overflow-hidden rounded-lg bg-black px-28 py-6 ring-red-500/50 ring-offset-black will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2"
                disabled={createPrompt.isLoading || createMessage.isLoading}
              >
                <span className="absolute inset-px z-10 grid place-items-center rounded-lg bg-black bg-gradient-to-t from-neutral-800 text-neutral-200">
                  AIからの応答を生成
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-purple-700 before:via-red-500 before:to-amber-400"
                />
              </button>
            </div>
          ) : (
            <div className="mx-auto w-full text-center">
              <button
                type="button"
                onClick={addMessage}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                メッセージを追加
              </button>
            </div>
          )}
        </form>
        {(createPrompt.isLoading || createMessage.isLoading) && (
          <div className="mt-6 text-center">
            <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-gray-300 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-x-transparent after:border-y-indigo-500"></span>
          </div>
        )}
        {/* ………………………………………………… */}
        {!loading ? (
          <button
            className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-black/80 mt-9"
            onClick={(e) => generateResponse(e)}
          >
            Generate Response &rarr;
          </button>
        ) : (
          <button
            disabled
            className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
          >
            <div className="animate-pulse font-bold tracking-widest">...</div>
          </button>
        )}
        {response && (
          <div className="mt-8 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
            <Markdown response={response} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptForm;
