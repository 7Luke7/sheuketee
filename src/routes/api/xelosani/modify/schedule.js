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
              startTime: formData.get("ორშაბათი-startTime"),
              endTime: formData.get("ორშაბათი-endTime"),
              day: "ორშაბათი",
            },
            {
              startTime: formData.get("სამშაბათი-startTime"),
              endTime: formData.get("სამშაბათი-endTime"),
              day: "სამშაბათი",
            },
            {
              startTime: formData.get("ოთხშაბათი-startTime"),
              endTime: formData.get("ოთხშაბათი-endTime"),
              day: "ოთხშაბათი",
            },
            {
              startTime: formData.get("ხუთშაბათი-startTime"),
              endTime: formData.get("ხუთშაბათი-endTime"),
              day: "ხუთშაბათი",
            },
            {
              startTime: formData.get("პარასკევი-startTime"),
              endTime: formData.get("პარასკევი-endTime"),
              day: "პარასკევი",
            },
            {
              startTime: formData.get("შაბათი-startTime"),
              endTime: formData.get("შაბათი-endTime"),
              day: "შაბათი",
            },
            {
              startTime: formData.get("კვირა-startTime"),
              endTime: formData.get("კვირა-endTime"),
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
