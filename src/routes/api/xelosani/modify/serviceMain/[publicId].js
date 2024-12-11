// "use server"

// import { json } from "@solidjs/router";
// import { verify_user } from "../../../session_management";
// import { compress_image } from "~/routes/api/compress_images";

// const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

// export async function POST({request, params}) {
//     try {
//         const redis_user = await verify_user({request});
  
//         if (redis_user === 401) {
//             throw new Error(401);
//         }

//         const formData = await request.formData()

//         const location = JSON.parse(formData.get("location"))
//         const thumbNail = formData.get("thumbnail")
//         const description = formData.get("description")
//         const title = formData.get("title")
//         const price = formData.get("price")
//         const mainCategory = formData.get("mainCategory")
//         const parentCategory = formData.get("parentCategory")
//         const childCategory = JSON.parse(formData.get("childCategory"))

//         if (!childCategory || !childCategory.length) {
//           throw new CustomError(
//             "category",
//             "გთხოვთ აირჩიოთ კატეგორია."
//           ).ExntendToErrorName("ValidationError");
//         }
//         if (!thumbNail) {
//           throw new CustomError(
//             "image",
//             "თამბნეილი სავალდებულოა."
//           ).ExntendToErrorName("ValidationError");
//         }
//         if (title.length < 5) {
//           throw new CustomError(
//             "title",
//             "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს."
//           ).ExntendToErrorName("ValidationError");
//         }
//         if (title.length > 60) {
//           throw new CustomError(
//             "title",
//             "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
//           ).ExntendToErrorName("ValidationError");
//         }
    
//         if (description.length < 20) {
//           throw new CustomError(
//             "description",
//             "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს."
//           ).ExntendToErrorName("ValidationError");
//         }
//         if (description.length > 300) {
//           throw new CustomError(
//             "description",
//             "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს."
//           ).ExntendToErrorName("ValidationError");
//         }

//         if (!price) {
//           throw new CustomError(
//             "price",
//             `სერვისის ფასი სავალდებულოა.`
//           ).ExntendToErrorName("ValidationError");
//         }

//         if (thumbNail.size) {          
//           if (thumbNail.size > MAX_SINGLE_FILE_SIZE) {
//             throw Error(`${thumbNail.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
//           }
//           const bytes = await thumbNail.arrayBuffer(thumbNail) 
//           const buffer = Buffer.from(bytes) 
//           const thumb_compressed = await compress_image(buffer, 50, 351, 351);

//           const service = await Service.findOneAndUpdate({publicId: params.publicId}, {
//             tags: [...childCategory, mainCategory, parentCategory],
//             location,
//             mainTitle: title,
//             mainCategory: mainCategory,
//             mainDescription: description,
//             mainPrice: price
//           }, {new: true});
//           await add_image_to_s3(thumb_compressed, service.publicId, "service-post-thumbnail")
    
//           return json(true, {status: 200})
//         }

//       await Service.findOneAndUpdate({publicId: params.publicId}, {
//           tags: [...childCategory, mainCategory, parentCategory],
//           location,
//           mainTitle: title,
//           mainCategory: mainCategory,
//           mainDescription: description,
//           mainPrice: price
//       }, {new: true});

//       return json(true, {status: 200})
//     } catch (error) {
//         console.log(error)
//         if (error.name === "ValidationError") {
//           const errors = new HandleError(error).validation_error();
//           return json({errors, status: 400})
//         }
//         return json(false, {status: 500})
//     }
// } 