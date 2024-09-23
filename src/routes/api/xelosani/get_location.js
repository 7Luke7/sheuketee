"use server"
import { getRequestEvent } from "solid-js/web";
import { Xelosani } from "../models/User";
import { verify_user } from "../session_management";

export const get_location = async () => {
    try {
      const event = getRequestEvent();
      const user = await verify_user(event);
  
      if (user === 401 || user.role === 2) {
        return 401;
      }
      const { location } = await Xelosani.findById(
        user.userId,
        "location -_id -__t"
      ).lean();
      return location;
    } catch (error) {
      console.log(error);
    }
  };