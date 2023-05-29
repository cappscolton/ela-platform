import { config } from "$lib/config.server";
import PrismaAdapter from "$lib/prisma/adapter";
import PrismaClientEdge from "$lib/prisma/client";
import Discord from "@auth/core/providers/discord";
import { SvelteKitAuth } from "@auth/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const handleAuth = (async (...args) => {
  const [{ event }] = args;

  const prisma = PrismaClientEdge(event.platform, config);

  return SvelteKitAuth({
    trustHost: true,
    adapter: {
      ...PrismaAdapter(prisma),
      linkAccount: ({ expires_in, ...data }) => prisma.account.create({ data }),
    },
    providers: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Discord({
        clientId: config.DISCORD_CLIENT_ID,
        clientSecret: config.DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          instructor: user.instructor,
        };
        event.locals.session = session;
        return session;
      },
    },
    events: {
      async createUser(message) {
        const instructor = await prisma.instructor.create({
          data: {
            name: message.user.name!,
            userId: message.user.id,
          },
        });

        message.user.instructor = instructor;
      },
    },
  })(...args);
}) satisfies Handle;

const protectedHandle = (async ({ event, resolve }) => {
  await event.locals.getSession();
  if (
    (!event.locals.session || !event.locals.session.user.instructor) &&
    event.route.id?.includes("admin")
  ) {
    throw redirect(302, "/login");
  }
  return resolve(event);
}) satisfies Handle;

export const handle = sequence(handleAuth, protectedHandle);
