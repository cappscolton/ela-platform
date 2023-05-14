import { OAuth1Signature } from "$lib/oauth/oauth1-signature.js";
import type { PageServerLoad } from "./$types";
import mapUser from "$lib/map-user";
import { PrismaClient } from "@prisma/client/edge";
import { elaSignature } from "$lib/oauth/ela-signature";
import type { ElaData } from "$lib/oauth/ela-signature";

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
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: platform?.env.DATABASE_URL,
      },
    },
  });

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

    console.log("oauth secret", conceptActivityDatas[0].oauth_secret);
    console.log("oauth key", conceptActivityDatas[0].oauth_key);

    for (const activityData of conceptActivityDatas) {
      const elaData = await elaSignature(
        prisma,
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
