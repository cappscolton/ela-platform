import type { RequestHandler } from "./$types";
import PrismaClientEdge from "$lib/prisma/client";
import { redirect } from "@sveltejs/kit";
import { config } from "$lib/config.server";

export const POST: RequestHandler = async ({ platform, request, params }) => {
  const prisma = PrismaClientEdge(platform, config);

  const formData = Array.from((await request.formData()).entries());

  if (params.action == "assign") {
    formData.forEach(async ([key, value]) => {
      if (value != "no") {
        await prisma.activity.update({
          where: {
            id: key,
          },
          data: {
            equivalencyId: value.toString(),
          },
        });
      }
    });
  } else {
    const activityIds = formData.map(([key]) => key);
    await prisma.activity.updateMany({
      where: {
        id: {
          in: activityIds,
        },
      },
      data: {
        equivalencyId: null,
      },
    });
  }
  throw redirect(302, "/platform/admin/dashboard/equivalency");
};
