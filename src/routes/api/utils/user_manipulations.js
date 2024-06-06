"use server"
import { redisClient } from "~/entry-server";
import { User } from "../models/User";

export const get_user_by_session = async (session) => {
    try {   
        const sess = await redisClient.get(session);
        if (!sess) {
            return 401
        }
        const user_id = JSON.parse(sess) 
        const user = await User.findById(user_id.userId)
        return user
    } catch (error) {
        console.log(error)
    }
}