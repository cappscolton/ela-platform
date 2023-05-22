import { redirect } from "@sveltejs/kit";
import type { RequestHandler, RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client/edge";
import { config } from "$lib/config.server";

export const POST: RequestHandler = async ({
  platform,
  request,
}: RequestEvent) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ?? config.DATABASE_URL) as string,
      },
    },
  });
  var formData = await request.formData();

  await prisma.toolProvider.create({
    data: {
      name: formData.get("name")!.toString(),
      oauthKey: formData.get("oauthKey")!.toString(),
      oauthSecret: formData.get("oauthSecret")!.toString(),
    },
  });
  throw redirect(302, "/platform/admin/dashboard/activity");
};
