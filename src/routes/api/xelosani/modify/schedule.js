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
              startTime: formData.get("ორშაბათი-საწყისი-დრო"),
              endTime: formData.get("ორშაბათი-სასრული-დრო"),
              day: "ორშაბათი",
            },
            {
              startTime: formData.get("სამშაბათი-საწყისი-დრო"),
              endTime: formData.get("სამშაბათი-სასრული-დრო"),
              day: "სამშაბათი",
            },
            {
              startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
              endTime: formData.get("ოთხშაბათი-სასრული-დრო"),
              day: "ოთხშაბათი",
            },
            {
              startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
              endTime: formData.get("ხუთშაბათი-სასრული-დრო"),
              day: "ხუთშაბათი",
            },
            {
              startTime: formData.get("პარასკევი-საწყისი-დრო"),
              endTime: formData.get("პარასკევი-სასრული-დრო"),
              day: "პარასკევი",
            },
            {
              startTime: formData.get("შაბათი-საწყისი-დრო"),
              endTime: formData.get("შაბათი-სასრული-დრო"),
              day: "შაბათი",
            },
            {
              startTime: formData.get("კვირა-საწყისი-დრო"),
              endTime: formData.get("კვირა-სასრული-დრო"),
              day: "კვირა",
            },
          ];
      

        const data = await postgresql_server_request("PUT", `xelosani/modify_xelosani_schedule`, {
            body: JSON.stringify({
                schedule,
                xelosaniId: session.userId
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
