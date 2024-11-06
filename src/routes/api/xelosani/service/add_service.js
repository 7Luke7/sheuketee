"use server"
import { verify_user } from "../../session_management";
import { CustomError } from "../../utils/errors/custom_errors";
import crypto from "node:crypto";
import { HandleError } from "../../utils/errors/handle_errors";
import { compress_image } from "../../compress_images";
import { add_image_to_s3 } from "../../damkveti/job";

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

export async function POST({request}) {
    try {
        const user = await verify_user({request});
        if (user === 401 || user.role === "damkveti") {
          return 401;
        }

        const formData = await request.formData()

        const location = JSON.parse(formData.get("location"))
        const imageLength = formData.get("galleryLength")
        const thumbNail = formData.get("thumbnail")
        const description = formData.get("description")
        const title = formData.get("title")
        const price = formData.get("price")
        const mainCategory = formData.get("mainCategory");
        const parentCategory = formData.get("parentCategory")
        const childCategory = JSON.parse(formData.get("childCategory"))
        const service = JSON.parse(formData.get("service"))
        const schedule = JSON.parse(formData.get("schedule"))

        if (!childCategory || !childCategory.length) {
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
        if (!imageLength) {
          throw new CustomError(
            "image",
            "გალერეა სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (title.length < 5) {
          throw new CustomError(
            "title",
            "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
        if (title.length > 60) {
          throw new CustomError(
            "title",
            "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
    
        if (description.length < 20) {
          throw new CustomError(
            "description",
            "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
        if (description.length > 300) {
          throw new CustomError(
            "description",
            "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს."
          ).ExntendToErrorName("ValidationError");
        }

        if (!price) {
          throw new CustomError(
            "price",
            `სერვისის ფასი სავალდებულოა.`
          ).ExntendToErrorName("ValidationError");
        }
    
        if (service && service.length) {
          for (let i = 0; i < service.length; i++) {
              if (service[i].title.length < 5) {
                  throw new CustomError(
                    `service.${i}.title`,
                    `${i + 1} ქვესერვისის სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].title.length > 60) {
                  throw new CustomError(
                    `service.${i}.title`,
                    `${i + 1} ქვესერვისის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].description.length < 20) {
                  throw new CustomError(
                    `service.${i}.description`,
                    `${i + 1} ქვესერვისის აღწერა უნდა შეიცავდეს მინიმუმ 20 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].description.length > 300) {
                  throw new CustomError(
                    `service.${i}.description`,
                    `${i + 1} ქვესერვისის აღწერა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }
        
                if (!service[i].price) {
                  throw new CustomError(
                    `service.${i}.price`,
                    `${i + 1} ქვესერვისის ფასი სავალდებულოა.`
                  ).ExntendToErrorName("ValidationError");
                }

              const random_id = crypto.randomUUID();
              service[i]["publicId"] = random_id;
              service[i]["childCategory"] = childCategory;
              service[i]["parentCategory"] = parentCategory
          }
        }

        const tags = ["mock"]
        const random_id = crypto.randomUUID();

        const service_post = await Service.create({
          _creator: user.userId,
          display: service,
          categories: [...childCategory, mainCategory, parentCategory],
          publicId: random_id, 
          tags: tags,
          location,
          mainTitle: title,
          mainCategory: mainCategory,
          availability: schedule,
          mainDescription: description,
          mainPrice: price
        });
    
        await Xelosani.findByIdAndUpdate(user.userId, {
          $addToSet: {
            services: service_post._id
          }
        })

        const thumbNail_bytes = await thumbNail.arrayBuffer(thumbNail);
        const thumbNail_buffer = Buffer.from(thumbNail_bytes);
        const thumb_compressed = await compress_image(thumbNail_buffer, 50, 200, 200);
        await add_image_to_s3(
          thumb_compressed,
          service_post.publicId,
          "service-post-thumbnail"
        );
    
        let count = 0;
    
        for (let i = 0; i < imageLength; i++) {
          const current_image = formData.get(`service-${i}-gallery-image`)
          if (current_image.size > MAX_SINGLE_FILE_SIZE) {
            throw Error(`${current_image.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
          }
          count += current_image.size;
          if (count > MAX_TOTAL_SIZE) {
            throw Error("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.");
          }
          const bytes = await current_image.arrayBuffer(current_image);
          const buffer = Buffer.from(bytes);
          const compressed_buffer = await compress_image(buffer, 50, 600, 400); // mobile has to be added
          await add_image_to_s3(
            compressed_buffer,
            `${service_post.publicId}-${i}`,
            "service-post-gallery"
          );
        }
    
        return {
            status: 200
        };
      } catch (error) {
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