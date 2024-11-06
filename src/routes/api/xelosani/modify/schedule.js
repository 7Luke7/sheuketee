"use server"
import {getRequestEvent} from "solid-js/web"
import {verify_user} from "../../session_management"
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";

export const modify_user_schedule = async (formData) => {
    try {
        const event = getRequestEvent();
        const session = await verify_user(event);

        if (session === 401) {
            throw new Error(401);
        }

        const schedule = [
            {
                available_from: formData.get("ორშაბათი-საწყისი-დრო"),
                available_to: formData.get("ორშაბათი-სასრული-დრო"),
                day_of_week: "ორშაბათი"
            },
            {
                available_from: formData.get("სამშაბათი-საწყისი-დრო"),
                available_to: formData.get("სამშაბათი-სასრული-დრო"),
                day_of_week: "სამშაბათი"
            },
            {
                available_from: formData.get("ოთხშაბათი-საწყისი-დრო"),
                available_to: formData.get("ოთხშაბათი-სასრული-დრო"),
                day_of_week: "ოთხშაბათი"
            },
            {
                available_from: formData.get("ხუთშაბათი-საწყისი-დრო"),
                available_to: formData.get("ხუთშაბათი-სასრული-დრო"),
                day_of_week: "ხუთშაბათი"
            },
            {
                available_from: formData.get("პარასკევი-საწყისი-დრო"),
                available_to: formData.get("პარასკევი-სასრული-დრო"),
                day_of_week: "პარასკევი"
            },
            {
                available_from: formData.get("შაბათი-საწყისი-დრო"),
                available_to: formData.get("შაბათი-სასრული-დრო"),
                day_of_week: "შაბათი"
            },
            {
                available_from: formData.get("კვირა-საწყისი-დრო"),
                available_to: formData.get("კვირა-სასრული-დრო"),
                day_of_week: "კვირა"
            }
        ]

        const data = await postgresql_server_request("PUT", `xelosani/modify_xelosani_schedule`, {
            body: JSON.stringify({
                schedule,
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
