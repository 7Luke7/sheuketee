"use server"
import { verify_user } from "./session_management"
import { getRequestEvent } from "solid-js/web"

export const header = async () => {
    try {   
        const event = getRequestEvent()
        const session = await verify_user(event) 

        if (session === 401) {
            throw new Error(401)
        }

        return {
            profId: session.profId,
            role: session.role
        }
        } catch (error) {

        if (error.message === "401") {
            return 401
        }
        console.log("GET USER", error)
    }
}