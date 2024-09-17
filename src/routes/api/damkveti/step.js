"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { Damkveti } from "../models/User";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/entry-server";
import { compress_image } from "../compress_images";

export const upload_profile_picture_no_verification = async (file, profId) => {
  try {
    const bytes = await file.arrayBuffer(file);
    const buffer = Buffer.from(bytes);
    const compressed_buffer = await compress_image(buffer, 80, 140, 140);
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

export const upload_profile_picture_setup = async (file, prof_id) => {
  try {
    const event = getRequestEvent();
    const redis_user = await verify_user(event);

    if (redis_user.profId !== prof_id) {
      throw new Error(401);
    }

    const response = await upload_profile_picture_no_verification(file, redis_user.profId);

    const user = await Damkveti.findByIdAndUpdate(redis_user.userId, 
      {$inc: {stepPercent: 17}},
      { new: true, runValidators: true }
    ).select("stepPercent profId -_id -__t").lean()

    return {
      imageResponse: response,
      ...user
    };
  } catch (error) {
    console.log(error);
  }
};

export const navigateToStep = async () => {
  const BASE_URL = "/setup/damkveti/step";
  try {
    const event = getRequestEvent();
    const redis_user = await verify_user(event);
    const user = await Damkveti.findById(redis_user.userId);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Region: "eu-central-1",
      Key: `${redis_user.profId}-profpic`,
    };

    const headCommand = new HeadObjectCommand(params);
    await s3.send(headCommand);

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
  } catch (error) {
    console.log(error);
    if (error.name === "NotFound") {
      return `${BASE_URL}/photo`;
    }
  }
};
