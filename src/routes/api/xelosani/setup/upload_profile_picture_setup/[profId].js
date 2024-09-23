import { verify_user } from "~/routes/api/session_management";
import { upload_profile_picture_no_verification } from "../step";
import { Xelosani } from "~/routes/api/models/User";

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

export async function POST({request, params}) {
    try {
      const redis_user = await verify_user({request});
  
      if (redis_user.profId !== params.profId) {
        throw new Error(401);
      }
      const formData = await request.formData()
      const file = formData.get("profile_image")
      
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        throw new Error(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`)
      }
  
      const response = await upload_profile_picture_no_verification(file, redis_user.profId);
  
      const user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
        $inc: {stepPercent: 12.5}
      },
      { runValidators: true, new: true,}).select("stepPercent profId -_id -__t").lean()
  
    return { ...user, imageResponse: response };
    } catch (error) {
    if (error.message === "aborted") {
        return "AbortError";
    }
      console.log(error);
    }
  };