import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      LIVEBLOCKS_SECRET_KEY: z.string().startsWith("sk_").optional(),
    },
    runtimeEnv: {
      LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
    },
  });
