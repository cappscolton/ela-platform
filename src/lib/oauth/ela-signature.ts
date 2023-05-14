import { OAuth1Signature } from "$lib/oauth/oauth1-signature";
import type { PrismaClient } from "@prisma/client/edge";
import * as dotenv from "dotenv";

export type ElaData = {
  lti: {
    context_id: string;
    launch_presentation_locale: string;
    launch_presentation_return_url: string;
    lis_outcome_service_url: string;
    lis_person_contact_email_primary: string;
    lis_person_name_family: string;
    lis_person_name_given: string;
    lis_person_sourcedid: string;
    lis_result_sourcedid: string;
    lti_message_type: string;
    lti_version: string;
    oauth_callback: string;
    resource_link_id: string;
    resource_link_title: string;
    roles: string;
    launch_presentation_document_target: string;
    user_id: string;
    // lis_person_name_full: string;
    // context_label: signedParams.context_label,
    // context_title: signedParams.context_title,
    // custom_canvas_api_domain: signedParams.custom_canvas_api_domain,
    // custom_canvas_assignment_id: signedParams.custom_canvas_assignment_id,
    // custom_canvas_assignment_points_possible:
    //   signedParams.custom_canvas_assignment_points_possible,
    // custom_canvas_assignment_title:
    //   signedParams.custom_canvas_assignment_title,
    // custom_canvas_course_id: signedParams.custom_canvas_course_id,
    // custom_canvas_enrollment_state:
    //   signedParams.custom_canvas_enrollment_state,
    // custom_canvas_module_id: signedParams.custom_canvas_module_id,
    // custom_canvas_module_item_id: signedParams.custom_canvas_module_item_id,
    // custom_canvas_user_id: signedParams.custom_canvas_user_id,
    // custom_canvas_user_login_id: signedParams.custom_canvas_user_login_id,
    // custom_canvas_workflow_state: signedParams.custom_canvas_workflow_state,
    // ext_ims_lis_basic_outcome_url: string;
    // ext_lti_assignment_id: string;
    // ext_outcome_data_values_accepted: string;
    // ext_outcome_result_total_score_accepted: string;
    // ext_outcome_submission_needs_additional_review_accepted: string;
    // ext_outcome_submission_prioritize_non_tool_grade_accepted: string;
    // ext_outcome_submission_submitted_at_accepted: string;
    // ext_outcomes_tool_placement_url: string;
    // ext_roles: string;
    // tool_consumer_info_product_family_code: string;
    // tool_consumer_info_version: string;
    // tool_consumer_instance_contact_email: string;
    // tool_consumer_instance_guid: string;
    // tool_consumer_instance_name: string;
    // user_image: string;
  };
  oauth: {
    oauth_signature_method: string;
    oauth_consumer_key: string;
    oauth_nonce: string;
    oauth_timestamp: string;
    oauth_version: string;
    oauth_signature: string;
  };
};

