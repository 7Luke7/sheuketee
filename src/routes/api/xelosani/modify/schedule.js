"use server"
import {getRequestEvent} from "solid-js/web"
import {verify_user} from "../../session_management"

export const modify_user_schedule = async (formData) => {
    const insertableObject = [
        {
            startTime: formData.get("ორშაბათი-საწყისი-დრო"),
            endTime: formData.get("ორშაბათი-სასრული-დრო"),
            day: "ორშაბათი"
        },
        {
            startTime: formData.get("სამშაბათი-საწყისი-დრო"),
            endTime: formData.get("სამშაბათი-სასრული-დრო"),
            day: "სამშაბათი"
        },
        {
            startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
            endTime: formData.get("ოთხშაბათი-სასრული-დრო"),
            day: "ოთხშაბათი"
        },
        {
            startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
            endTime: formData.get("ხუთშაბათი-სასრული-დრო"),
            day: "ხუთშაბათი"
        },
        {
            startTime: formData.get("პარასკევი-საწყისი-დრო"),
            endTime: formData.get("პარასკევი-სასრული-დრო"),
            day: "პარასკევი"
        },
        {
            startTime: formData.get("შაბათი-საწყისი-დრო"),
            endTime: formData.get("შაბათი-სასრული-დრო"),
            day: "შაბათი"
        },
        {
            startTime: formData.get("კვირა-საწყისი-დრო"),
            endTime: formData.get("კვირა-სასრული-დრო"),
            day: "კვირა"
        }
    ]

    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)

        if (redis_user === 401) {
            throw new Error(401)
        }

        await Xelosani.updateOne({_id: redis_user.userId},
            { $set: { schedule: insertableObject } }
        )

        return 200
    } catch(error) {
        console.log(error)
    }
}
