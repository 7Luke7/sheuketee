'use server'
import { getRequestEvent } from "solid-js/web";
import crypto from "crypto"
import { redisClient } from "~/entry-server";

export const create_session = async (profId, userId) => {
    try {
        const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;

        const session_id = crypto.randomBytes(16).toString("hex")
        await redisClient.set(session_id, JSON.stringify({ profId, userId, expires }), 'PX', 7 * 24 * 60 * 60 * 1000);

        return session_id
    } catch (error) {
        console.log(error)
    }
}

export const verify_user = async () => {
    try {
        const event = getRequestEvent()
        const sessionId = event.request.headers.get("cookie").split("sessionId=")[1]

        const session = await redisClient.get(sessionId);

        if (!session) {
            throw new Error(401)
        }
        return JSON.parse(session)
    } catch (error) {
        return 401
    }
}