import { config } from "$lib/config.server";
import PrismaClientEdge from "$lib/prisma/client";
import type { PageServerLoad } from "./$types";

type OutputType = {
  toolProviderSet: {
    id: string;
    name: string;
  }[];
};

export const load: PageServerLoad<OutputType> = async ({ platform }) => {
  const prisma = PrismaClientEdge(platform, config);

  const toolProviderSet = await prisma.toolProvider.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { toolProviderSet };
};
