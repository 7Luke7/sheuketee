"use server";
import { getRequestEvent } from "solid-js/web";
import { Damkveti, JobPost } from "../models/User";
import { verify_user } from "../session_management";
import { HandleError } from "../utils/errors/handle_errors";
import crypto from "node:crypto";
import { compress_image } from "../compress_images";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/entry-server";
import { CustomError } from "../utils/errors/custom_errors";

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

const add_job_image = async (buffer, identifier, type) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${identifier}-${type}`,
      Region: "eu-central-1",
      Body: buffer,
      ACL: "private",
      ContentType: "webp",
    };
    const upload_image = new PutObjectCommand(params);
    await s3.send(upload_image);
  } catch (error) {
    console.log(error);
  }
};

export const create_job = async (fd, location, image, mileStone, categories) => {
  try {
    const event = getRequestEvent();
    const user = await verify_user(event);
    if (user === 401 || user.role === 1) {
      return 401;
    }

    if (!categories.length) {
      throw new CustomError(
        "category",
        "გთხოვთ აირჩიოთ კატეგორია."
      ).ExntendToErrorName("ValidationError");
    }
    if (!image.length || image.length === 0) {
      throw new CustomError(
        "image",
        "ფოტო სავალდებულოა."
      ).ExntendToErrorName("ValidationError");
    }
    if (!fd.get("title").length) {
      throw new CustomError(
        "title",
        "სათაური სავალდებულოა."
      ).ExntendToErrorName("ValidationError");
    }
    if (fd.get("title").length > 100) {
      throw new CustomError(
        "title",
        "სათაური უნდა შეიცავდეს მაქსიმუმ 100 ასოს."
      ).ExntendToErrorName("ValidationError");
    }

    if (!fd.get("description").length) {
      throw new CustomError(
        "description",
        "აღწერა სავალდებულოა."
      ).ExntendToErrorName("ValidationError");
    }
    if (fd.get("description").length > 1000) {
      throw new CustomError(
        "description",
        "აღწერა უნდა შეიცავდეს მაქსიმუმ 1000 ასო."
      ).ExntendToErrorName("ValidationError");
    }
    if (!mileStone.length && !fd.get("price")) {
      throw new CustomError(
        "price",
        "ფასი სავალდებულოა თუ ეტაპები არ გაქვთ."
      ).ExntendToErrorName("ValidationError");
    }
    if (mileStone.length) {
        for (let i = 0; i < mileStone.length; i++) {
            if (!mileStone[i].title.length) {
                throw new CustomError(
                  `mileStones.${i}.title`,
                  `${i + 1} ეტაპის სათაური სავალდებულოა.`
                ).ExntendToErrorName("ValidationError");
              }
      
              if (mileStone[i].title.length > 100) {
                throw new CustomError(
                  `mileStones.${i}.title`,
                  `${i + 1} ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 100 ასოს.`
                ).ExntendToErrorName("ValidationError");
              }
      
              if (!mileStone[i].description.length) {
                throw new CustomError(
                  `mileStones.${i}.description`,
                  `${i + 1} ეტაპის აღწერა სავალდებულოა.`
                ).ExntendToErrorName("ValidationError");
              }
      
              if (mileStone[i].description.length > 1000) {
                throw new CustomError(
                  `mileStones.${i}.description`,
                  `${i + 1} ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 1000 ასოს.`
                ).ExntendToErrorName("ValidationError");
              }
      
              if (!mileStone[i].price) {
                throw new CustomError(
                  `mileStones.${i}.price`,
                  `${i + 1} ეტაპის ფასი სავალდებულოა.`
                ).ExntendToErrorName("ValidationError");
              }
              
            const random_id = crypto.randomUUID();
            mileStone[i]["milestoneDisplayId"] = random_id;
        }
    }

    const random_id = crypto.randomUUID();

    const job_post = await JobPost.create({
      publicId: random_id,
      _creator: user.userId,
      title: fd.get("title"),
      description: fd.get("description"),
      mileStones: mileStone || null,
      price: fd.get("price"),
      location: location,
      imageLength: image.length,
      categories
    });

    await Damkveti.findByIdAndUpdate(user.userId, {
      $addToSet: { jobs: job_post._id },
    });

    let count = 0;

    for (let i in image) {
      fd.append(`image${i}`, image[i]);
    }

    for (let i = 0; i < image.length; i++) {
      console.log(fd.get(`image${i}`), i)
      const image = fd.get(`image${i}`);
      if (image.size > MAX_SINGLE_FILE_SIZE) {
        throw Error(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
      }
      count += image.size;
      if (count > MAX_TOTAL_SIZE) {
        throw Error("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.");
      }
      const bytes = await image.arrayBuffer(image);
      const buffer = Buffer.from(bytes);
      if (i === image.length - 1) {
        const compressed_buffer = await compress_image(buffer, 80, 200, 200); // mobile has to be added
        await add_job_image(
          compressed_buffer,
          `${job_post.publicId}-${i}`,
          "job-post-thumbnail"
        );
      } else {
        const compressed_buffer = await compress_image(buffer, 80, 600, 400); // mobile has to be added
        await add_job_image(
          compressed_buffer,
          `${job_post.publicId}-${i}`,
          "job-post-gallery"
        );
      }
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
};

export const get_location = async () => {
  try {
    const event = getRequestEvent();
    const user = await verify_user(event);

    if (user === 401 || user.role === 1) {
      return 401;
    }
    const { location } = await Damkveti.findById(
      user.userId,
      "location -_id -__t"
    ).lean();
    return location;
  } catch (error) {
    console.log(error);
  }
};
