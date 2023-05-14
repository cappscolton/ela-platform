import { redirect } from "@sveltejs/kit";
import type { RequestHandler, RequestEvent } from "./$types";
import { PrismaClient } from "@prisma/client/edge";

export const POST: RequestHandler = async ({
  platform,
  request,
}: RequestEvent) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ??
          import.meta.env.VITE_DATABASE_URL) as string,
      },
    },
  });
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
