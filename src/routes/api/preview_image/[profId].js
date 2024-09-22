import { verify_user } from "../session_management";
import { compress_image } from "../compress_images";

export async function POST({request, params}) {
    try {
      const redis_user = await verify_user({request});

      if (redis_user.profId !== params.profId) {
        throw new Error(401);
      }
      const formData = await request.formData();
      const file = formData.get("profile_image")
  
      const bytes = await file.arrayBuffer(file);
      const buffer = Buffer.from(bytes);
      const compressed_buffer = await compress_image(buffer, 80, 140, 140);
      const base64 = Buffer.from(compressed_buffer, "binary").toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      if (error.message === "aborted") {
        return "AbortError"
      }
      console.log("OUTER ERROR", error);
    }
  };