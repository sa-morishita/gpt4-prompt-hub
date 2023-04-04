import { useCallback, useState } from "react";
import type { MessageType } from "~/models/prompt";

interface UseOpenAIApiResult {
  isLoading: boolean;
  response: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>;
  error: Error | null;
  fetchResponse: (
    messages: Omit<MessageType, "exampleIndex" | "messageIndex">[]
  ) => Promise<string | void>;
}

export const useOpenAIApi = (): UseOpenAIApiResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const fetchResponse = useCallback(
    async (
      messages: Omit<MessageType, "exampleIndex" | "messageIndex">[]
    ): Promise<string | void> => {
      setIsLoading(true);
      setError(null);

      try {
        const apiResponse = await fetch("/api/openai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
          }),
        });

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

          const formattedJsonString = `[${chunkValue.replace(/}{/g, "},{")}]`;

          const object = JSON.parse(formattedJsonString) as {
            content: string;
          }[];

          object.forEach((ob) => {
            if (ob.content) {
              returnText = returnText + ob.content;
              setResponse((prev) => prev + ob.content);
            }
          });
        }

        return returnText;
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, response, setResponse, error, fetchResponse };
};