"use server"
import { cache } from "@solidjs/router"
import { verify_user } from "./session_management"
import { get_user_profile_image } from "./user"
import { getRequestEvent } from "solid-js/web"

export const header = cache(async () => {
    try {   
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        let role
        if (redis_user.role === 1) {
            role = "xelosani"
        } else {
            role = "damkveti"
        }

        const profile_image = await get_user_profile_image(redis_user.profId)
        return {
            profile_image,
            profId: redis_user.profId,
            role
        }
        } catch (error) {

        if (error.message === "401") {
            return 401
        }
        console.log("GET USER", error)
    }
}, "header")