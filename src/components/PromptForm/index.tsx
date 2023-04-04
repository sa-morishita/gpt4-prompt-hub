import Markdown from "../Markdown";
import { useOpenAIApi } from "./hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
  const [response2, setResponse2] = useState<string>("");

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

  const onSubmit = async (formData: formType) => {
    const { title, description, messages } = formData;
    // const messages = [
    //   { role: "system", content: "返事してください" },
    //   { role: "user", content: "こんにちは" },
    // ];

    const apiResponse = await fetch("/api/openai/edgestream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    console.log(apiResponse);

    const data = apiResponse.body;
    if (!data) {
      throw new Error("データの取得に失敗しました。");
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      console.log(376, chunkValue);

      const formattedJsonString = `[${chunkValue.replace(/}{/g, "},{")}]`;

      // const object = JSON.parse(formattedJsonString) as {
      //   content: string;
      // }[];

      // object.forEach((ob) => {
      //   if (ob.content) {
      //     returnText = returnText + ob.content;
      //     console.log(returnText);
      //   }
      // });
    }
  };

  // const onSubmit = async (data: formType) => {
  //   const { title, description, messages } = data;

  //   try {
  //     // let createdPromptId = "";
  //     // if (fields.length === 2) {
  //     //   const promptData = {
  //     //     title,
  //     //     description,
  //     //   };

  //     //   createdPromptId = await createPrompt.mutateAsync(promptData);
  //     //   setPromptId(createdPromptId);
  //     // }
  //     setIsSaved(true);

  //     const fixedMessages = messages.map((message) => {
  //       const { role, content, messageIndex } = message;

  //       const systemPrompt = `${content}（一番最後に返答内容の真偽の自信度を（自信度:パーセント）で追加してください。）（返答は必ずマークダウン形式にしてください。）`;

  //       return { role, content: messageIndex === 0 ? systemPrompt : content };
  //     });

  //     // fieldsにapiからのresponseを表示する欄を作る
  //     append({
  //       role: "assistant",
  //       content: "",
  //       exampleIndex: 0,
  //       messageIndex: fields.length,
  //     });

  //     const apiResponse = await fetch("/api/openai/edgestream", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         messages,
  //       }),
  //     });

  //     if (!apiResponse.ok) {
  //       throw new Error(apiResponse.statusText);
  //     }

  //     const data = apiResponse.body;
  //     if (!data) {
  //       throw new Error("データの取得に失敗しました。");
  //     }
  //     console.log(48109, apiResponse);

  //     const reader = data.getReader();
  //     const decoder = new TextDecoder();
  //     let done = false;
  //     let returnText = "";

  //     while (!done) {
  //       const { value, done: doneReading } = await reader.read();
  //       done = doneReading;
  //       const chunkValue = decoder.decode(value);

  //       const formattedJsonString = `[${chunkValue.replace(/}{/g, "},{")}]`;

  //       const object = JSON.parse(formattedJsonString) as {
  //         content: string;
  //       }[];

  //       object.forEach((ob) => {
  //         if (ob.content) {
  //           console.log(67129, ob.content);
  //           returnText = returnText + ob.content;
  //           setResponse2((prev) => prev + ob.content);
  //         }
  //       });
  //     }

  //     const content = await fetchResponse(fixedMessages);

  //     console.log(93, content);

  //     // if (!content) throw new Error("返答がありませんでした。");

  //     messages.push({
  //       role: "assistant",
  //       content: content || "",
  //       exampleIndex: 0,
  //       messageIndex: messages.length,
  //     });

  //     // 初回（messages.length < 4）は全て保存、2回目以降は最後の2つだけ保存
  //     const createMessages = messages.filter((message, index) => {
  //       if (messages.length < 4) {
  //         return message;
  //       } else if (
  //         index === messages.length - 2 ||
  //         index === messages.length - 1
  //       ) {
  //         return message;
  //       }
  //     });

  //     // await createMessage.mutateAsync({
  //     //   messages: createMessages,
  //     //   promptId: promptId || createdPromptId,
  //     // });

  //     setResponse("");

  //     // apiからのresponseのstreamが終わったらfieldsを更新
  //     update(fields.length, {
  //       role: "assistant",
  //       content: content || "",
  //       exampleIndex: 0,
  //       messageIndex: fields.length,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  console.log(181, response2);

  const addMessage = () => {
    append({
      role: "user",
      content: "",
      exampleIndex: 0,
      messageIndex: fields.length,
    });
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
                    返答
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
          {fields.length % 2 === 0 ? (
            <div className="">
              <button
                className="relative overflow-hidden rounded-lg bg-black px-28 py-6 ring-red-500/50 ring-offset-black will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2"
                disabled={
                  isLoading || createPrompt.isLoading || createMessage.isLoading
                }
              >
                <span className="absolute inset-px z-10 grid place-items-center rounded-lg bg-black bg-gradient-to-t from-neutral-800 text-neutral-200">
                  <span className="flex space-x-1">
                    <span>AIからの応答を生成</span>
                    {isLoading && (
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
          ) : (
            <div className="mx-auto w-full text-center">
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
        </form>
      </div>
      <div>
        <button
          type="button"
          className="bg-green-500 p-3 m-3"
          onClick={async () => {
            console.log("start");
            const text1 = "explore";

            const response = await axios.post("/api/openai/getWordInfo", {
              prompt: text1,
            });

            console.log(response);
          }}
        >
          wordwiseapi
        </button>
      </div>
      <div>
        <button
          type="button"
          className="bg-purple-500 p-3 m-3"
          onClick={async () => {
            console.log("start");
            const response = await fetch("/api/openai/test", {
              method: "POST",
              body: JSON.stringify({ searched: "こんにちは" }),
              headers: {
                "content-type": "application/json",
              },
            });
            console.log(313, response);
            let searchResponse = "";
            let endStream = false;
            let loading = true;

            if (response.ok) {
              try {
                const data = response.body;
                if (!data) {
                  return;
                }
                const reader = data.getReader();
                const decoder = new TextDecoder();
                while (true) {
                  const { value, done } = await reader.read();
                  const chunkValue = decoder.decode(value);
                  console.log("searchResponse", searchResponse);
                  searchResponse += chunkValue;
                  if (done) {
                    endStream = true;
                    break;
                  }
                }
              } catch (err) {
                console.log("error1");
              }
            } else {
              console.log("error2");
            }
            loading = false;
          }}
        >
          getrecommendation
        </button>
      </div>
      <div>
        <button
          type="button"
          className="bg-orange-500 p-3 m-3"
          onClick={async () => {
            console.log("start");
            const apiResponse = await fetch("/api/openai/nodegenerate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log(apiResponse);

            const data = apiResponse.body;
            if (!data) {
              throw new Error("データの取得に失敗しました。");
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              const chunkValue = decoder.decode(value);

              console.log(376, chunkValue);

              const formattedJsonString = `[${chunkValue.replace(
                /}{/g,
                "},{"
              )}]`;

              // const object = JSON.parse(formattedJsonString) as {
              //   content: string;
              // }[];

              // object.forEach((ob) => {
              //   if (ob.content) {
              //     returnText = returnText + ob.content;
              //     console.log(returnText);
              //   }
              // });
            }
          }}
        >
          wordwiseapi
        </button>
      </div>

      <div>
        <button
          type="button"
          className="bg-blue-500 p-3 m-3"
          onClick={async () => {
            console.log("start");

            const messages = [
              { role: "system", content: "返事してください" },
              { role: "user", content: "こんにちは" },
            ];

            const apiResponse = await fetch("/api/openai/edgestream", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages,
              }),
            });

            console.log(apiResponse);

            const data = apiResponse.body;
            if (!data) {
              throw new Error("データの取得に失敗しました。");
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              const chunkValue = decoder.decode(value);

              console.log(376, chunkValue);

              const formattedJsonString = `[${chunkValue.replace(
                /}{/g,
                "},{"
              )}]`;

              // const object = JSON.parse(formattedJsonString) as {
              //   content: string;
              // }[];

              // object.forEach((ob) => {
              //   if (ob.content) {
              //     returnText = returnText + ob.content;
              //     console.log(returnText);
              //   }
              // });
            }
          }}
        >
          wordwiseapi
        </button>
      </div>
      <div>
        <button
          type="button"
          className="bg-blue-500 p-3 m-3"
          onClick={async () => {
            console.log("start");

            const messages = [
              { role: "system", content: "返事してください" },
              { role: "user", content: "こんにちは" },
            ];

            const apiResponse = await fetch("/api/openai/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages,
              }),
            });
            console.log(apiResponse);

            if (!apiResponse.ok) {
              throw new Error(apiResponse.statusText);
            }

            const data = apiResponse.body;
            if (!data) {
              throw new Error("データの取得に失敗しました。");
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let returnText = "";

            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              const chunkValue = decoder.decode(value);

              const formattedJsonString = `[${chunkValue.replace(
                /}{/g,
                "},{"
              )}]`;

              const object = JSON.parse(formattedJsonString) as {
                content: string;
              }[];

              object.forEach((ob) => {
                if (ob.content) {
                  console.log(ob.content);
                  returnText = returnText + ob.content;
                  setResponse((prev) => prev + ob.content);
                }
              });
            }
          }}
        >
          wordwiseapi
        </button>
      </div>
    </div>
  );
};

export default PromptForm;
