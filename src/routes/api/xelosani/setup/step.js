"use server";
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { compress_image } from "../../compress_images";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";

export const upload_profile_picture_no_verification = async (file, profId) => {
  try {
    const bytes = await file.arrayBuffer(file);
    const buffer = Buffer.from(bytes);
    const compressed_buffer = await compress_image(buffer, 50, 140, 140);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${profId}-profpic`,
      Region: "eu-central-1",
      Body: compressed_buffer,
      ACL: "private",
      ContentType: "webp",
    };
    const upload_image = new PutObjectCommand(params);
    await s3.send(upload_image);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const navigateToStep = async () => {
  const BASE_URL = "/setup/xelosani/step";
  try {
    const event = getRequestEvent();
    const redis_user = await verify_user(event);
    const user = await postgresql_server_request("GET", `xelosani/get_step_data/${redis_user.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    console.log(user)

    if (!user.phone) {
      return `${BASE_URL}/contact`;
    }
    if (!user.email) {
      return `${BASE_URL}/contact`;
    }
    if (!user.location) {
      return `${BASE_URL}/location`;
    }
    if (!user.about) {
      return `${BASE_URL}/about`;
    }
    if (!user.age) {
      return `${BASE_URL}/age`;
    }
    if (!user.gender) {
      return `${BASE_URL}/gender`;
    }
    if (!user.schedule) {
      return `${BASE_URL}/schedule`;
    }
    if (!user.skills.length) {
      return `${BASE_URL}/skills`;
    }
  } catch (error) {
    if (error.name === "NotFound") {
      return `${BASE_URL}/photo`;
    }
  }
};
