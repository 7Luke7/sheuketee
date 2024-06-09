'use server'
import crypto from "crypto"
import { redisClient } from "~/entry-server";

export const create_session = async (profId, userId) => {
    try {
        const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;

        const session_id = crypto.randomBytes(16).toString("hex")
        await redisClient.set(session_id, JSON.stringify({ profId, userId, expires }), {PX: 7 * 24 * 60 * 60 * 1000});

        return session_id
    } catch (error) {
        console.log(error)
    }
}

export const verify_user = async (event) => {
    try {
        if (!event.request.headers.get("cookie")) {
            throw new Error(401)
        }
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        if (!session) {
            throw new Error(401)
        }
        const user = await redisClient.get(session);

        if (!user) {
            throw new Error(401)
        }

        return JSON.parse(user)
    } catch (error) {
        if (error.message === "401") {
            return 401
        }
        console.log("VERIFY_USER ERROR", error)
    }
}