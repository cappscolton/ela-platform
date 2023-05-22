import type { PageServerLoad } from "./$types";
import { PrismaClient } from "@prisma/client/edge";
import { config } from "$lib/config.server";

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
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: platform?.env.DATABASE_URL ?? (config.DATABASE_URL as string),
      },
    },
  });
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
