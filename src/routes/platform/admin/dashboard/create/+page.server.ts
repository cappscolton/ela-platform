import { config } from "$lib/config.server";
import PrismaClientEdge from "$lib/prisma/client";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

type OutputType = {
  tpForm: any;
  activityForm: any;
  equivalencyForm: any;
  toolProviderSet: {
    id: string;
    name: string;
  }[];
};

const tpSchema = z.object({
  name: z.string().trim().min(1),
  oauthSecret: z.string().trim().min(1),
  oauthKey: z.string().trim().min(1),
});

const activitySchema = z.object({
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
  platform,
  request,
}) => {
  const prisma = PrismaClientEdge(platform, config);

  const tpForm = await superValidate(request, tpSchema);
  const activityForm = await superValidate(request, activitySchema);
  const equivalencyForm = await superValidate(request, equivalencySchema);

  const toolProviderSet = await prisma.toolProvider.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { tpForm, activityForm, equivalencyForm, toolProviderSet };
};

export const actions = {
  tp: async ({ platform, request }) => {
    const form = await superValidate(request, tpSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const prisma = PrismaClientEdge(platform, config);

    await prisma.toolProvider.create({
      data: {
        name: form.data.name,
        oauthKey: form.data.oauthKey,
        oauthSecret: form.data.oauthSecret,
      },
    });
    throw redirect(302, "/platform/admin/dashboard/activity");
  },

  activity: async ({ platform, request }) => {
    const form = await superValidate(request, activitySchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const prisma = PrismaClientEdge(platform, config);

    await prisma.activity.create({
      data: {
        equivalencyId: null,
        ltiUrl: form.data.ltiUrl,
        correctnessThreshold: form.data.correctnessThreshold,
        name: form.data.name,
        toolProviderId: form.data.toolProviderId,
      },
    });
  },

  equivalency: async ({ platform, request }) => {
    const form = await superValidate(request, equivalencySchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const prisma = PrismaClientEdge(platform, config);

    await prisma.equivalency.create({
      data: {
        masteryFormula: form.data.masteryFormula,
        concept: form.data.concept,
      },
    });
  },
};
