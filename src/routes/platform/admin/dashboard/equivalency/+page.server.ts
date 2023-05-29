import { config } from "$lib/config.server";
import PrismaClientEdge from "$lib/prisma/client";
import type { PageServerLoad } from "./$types";

type OutputType = {
  activeEquivalencies: {
    activities: { id: string; name: string; equivalencyId: string }[];
    id: string;
    concept: string;
  }[];
  unassignedActivities: { id: string; name: string; equivalencyId: string }[];
  equivalencySet: { id: string; concept: string }[];
};

export const load: PageServerLoad<OutputType> = async ({ platform }) => {
  const prisma = PrismaClientEdge(platform, config);

  const equivalencySet =
    (await prisma.equivalency.findMany({
      select: {
        id: true,
        concept: true,
      },
    })) || [];

  const activeEquivalencies = await prisma.equivalency.findMany({
    where: {
      NOT: {
        activities: {
          none: {},
        },
      },
    },
    select: {
      id: true,
      concept: true,
      activities: {
        select: {
          id: true,
          name: true,
          equivalencyId: true,
        },
      },
    },
  });
  const unassignedActivities = await prisma.activity.findMany({
    where: {
      equivalencyId: null,
    },
  });

  return {
    activeEquivalencies,
    unassignedActivities,
    equivalencySet,
  } as OutputType;
};
