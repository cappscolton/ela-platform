import { PrismaClient } from "@prisma/client/edge";

export default function PrismaClientEdge(platform: any, config: any) {
  return new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ?? config.DATABASE_URL) as string,
      },
    },
  });
}
