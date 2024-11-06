"use server";
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";

export const modify_user_skills = async (skills) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const data = await postgresql_server_request(
      "PUT",
      `xelosani/modify_xelosani_skills`,
      {
        body: JSON.stringify({
          skills,
          userId: session.userId
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status === 400) {
      return 400;
    }

    return 200;
  } catch (error) {
    if (error.message === "401") {
      return 401;
    }
  }
};
