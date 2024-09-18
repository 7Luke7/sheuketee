"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { Xelosani } from "../../models/User";

export const modify_user_skills = async (skills) => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      await Xelosani.updateOne(
        { _id: redis_user.userId },
        {
          $set: {
            skills: skills,
          },
        },
        { runValidators: true, new: true,}
      )
  
      return 200
    } catch (error) {
      console.log(error);
      if (error) {
        return error.message;
      }
    }
};