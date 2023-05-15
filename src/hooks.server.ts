import { SvelteKitAuth } from "@auth/sveltekit";
import Discord from "@auth/core/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client/edge";
import type { Handle } from "@sveltejs/kit";
import { config } from "$lib/config.server";
import { sequence } from "@sveltejs/kit/hooks";

const handleAuth = (async (...args) => {
  const [{ event }] = args;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (event.platform?.env.DATABASE_URL ??
          config.DATABASE_URL) as string,
      },
    },
  });

  return SvelteKitAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    providers: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Discord({
        clientId: config.DISCORD_CLIENT_ID,
        clientSecret: config.DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      // async session({ session, user }) {
      //   session.user = {
      //     id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     image: user.image,
      //   };
      //   event.locals.session = session;
      //   return session;
      // },
    },
    events: {},
  })(...args);
}) satisfies Handle;

export const handle = sequence(handleAuth);
