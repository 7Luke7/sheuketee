"use server"

import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";

export const modify_about = async (formData) => {
    try {
        const event = getRequestEvent();
        const session = await verify_user(event);
        const about = formData.get("about")

        if (about.length > 600) {
            return
        }
        if (session === 401) {
            throw new Error(401);
        }

        const data = await postgresql_server_request("PUT", `xelosani/modify_xelosani_about`, {
            body: JSON.stringify({
                about,
                userId: session.userId
            }),
            headers: {  
                "Content-Type": "application/json",
            },
        });

        if (data.status === 400) {
            return 400
        }

        return 200
    }catch(error) {
        if (error.message === "401") {
            return 401
        }
    }
}