// lib/server/lucia.ts
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client/edge";
import { dev } from "$app/environment";

export const auth = lucia({
  adapter: prisma(
    new PrismaClient({
      datasources: {
        db: {
          url: import.meta.env.VITE_DATABASE_URL as string,
        },
      },
    })
  ),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
});

export type Auth = typeof auth;
