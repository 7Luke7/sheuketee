import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { verify_user } from "../session_management";
import { compress_image } from "../compress_images";
import { s3 } from "~/entry-server";
import { Damkveti, Xelosani } from "../models/User";

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

export async function POST({request, params}) {
  let redis_user;
  let file
  try {
    redis_user = await verify_user({ request });
    
    if (redis_user.profId !== params.profId) {
      throw new Error(401);
    }

    const formData = await request.formData();
    file = formData.get("profile_image");

    if (file.size > MAX_SINGLE_FILE_SIZE) {
      throw new Error(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`)
    }

    const head_params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Region: "eu-central-1",
      Key: `${redis_user.profId}-profpic`,
    };

    const headCommand = new HeadObjectCommand(head_params);
    await s3.send(headCommand);

    const bytes = await file.arrayBuffer(file);
    const buffer = Buffer.from(bytes);
    const compressed_buffer = await compress_image(buffer, 50, 140, 140);
    const s3_params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${redis_user.profId}-profpic`,
      Region: "eu-central-1",
      Body: compressed_buffer,
      ACL: "private",
      ContentType: "webp",
    };
    const upload_image = new PutObjectCommand(s3_params);
    await s3.send(upload_image);
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      const bytes = await file.arrayBuffer(file);
      const buffer = Buffer.from(bytes);
      const compressed_buffer = await compress_image(buffer, 50, 140, 140);

      if (redis_user.role === 1) {
        await Xelosani.updateOne(
          { _id: redis_user.userId },
          {
            $inc: {
              stepPercent: 12.5,
            },
          }
        );
      } else {
        await Damkveti.updateOne(
          { _id: redis_user.userId },
          {
            $inc: {
              stepPercent: 17,
            },
          }
        );
      }

      const s3_params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${redis_user.profId}-profpic`,
        Region: "eu-central-1",
        Body: compressed_buffer,
        ACL: "private",
        ContentType: "webp",
      };
      const upload_image = new PutObjectCommand(s3_params);
      await s3.send(upload_image);

      return true;
    }
    if (error.message === "aborted") {
      return "AbortError";
    }
    console.log(error);
  }
}
