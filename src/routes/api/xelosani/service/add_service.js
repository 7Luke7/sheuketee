import { Service } from "../../models/User";
import { verify_user } from "../../session_management";
import { CustomError } from "../../utils/errors/custom_errors";
import crypto from "node:crypto";

async function POST({request}) {
    try {
        const user = await verify_user({request});
        if (user === 401 || user.role === 1) {
          return 401;
        }

        const formData = await formData()

        const location = formData.get("location")
        const image = formData.get("image")
        const thumbNail = formData.get("thumbnail")
        const categories = formData.get("categories")
        const description = formData.get("description")
        const title = formData.get("title")
        const price = formData.get("price")

        if (!categories.length) {
          throw new CustomError(
            "category",
            "გთხოვთ აირჩიოთ კატეგორია."
          ).ExntendToErrorName("ValidationError");
        }
        if (!thumbNail) {
          throw new CustomError(
            "image",
            "თამბნეილი სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (!image.length || image.length === 0) {
          throw new CustomError(
            "image",
            "გალერეა სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (!title.length) {
          throw new CustomError(
            "title",
            "სათაური სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (title.length > 100) {
          throw new CustomError(
            "title",
            "სათაური უნდა შეიცავდეს მაქსიმუმ 100 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
    
        if (!description.length) {
          throw new CustomError(
            "description",
            "აღწერა სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (description.length > 1000) {
          throw new CustomError(
            "description",
            "აღწერა უნდა შეიცავდეს მაქსიმუმ 1000 ასო."
          ).ExntendToErrorName("ValidationError");
        }
    
        const random_id = crypto.randomUUID();
    
        const job_post = await Service.create({
          publicId: random_id,
          _creator: user.userId,
          title: title,
          description: description,
          price: price,
          location: location,
          categories,
        //   availability
        //   ratings
        //   reviews
        });
    
        const thumbNail_bytes = await thumbNail.arrayBuffer(thumbNail);
        const thumbNail_buffer = Buffer.from(thumbNail_bytes);
        const thumb_compressed = await compress_image(thumbNail_buffer, 80, 200, 200);
        await add_job_image(
          thumb_compressed,
          `${job_post.publicId}`,
          "job-post-thumbnail"
        );
    
        let count = 0;
    
        for (let i = 0; i < image.length; i++) {
          const current_image = image[i]
          if (current_image.size > MAX_SINGLE_FILE_SIZE) {
            throw Error(`${current_image.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
          }
          count += current_image.size;
          if (count > MAX_TOTAL_SIZE) {
            throw Error("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.");
          }
          const bytes = await current_image.arrayBuffer(current_image);
          const buffer = Buffer.from(bytes);
          const compressed_buffer = await compress_image(buffer, 80, 600, 400); // mobile has to be added
          await add_job_image(
            compressed_buffer,
            `${job_post.publicId}-${i}`,
            "job-post-gallery"
          );
        }
    
        return {
            status: 200
        };
      } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") {
          const errors = new HandleError(error).validation_error();
          return {
            errors,
            status: 400,
          };
        } else {
          console.log(error);
          return {
            status: 500,
          };
        }
      }
}