import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient, User, Instructor } from "@prisma/client";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
} from "next-auth/adapters";

type OGAdapter = Omit<
  Adapter,
  "getUser" | "getUserByEmail" | "getUserByAccount" | "getSessionAndUser"
>;

export interface CustomAdapter extends OGAdapter {
  getUser(
    id: string
  ): Promise<(User & { instructor: Instructor | null }) | null>;
  getUserByEmail(
    email: string
  ): Promise<(User & { instructor: Instructor | null }) | null>;
  getUserByAccount(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Promise<(User & { instructor: Instructor | null }) | null>;
  getSessionAndUser(sessionToken: string): Promise<{
    session: AdapterSession;
    user: User & { instructor: Instructor | null };
  } | null>;
}

export default function CustomPrismaAdapter(
  client: PrismaClient
): CustomAdapter {
  return {
    ...PrismaAdapter(client),
    async getUser(id: string) {
      return client.user.findUnique({
        where: { id },
        include: { instructor: true },
      });
    },
    async getUserByEmail(email: string) {
      return client.user.findUnique({
        where: { email },
        include: { instructor: true },
      });
    },
    async getUserByAccount(
      providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      const account = await client.account.findUnique({
        where: { provider_providerAccountId: providerAccountId },
        select: {
          user: {
            include: {
              instructor: true,
            },
          },
        },
      });
      return account?.user ?? null;
    },
    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await client.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            include: {
              instructor: true,
            },
          },
        },
      });

      if (!userAndSession) return null;

      const { user, ...session } = userAndSession;
      return { user, session };
    },
  };
}
