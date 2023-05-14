import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client/edge";

export const POST: RequestHandler = async ({ platform, request, params }) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ??
          import.meta.env.VITE_DATABASE_URL) as string,
      },
    },
  });
  await prisma.activity.delete({
    where: {
      name: (await request.formData()).get("name")!.toString(),
    },
  });

  throw redirect(302, "/platform/admin/dashboard/activity");
};
