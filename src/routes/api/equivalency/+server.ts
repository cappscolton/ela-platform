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

  await prisma.equivalency.create({
    data: {
      masteryFormula: formData.get("masteryFormula")!.toString(),
      concept: formData.get("concept")!.toString(),
    },
  });
  throw redirect(302, "/platform/admin/dashboard/activity");
};
