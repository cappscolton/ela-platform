import type { PrismaClient } from "@prisma/client/edge";

export default async function mapUser(
  prisma: PrismaClient,
  user_id: string,
  context_id: string,
  roles: string,
  lis_person_name_family: string,
  lis_person_name_given: string,
  lis_person_contact_email_primary: string
) {
  // not sure which unique identifier is better
  // (between email and user_id)
  // user_id should be unique to an LMS,
  // but with the goal of supporting multiple LMSs,
  // I'm not sure if that's the best choice.
  // There's an edge case where 2+ LMS generate the same user_id,
  // but I think that's a better edge case than the one where
  // a student joins the course in 2+ LMS (with the same email)
  // if I really cared that much, there could be a composite unique
  // based on email + user_id. What are the odds a student
  // joins two LMSs with the same email AND gets an identical random user_id from both?
  const user = await prisma.student.findUnique({
    where: {
      lmsUserId: user_id,
    },
  });

  if (user == null) {
    await prisma.student.create({
      data: {
        email: lis_person_contact_email_primary,
        firstName: `${lis_person_name_given}`,
        lastName: `${lis_person_name_family}`,
        lmsUserId: user_id,
      },
    });
  }
}
