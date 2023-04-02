import pino from "pino";
import type { DestinationStream } from "pino";
import { logflarePinoVercel } from "pino-logflare";
import { env } from "~/env.mjs";

const logflareConfig = logflarePinoVercel({
  apiKey: env.NEXT_PUBLIC_LOGFLARE_API_KEY,
  sourceToken: env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID,
});

const stream = logflareConfig.stream as DestinationStream;
const send = logflareConfig.send;

const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send,
      },
    },
    level: "debug",
    base: {
      env: process.env.NODE_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream
);

export default logger;