export async function elaSignature(
  prisma: PrismaClient,
  context_id: string,
  ltiUrl: string,
  lis_result_sourcedid: string,
  roles: string,
  user_id: string,
  lis_person_contact_email_primary: string,
  lis_outcome_service_url: string,
  lis_person_name_given: string,
  concept: string,
  oauth_secret: string,
  oauth_key: string
): Promise<ElaData> {
  const base_platform_url = process.env.BASE_PLATFORM_URL;

  // TODO: this really doesn't belong in this function. replace concept with equivalencyId and get it from the DB elsewhere
  const equivalency = await prisma.equivalency.findFirst({
    where: {
      concept: concept,
    },
  });

  const tool = await prisma.toolProvider.findFirst({
    where: {
      oauthSecret: oauth_secret,
      oauthKey: oauth_key,
    },
  });

  const custom_params = {
    // prettier-ignore
    context_id: context_id,
    launch_presentation_locale: "en",
    launch_presentation_return_url: `https://${base_platform_url}`,
    lis_outcome_service_url: `https://${base_platform_url}/api/tc/lti/gradePassback/${encodeURIComponent(
      tool!.name
    )}/${equivalency!.id}/${user_id}/${encodeURIComponent(
      lis_outcome_service_url
    )}/${lis_result_sourcedid}`,
    lis_person_contact_email_primary: `${encodeURIComponent(
      lis_person_contact_email_primary
    )}`,
    lis_person_name_family: `${encodeURIComponent(lis_person_name_given)}`,
    lis_person_name_given: `${encodeURIComponent(lis_person_name_given)}`,
    lis_person_sourcedid: "854562293", // TODO: don't think this is useful
    lis_result_sourcedid: lis_result_sourcedid,
    lti_message_type: "basic-lti-launch-request",
    lti_version: "LTI-1p0",
    oauth_callback: "about:blank",
    resource_link_id: "fe39be2074c8c890f9554c495bfaed5d456b78a5",
    resource_link_title: "ela platform",
    roles: roles,
    launch_presentation_document_target: "iframe",
    user_id: user_id,
    // lis_person_name_full: "Colton+Capps",
    // ext_ims_lis_basic_outcome_url:
    //   `https://${base_platform_url}/api/lti/v1/tools/17275/ext_grade_passback`,
    // ext_lti_assignment_id: "5b2bb834-d2a5-4560-ac5e-8da00310072c",
    // ext_outcome_data_values_accepted: "url,text",
    // ext_outcome_result_total_score_accepted: "true",
    // ext_outcome_submission_needs_additional_review_accepted: "true",
    // ext_outcome_submission_prioritize_non_tool_grade_accepted: "true",
    // ext_outcome_submission_submitted_at_accepted: "true",
    // ext_outcomes_tool_placement_url:
    //   `https://${base_platform_url}/api/lti/v1/turnitin/outcomes_placement/17275`,
    // ext_roles:
    //   "urn:lti:instrole:ims/lis/Instructor,urn:lti:instrole:ims/lis/Student,urn:lti:role:ims/lis/Instructor,urn:lti:sysrole:ims/lis/User",
    // tool_consumer_info_product_family_code: "canvas",
    // tool_consumer_info_version: "cloud",
    // tool_consumer_instance_contact_email: "notifications@instructure.com",
    // tool_consumer_instance_guid:
    //   "7db438071375c02373713c12c73869ff2f470b68.k-state.instructure.com",
    // tool_consumer_instance_name: "Kansas+State+University",
    // user_image: "https://canvas.instructure.com/images/messages/avatar-50.png",
    // context_label: "Scantron",
    // context_title: "Scantron+Test",
    // custom_canvas_api_domain: "k-state.test.instructure.com",
    // custom_canvas_assignment_id: "1733736",
    // custom_canvas_assignment_points_possible: "0",
    // custom_canvas_assignment_title: "cjcapps",
    // custom_canvas_course_id: "1146",
    // custom_canvas_enrollment_state: "active",
    // custom_canvas_module_id: "",
    // custom_canvas_module_item_id: "4114122",
    // custom_canvas_user_id: "133612",
    // custom_canvas_user_login_id: "cjcapps",
    // custom_canvas_workflow_state: "available",
  };

  const signedParams = OAuth1Signature({
    oauth_consumer_key: oauth_key,
    oauth_shared_secret: oauth_secret,
    method: "POST",
    query_params: {
      ...custom_params,
    },
    url: `${ltiUrl}`,
  });

  return {
    lti: custom_params,
    // lis_person_name_full: signedParams.lis_person_name_full,
    // context_label: signedParams.context_label,
    // context_title: signedParams.context_title,
    // custom_canvas_api_domain: signedParams.custom_canvas_api_domain,
    // custom_canvas_assignment_id: signedParams.custom_canvas_assignment_id,
    // custom_canvas_assignment_points_possible:
    //   signedParams.custom_canvas_assignment_points_possible,
    // custom_canvas_assignment_title:
    //   signedParams.custom_canvas_assignment_title,
    // custom_canvas_course_id: signedParams.custom_canvas_course_id,
    // custom_canvas_enrollment_state:
    //   signedParams.custom_canvas_enrollment_state,
    // custom_canvas_module_id: signedParams.custom_canvas_module_id,
    // custom_canvas_module_item_id: signedParams.custom_canvas_module_item_id,
    // custom_canvas_user_id: signedParams.custom_canvas_user_id,
    // custom_canvas_user_login_id: signedParams.custom_canvas_user_login_id,
    // custom_canvas_workflow_state: signedParams.custom_canvas_workflow_state,
    // ext_ims_lis_basic_outcome_url:
    //   signedParams.ext_ims_lis_basic_outcome_url,
    // ext_lti_assignment_id: signedParams.ext_lti_assignment_id,
    // ext_outcome_data_values_accepted:
    //   signedParams.ext_outcome_data_values_accepted,
    // ext_outcome_result_total_score_accepted:
    //   signedParams.ext_outcome_result_total_score_accepted,
    // ext_outcome_submission_needs_additional_review_accepted:
    //   signedParams.ext_outcome_submission_needs_additional_review_accepted,
    // ext_outcome_submission_prioritize_non_tool_grade_accepted:
    //   signedParams.ext_outcome_submission_prioritize_non_tool_grade_accepted,
    // ext_outcome_submission_submitted_at_accepted:
    //   signedParams.ext_outcome_submission_submitted_at_accepted,
    // ext_outcomes_tool_placement_url:
    //   signedParams.ext_outcomes_tool_placement_url,
    // ext_roles: signedParams.ext_roles,
    // tool_consumer_info_product_family_code:
    //   signedParams.tool_consumer_info_product_family_code,
    // tool_consumer_info_version: signedParams.tool_consumer_info_version,
    // tool_consumer_instance_contact_email:
    //   signedParams.tool_consumer_instance_contact_email,
    // tool_consumer_instance_guid: signedParams.tool_consumer_instance_guid,
    // tool_consumer_instance_name: signedParams.tool_consumer_instance_name,
    // user_image: signedParams.user_image,
    oauth: {
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: signedParams.oauth_consumer_key,
      oauth_nonce: signedParams.oauth_nonce,
      oauth_timestamp: signedParams.oauth_timestamp,
      oauth_version: signedParams.oauth_version,
      oauth_signature: signedParams.oauth_signature,
    },
  } as ElaData;
}
