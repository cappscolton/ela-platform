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

  await prisma.activity.create({
    data: {
      equivalencyId: null,
      ltiUrl: formData.get("ltiUrl")!.toString(),
      correctnessThreshold: parseFloat(
        formData.get("correctnessThreshold")!.toString()
      ),
      name: formData.get("name")!.toString(),
      toolProviderId: formData.get("toolProviderId")!.toString(),
    },
  });
  throw redirect(302, "/platform/admin/dashboard/activity");
};
