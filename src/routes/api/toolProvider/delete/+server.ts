import { config } from "$lib/config.server";
import PrismaClientEdge from "$lib/prisma/client";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ platform, request }) => {
  const prisma = PrismaClientEdge(platform, config);

  await prisma.toolProvider.delete({
    where: {
      name: (await request.formData()).get("name")!.toString(),
    },
  });

  throw redirect(302, "/platform/admin/dashboard/activity");
};
