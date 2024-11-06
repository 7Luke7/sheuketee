import { verify_user } from "../session_management";
import { compress_image } from "../compress_images";

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

export async function POST({request, params}) {
  try {
      const redis_user = await verify_user({request});

      if (redis_user.profId !== params.profId) {
        throw new Error(401);
      }
      const formData = await request.formData();
      const file = formData.get("profile_image")

      // this check should be done on client side as well
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        throw new Error(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`)
      }
  
      const bytes = await file.arrayBuffer(file);
      const buffer = Buffer.from(bytes);
      const compressed_buffer = await compress_image(buffer, 50, 140, 140);
      const base64 = Buffer.from(compressed_buffer, "binary").toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      if (error.message === "aborted") {
        return "AbortError"
      }
      console.log("OUTER ERROR", error);
    }
  };