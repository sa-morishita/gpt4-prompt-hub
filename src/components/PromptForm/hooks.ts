import { useCallback, useState } from "react";
import type { MessageType } from "~/models/prompt";
import logger from "~/utils/logger";

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
        logger.info("hooks messages", messages);

        const apiResponse = await fetch("/api/openai/openai", {
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

          returnText += chunkValue;
          setResponse((prev) => prev + chunkValue);
        }
        logger.info("hooks returnText", returnText);

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
