import { config } from "$lib/config.server";
import PrismaClientEdge from "$lib/prisma/client";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  platform,
  request,
}: RequestEvent) => {
  const prisma = PrismaClientEdge(platform, config);

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
