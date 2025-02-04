import type { PageServerLoad } from "./$types";
import { PrismaClient } from "@prisma/client/edge";
import { config } from "$lib/config.server";

type OutputType = {
  toolProviderSet: {
    id: string;
    name: string;
  }[];
};

export const load: PageServerLoad<OutputType> = async ({ platform }) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ?? config.DATABASE_URL) as string,
      },
    },
  });
  const toolProviderSet = await prisma.toolProvider.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { toolProviderSet };
};
