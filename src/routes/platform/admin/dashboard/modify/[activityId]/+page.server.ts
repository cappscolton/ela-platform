import type { PageServerLoad } from "./$types";
import { config } from "$lib/config.server";
import type { Activity } from "@prisma/client/edge";
import PrismaClientEdge from "$lib/prisma/client";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import type { Validation } from "sveltekit-superforms/index";
import { fail } from "@sveltejs/kit";

type OutputType = { activityForm: any; toolProviderSet: any };

const tpSchema = z.object({
  name: z.string().trim().min(1),
  oauthSecret: z.string().trim().min(1),
  oauthKey: z.string().trim().min(1),
});

const activitySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  correctnessThreshold: z.number().min(0).max(100),
  ltiUrl: z.string().trim().min(1),
  toolProviderId: z.string().min(1),
});

const equivalencySchema = z.object({
  masteryFormula: z.string().trim().min(1),
  concept: z.string().trim().min(1),
});

export const load: PageServerLoad<OutputType> = async ({
  request,
  params,
  platform,
}) => {
  const prisma = PrismaClientEdge(platform, config);

  const toolProviderSet = await prisma.toolProvider.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const activity = await prisma.activity.findUnique({
    where: {
      id: params.activityId,
    },
  });

  const activityForm = await superValidate(activity, activitySchema);

  console.log(activityForm.data.id);
  return {
    activityForm,
    toolProviderSet,
  };
};

export const actions = {
  activity: async ({ platform, request }) => {
    console.log("activity");
    const form = await superValidate(request, activitySchema);
    if (!form.valid) {
      console.log(form.errors);
      console.log("fail");
      return fail(400, { form });
    }

    const prisma = PrismaClientEdge(platform, config);

    await prisma.activity.update({
      where: {
        id: form.data.id,
      },
      data: {
        name: form.data.name,
        correctnessThreshold: form.data.correctnessThreshold,
        ltiUrl: form.data.ltiUrl,
        toolProvider: {
          connect: {
            id: form.data.toolProviderId,
          },
        },
      },
    });
  },

  deleteActivity: async ({ platform, request }) => {
    const form = await superValidate(request, activitySchema);
    if (!form.valid) {
      console.log("fail");
      return fail(400, { form });
    }

    const prisma = PrismaClientEdge(platform, config);

    await prisma.activity.delete({
      where: {
        id: form.data.id,
      },
    });
  },
};
