"use server"
import { getRequestEvent } from "solid-js/web"
import { upload_profile_picture } from "./user"

export const handle_profile_image = async (buffer) => {
    try {
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        const image_buffer = await upload_profile_picture(buffer, session)
        return {status: 200, image: image_buffer}
    } catch (error) {
        console.log(error)
    }
}