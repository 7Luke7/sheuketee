import {getRequestEvent} from "solid-js/web"
import {Xelosani} from "../../models/User"
import {verify_user} from "../../session_management"

export const modify_user_schedule = async (formData) => {
    const insertableObject = {
        monday: {
            startTime: formData.get("ორშაბათი-საწყისი-დრო"),
            endTime: formData.get("ორშაბათი-სასრული-დრო")
        },
        tuesday: {
            startTime: formData.get("სამშაბათი-საწყისი-დრო"),
            endTime: formData.get("სამშაბათი-სასრული-დრო")
        },
        wednesday: {
            startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
            endTime: formData.get("ოთხშაბათი-სასრული-დრო")
        },
        thursday: {
            startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
            endTime: formData.get("ხუთშაბათი-სასრული-დრო")
        },
        friday: {
            startTime: formData.get("პარასკევი-საწყისი-დრო"),
            endTime: formData.get("პარასკევი-სასრული-დრო")
        },
        saturday: {
            startTime: formData.get("შაბათი-საწყისი-დრო"),
            endTime: formData.get("შაბათი-სასრული-დრო")
        },
        sunday: {
            startTime: formData.get("კვირა-საწყისი-დრო"),
            endTime: formData.get("კვირა-სასრული-დრო")
        }
    }

    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)

        if (redis_user === 401) {
            throw new Error(401)
        }

        const update_user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
            location: location
        })
        console.log(update_user, redis_user, insertableObject)

        return 200
    } catch(error) {
        console.log(error)
    }
}
