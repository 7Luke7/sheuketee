// "use server"
// import { compress_image } from "../compress_images";
// import { Damkveti, JobPost } from "../models/User";
// import { CustomError } from "../utils/errors/custom_errors";
// import { add_image_to_s3 } from "./job";
// import { HandleError } from "../utils/errors/handle_errors";
// import crypto from "node:crypto";
// import { verify_user } from "../session_management";
// import { populate_single_job_tags } from "../tags/job_tags";

// const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
// const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

// export async function POST({request}) {
//     try {
//       const user = await verify_user({request});
//       if (user === 401 || user.role === "xelosani") {
//         return 401;
//       }

//       const fd = await request.formData()

//       const location = JSON.parse(fd.get("location"));
//       const thumbNail = fd.get("thumbnail")
//       const categories = JSON.parse(fd.get("categories"))
//       const mileStone = JSON.parse(fd.get("mileStone"))
//       const galleryLength = fd.get("galleryLength")
//       const description = fd.get("description")
//       const title = fd.get("title")
//       const streetAddress = fd.get("streetAddress")
//       const city = fd.get("city")
//       const state = fd.get("state")
//       const price = fd.get("price")

//       if (!categories.length) {
//         throw new CustomError(
//           "category",
//           "გთხოვთ აირჩიოთ კატეგორია."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (!thumbNail) {
//         throw new CustomError(
//           "image",
//           "თამბნეილი სავალდებულოა."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (!galleryLength) {
//         throw new CustomError(
//           "image",
//           "გალერეა სავალდებულოა."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (!title.length) {
//         throw new CustomError(
//           "title",
//           "სათაური სავალდებულოა."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (title.length > 60) {
//         throw new CustomError(
//           "title",
//           "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
//         ).ExntendToErrorName("ValidationError");
//       }
  
//       if (!description.length) {
//         throw new CustomError(
//           "description",
//           "აღწერა სავალდებულოა."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (description.length > 600) {
//         throw new CustomError(
//           "description",
//           "აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (mileStone && !mileStone.length && !price) {
//         throw new CustomError(
//           "price",
//           "ფასი სავალდებულოა თუ ეტაპები არ გაქვთ."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (!streetAddress.length) {
//         throw new CustomError(
//           "address",
//           "ქუჩის მისამართი სავალდებულოა."
//         ).ExntendToErrorName("ValidationError");
//       }
//       if (mileStone && mileStone.length) {
//           for (let i = 0; i < mileStone.length; i++) {
//               if (!mileStone[i].title.length) {
//                   throw new CustomError(
//                     `mileStones.${i}.title`,
//                     `${i + 1} ეტაპის სათაური სავალდებულოა.`
//                   ).ExntendToErrorName("ValidationError");
//                 }
        
//                 if (mileStone[i].title.length > 60) {
//                   throw new CustomError(
//                     `mileStones.${i}.title`,
//                     `${i + 1} ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 600 ასოს.`
//                   ).ExntendToErrorName("ValidationError");
//                 }
        
//                 if (!mileStone[i].description.length) {
//                   throw new CustomError(
//                     `mileStones.${i}.description`,
//                     `${i + 1} ეტაპის აღწერა სავალდებულოა.`
//                   ).ExntendToErrorName("ValidationError");
//                 }
        
//                 if (mileStone[i].description.length > 600) {
//                   throw new CustomError(
//                     `mileStones.${i}.description`,
//                     `${i + 1} ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.`
//                   ).ExntendToErrorName("ValidationError");
//                 }
        
//                 if (!mileStone[i].price) {
//                   throw new CustomError(
//                     `mileStones.${i}.price`,
//                     `${i + 1} ეტაპის ფასი სავალდებულოა.`
//                   ).ExntendToErrorName("ValidationError");
//                 }
                
//               const random_id = crypto.randomUUID();
//               mileStone[i]["milestoneDisplayId"] = random_id;
//           }
//       }
  
//       const random_id = crypto.randomUUID();

//       const tags = await populate_single_job_tags(title, (location() ? {streetAddress: location.address.suburb, city: location.address.city} :  {city, streetAddress}), categories, price, description)
  
//       console.log(tags)
//       const job_post = await JobPost.create({
//         publicId: random_id,
//         _creator: user.userId,
//         title: title,
//         description: description,
//         mileStones: mileStone || null,
//         price: price,
//         location: location,
//         categories
//       });
  
//       await Damkveti.findByIdAndUpdate(user.userId, {
//         $addToSet: { jobs: job_post._id },
//       });
  
//       const thumbNail_bytes = await thumbNail.arrayBuffer(thumbNail);
//       const thumbNail_buffer = Buffer.from(thumbNail_bytes);
//       const thumb_compressed = await compress_image(thumbNail_buffer, 50, 351, 351);
//       await add_image_to_s3(
//         thumb_compressed,
//         `${job_post.publicId}`,
//         "job-post-thumbnail"
//       );
  
//       let count = 0;
  
//       for (let i = 0; i < galleryLength; i++) {
//         const current_image = fd.get(`job-${i}-gallery-image`)
//         if (current_image.size > MAX_SINGLE_FILE_SIZE) {
//           throw Error(`${current_image.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
//         }
//         count += current_image.size;
//         if (count > MAX_TOTAL_SIZE) {
//           throw Error("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.");
//         }
//         const bytes = await current_image.arrayBuffer(current_image);
//         const buffer = Buffer.from(bytes);
//         const compressed_buffer = await compress_image(buffer, 50, 600, 400); // mobile has to be added
//         await add_image_to_s3(
//           compressed_buffer,
//           `${job_post.publicId}-${i}`,
//           "job-post-gallery"
//         );
//       }
  
//       return {
//           status: 200
//       };
//     } catch (error) {
//       console.log(error)
//       if (error.name === "ValidationError") {
//         const errors = new HandleError(error).validation_error();
//         return {
//           errors,
//           status: 400,
//         };
//       } else {
//         console.log(error);
//         return {
//           status: 500,
//         };
//       }
//     }
//   };
  