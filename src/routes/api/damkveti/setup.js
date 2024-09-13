"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { Damkveti } from "../models/User";
import { HandleError } from "../utils/errors/handle_errors";

export const get_damkveti_step = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      const user = await Damkveti.findById(redis_user.userId, "stepPercent");
  
      return user.stepPercent;
    } catch (error) {
      console.log(error);
    }
}

export const check_about = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findById(redis_user.userId, "about");
  
      return user.about;
    } catch (error) {
      if (error.message === "401") {
        return 401;
      }
    }
  };

  export const handle_about = async (formData) => {
    try {
      const about = formData.get("about");
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findOneAndUpdate(
        { _id: redis_user.userId },
        {
          $set: {
            about: about,
          },
          $inc: {
            stepPercent: 12.5,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("stepPercent profId -_id");
  
      const document = user._doc;
      return { ...document, status: 200 };
    } catch (error) {
      if (error.name === "ValidationError") {
        const handled_error = new HandleError(error).validation_error();
        return { ...handled_error[0], status: 400 };
      }
      return error.message;
    }
  };
  
  export const handle_date_select = async (date) => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      await Damkveti.updateOne(
        { _id: redis_user.userId },
        {
          $set: { date: date },
          $inc: { stepPercent: 12.5 },
        },
        { runValidators: true }
      );
  
      return 200;
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  };
  
  export const check_user_age = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findById(redis_user.userId, "date");
  
      return user.date;
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  };
  
  export const handle_user_gender = async (gender) => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      await Damkveti.updateOne(
        { _id: redis_user.userId },
        {
          $set: {
            gender: gender,
          },
          $inc: {
            stepPercent: 12.5,
          },
        },
        { runValidators: true }
      );
  
      return 200;
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  };
  
  export const check_user_gender = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findById(redis_user.userId, "gender");
  
      return user.gender;
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  };
  
  export const handle_location = async (location) => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
      if (!location) {
        throw new Error("აირჩიე ლოკაცია");
      }
  
      await Damkveti.updateOne(
        { _id: redis_user.userId },
        {
          $set: {
            location: location,
          },
          $inc: {
            stepPercent: 12.5,
          },
        }
      );
  
      return 200;
    } catch (error) {
      console.log(error);
    }
  };

  export const handle_contact = async (formData, contact) => {
    try {
      const inputText = formData.get("input");
      if (contact === "phone") {
        if (!phoneRegex.test(inputText)) {
          throw new Error("ტელეფონის ნომერი არასწორია.");
        }
      } else {
        if (!emailRegex.test(inputText)) {
          throw new Error("მეილი არასწორია.");
        }
      }
  
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findOne({
        $or: [
          { phone: contact === "phone" ? inputText : null },
          { email: contact === "email" ? inputText : null },
        ],
        _id: { $ne: redis_user.userId },
      });
  
      if (user) {
        if (contact === "phone" && user.phone === inputText) {
          throw new Error("მომხმარებელი ტელეფონის ნომრით უკვე არსებობს.");
        } else if (contact === "email" && user.email === inputText) {
          throw new Error("მომხმარებელი მეილით უკვე არსებობს.");
        }
      }
  
      if (contact === "phone") {
        await Damkveti.updateOne(
          { _id: redis_user.userId },
          {
            $set: {
              phone: inputText,
            },
            $inc: {
              stepPercent: 12.5,
            },
          },
          { runValidators: true }
        );
      } else {
        await Damkveti.updateOne(
          { _id: redis_user.userId },
          {
            $set: {
              email: inputText,
            },
            $inc: {
              stepPercent: 12.5,
            },
          },
          { runValidators: true }
        );
      }
  
      return 200;
    } catch (error) {
      if (error.code === 11000) {
        return new HandleError().duplicate_error(
          contact === "phone" ? "ტელეფონის ნომრით" : "მეილით"
        );
      }
      if (error.message === "401") {
        return 401;
      }
      return error.message;
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{9}$/;
  export const check_contact = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findById(redis_user.userId, "phone email");
  
      if (user.email && !user.phone) {
        return "phone";
      } else if (user.phone && !user.email) {
        return "email";
      } else {
        return "fine";
      }
    } catch (error) {
      if (error.message === "401") {
        return 401;
      }
      console.log(error);
    }
  };
  
  export const check_location = async () => {
    try {
      const event = getRequestEvent();
      const redis_user = await verify_user(event);
  
      if (redis_user === 401) {
        throw new Error(401);
      }
  
      const user = await Damkveti.findById(redis_user.userId, "location");
  
      if (user.location) {
        return 400;
      }
  
      return 200;
    } catch (error) {
      if (error) {
        return error.message;
      }
    }
  };