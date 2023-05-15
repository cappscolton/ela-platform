/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from "zod";
// eslint-disable-next-line no-restricted-imports
import * as environment from "$env/static/private";

export const testConfig = {
  DATABASE_URL: "",
  DISCORD_CLIENT_ID: "",
  DISCORD_CLIENT_SECRET: "",
  AUTH_SECRET: "",
};

// export const ServerConfigSchema = z.object({
//   DATABASE_URL: z.string().trim().min(1).url(),
//   DISCORD_CLIENT_ID: z.string().trim().min(1),
//   DISCORD_CLIENT_SECRET: z.string().trim().min(1),
//   AUTH_SECRET: z.string().trim().min(1),
// });

// export type ServerConfigSchema = z.infer<typeof ServerConfigSchema>;

export const config = testConfig;
