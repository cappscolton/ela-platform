import type { RequestEvent, RequestHandler } from "./$types";
import { MasteryFormula, computeMastery } from "$lib/mastery";
import { gradePassback } from "$lib/grade-passback";
import { XMLParser } from "fast-xml-parser";
import { PrismaClient } from "@prisma/client/edge";

export const POST: RequestHandler = async ({
  platform,
  request,
  params,
}: RequestEvent) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: (platform?.env.DATABASE_URL ??
          import.meta.env.VITE_DATABASE_URL) as string,
      },
    },
  });
  const lti_req = await request
    .text()
    .then((str: string) => new XMLParser().parse(str));

  console.log(`external tool passed something back`);

  if (
    // codio sometimes sends non-replacResult requests. I'm not sure what the point is. I think they are setting the grade cell to 0, then replacing it right after.
    lti_req.imsx_POXEnvelopeRequest.imsx_POXBody.replaceResultRequest !==
    undefined
  ) {
    console.log(
      `tool consumer caught grade passback, performing mastery calculation`
    );

    console.log("gradecell: " + params.lis_result_sourcedid);
    console.log("service_url:" + params.lis_outcome_service_url);

    const lti_req_type = Object.keys(
      lti_req.imsx_POXEnvelopeRequest.imsx_POXBody
    )[0];

    const lti_grade_cell_target =
      lti_req.imsx_POXEnvelopeRequest.imsx_POXBody.replaceResultRequest
        .resultRecord.sourcedGUID.sourcedId;

    const lti_score =
      lti_req.imsx_POXEnvelopeRequest.imsx_POXBody.replaceResultRequest
        .resultRecord.result.resultScore.textString;

    const studentActivity = await prisma.studentActivity.findFirst({
      where: {
        student: {
          lmsUserId: params.user_id,
        },
        activity: {
          equivalencyId: params.equivalencyId,
        },
      },
    });

    const activity = await prisma.activity.findFirst({
      where: {
        equivalencyId: params.equivalencyId,
      },
      select: {
        id: true,
      },
    });

    if (studentActivity == null) {
      await prisma.studentActivity.create({
        data: {
          student: {
            connect: {
              lmsUserId: params.user_id,
            },
          },
          activity: {
            connect: {
              id: activity?.id,
            },
          },
        },
      });
    }

    await prisma.attempt.create({
      data: {
        correctness: parseFloat(lti_score),
        timestamp: new Date(),
        studentActivityId: studentActivity!.id,
      },
    });

    console.log("computing mastery");

    const toolKeys = await prisma.toolProvider.findFirst({
      where: {
        name: params.toolName,
      },
      select: {
        oauthKey: true,
        oauthSecret: true,
      },
    });

    const mastery = await computeMastery(
      prisma,
      MasteryFormula.ThreeCCR,
      params.equivalencyId,
      params.user_id
    );

    gradePassback(
      params.lis_outcome_service_url,
      params.lis_result_sourcedid,
      mastery,
      toolKeys!.oauthKey,
      toolKeys!.oauthSecret
    );
  }
  return new Response();
};
