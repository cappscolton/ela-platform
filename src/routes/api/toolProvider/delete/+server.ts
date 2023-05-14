import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client/edge";

export const POST: RequestHandler = async ({ platform, request }) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: platform?.env.DATABASE_URL,
      },
    },
  });
  await prisma.toolProvider.delete({
    where: {
      name: (await request.formData()).get("name")!.toString(),
    },
  });

  throw redirect(302, "/platform/admin/dashboard/activity");
};
