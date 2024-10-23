"use server";
import { getRequestEvent } from "solid-js/web";
import { Damkveti} from "../models/User";
import { verify_user } from "../session_management";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/entry-server";

export const add_image_to_s3 = async (buffer, identifier, type) => {
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
    return location || "no-locaiton";
  } catch (error) {
    console.log(error);
  }
};
