"use server";
import { json } from "@solidjs/router";
import { memcached_server_request } from "../ext_requests/memcached_server_request";
import { postgresql_server_request } from "../ext_requests/posgresql_server_request";

const code_regex = /^\d{6}$/;

export async function POST({ request }) {
  try {
    const body = await request.json();
    const profId = body.profId;
    const verify_input = body.code;
    const randomId = body.randomId;

    if (!code_regex.test(verify_input)) {
      return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
        status: 400,
      });
    }

    const data = await postgresql_server_request(
      "GET",
      `user/find_email_by_profId/${profId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status === 400) {
      return json({redirect: data.redirect, message: data.message}, {
        status: 400,
      });
    }

    const vsession = await memcached_server_request(
      "GET",
      `validate_id/${profId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!vsession) {
      return json("კოდი არ არსებობს, გთხოვთ ხელახლა გაიგზავნოთ.", {
        status: 400,
      });
    }
    const parsed_object = JSON.parse(vsession);

    if (randomId !== parsed_object.random_id) {
      return json(
        "თქვენს მიერ მოწოდებული id არ მოიძებნება, გთხოვთ გაიგზავნოთ კოდი.",
        {
          status: 400,
        }
      );
    }

    if (parsed_object.code !== verify_input) {
      return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
        status: 400,
      });
    }

    await memcached_server_request(
        "DELETE",
        `delete_verification_code/${profId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    return json("წარმატება", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
}
