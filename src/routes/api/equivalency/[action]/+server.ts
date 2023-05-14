import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client/edge";
import { redirect } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ platform, request, params }) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ??
          import.meta.env.VITE_DATABASE_URL) as string,
      },
    },
  });
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
