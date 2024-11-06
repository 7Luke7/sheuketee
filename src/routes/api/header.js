"use server"
import { verify_user } from "./session_management"
import { getRequestEvent } from "solid-js/web"

export const header = async () => {
    try {   
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        // const profile_image = await get_user_profile_image(redis_user.profId)
        return {
            profile_image: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
            profId: redis_user.profId,
            role: redis_user.role
        }
        } catch (error) {

        if (error.message === "401") {
            return 401
        }
        console.log("GET USER", error)
    }
}