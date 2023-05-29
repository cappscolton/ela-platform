import { config } from "$lib/config.server";
import mapUser from "$lib/map-user";
import type { ElaData } from "$lib/oauth/ela-signature";
import { elaSignature } from "$lib/oauth/ela-signature";
import PrismaClientEdge from "$lib/prisma/client";
import type { PageServerLoad } from "./$types";

type OutputType = {
  data: {
    tool: string;
    concept: string;
    name: string;
    ltiUrl: string;
    value: ElaData;
  }[];
};

export const load: PageServerLoad<OutputType> = async ({
  fetch,
  url,
  params,
  request,
  platform,
}) => {
  const base_platform_url =
    platform?.env.BASE_PLATFORM_URL ?? import.meta.env.VITE_BASE_PLATFORM_URL;

  const prisma = PrismaClientEdge(platform, config);

  mapUser(
    prisma,
    params.user_id,
    params.context_id,
    params.roles,
    params.lis_person_name_family,
    params.lis_person_name_given,
    params.lis_person_contact_email_primary
  );

  const activities = await prisma.activity.findMany({
    where: {
      equivalencyId: {
        not: null,
      },
    },
    select: {
      name: true,
      ltiUrl: true,
      equivalency: {
        select: {
          concept: true,
        },
      },
      toolProvider: {
        select: {
          oauthKey: true,
          oauthSecret: true,
          name: true,
        },
      },
    },
  });

  const activitiesGroupedByConcept: {
    concepts: {
      [key: string]: {
        tool: string;
        name: string;
        ltiUrl: string;
        oauth_key: string;
        oauth_secret: string;
      }[];
    };
  } = {
    concepts: {},
  };

  for (const activity of activities) {
    if (activity.equivalency!.concept! in activitiesGroupedByConcept.concepts) {
      activitiesGroupedByConcept.concepts[activity.equivalency!.concept!].push({
        tool: activity.toolProvider!.name!,
        name: activity.name!,
        ltiUrl: activity.ltiUrl!,
        oauth_key: activity.toolProvider!.oauthKey!,
        oauth_secret: activity.toolProvider!.oauthSecret!,
      });
    } else {
      activitiesGroupedByConcept.concepts[activity.equivalency!.concept!] = [
        {
          tool: activity.toolProvider!.name!,
          name: activity.name,
          ltiUrl: activity.ltiUrl!,
          oauth_key: activity.toolProvider!.oauthKey!,
          oauth_secret: activity.toolProvider!.oauthSecret!,
        },
      ];
    }
  }

  const ret: OutputType = { data: [] };

  for (const concept in activitiesGroupedByConcept.concepts) {
    const conceptActivityDatas = activitiesGroupedByConcept.concepts[concept];

    for (const activityData of conceptActivityDatas) {
      const elaData = await elaSignature(
        prisma,
        base_platform_url,
        params.context_id,
        activityData.ltiUrl,
        params.lis_result_sourcedid,
        params.roles,
        params.user_id,
        params.lis_person_contact_email_primary,
        params.lis_outcome_service_url,
        params.lis_person_name_given,
        concept,
        activityData.oauth_secret,
        activityData.oauth_key
      );
      ret.data.push({
        tool: "codio",
        concept: concept,
        name: activityData.name,
        ltiUrl: activityData.ltiUrl,
        value: elaData,
      });
    }
  }

  return ret as OutputType;
};
