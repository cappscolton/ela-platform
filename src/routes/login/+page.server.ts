import type { PageServerLoad } from "./$types";
import type { Session } from "@prisma/client";
type OutputType = Session;

export const load: PageServerLoad<OutputType> = async ({
  parent,
  platform,
  locals,
}) => {
  const { session } = await parent();
  return session;
};
