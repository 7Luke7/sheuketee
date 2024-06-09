"use server"
import { getRequestEvent } from "solid-js/web"
import { upload_profile_picture } from "./user"
import { User } from "./models/User"
import { verify_user } from "./session_management"

export const handle_profile_image = async (buffer, id) => {
    try {
        console.log(id)
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 
        console.log(redis_user)
        const image_buffer = await upload_profile_picture(buffer, redis_user)
        if (id === "setup_image") {
            const user = await User.findById(redis_user.userId)
            console.log(user)
            user.step = user.step + 1
            await user.save()
        }
        return {status: 200, image: image_buffer}
    } catch (error) {
        console.log(error)
    }
}