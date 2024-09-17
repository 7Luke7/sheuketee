"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "./session_management";
import { JobPost } from "./models/User";
import { get_user_profile_image, getTimeAgo } from "./user";
import { s3 } from "~/entry-server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const get_user_job_image = async (key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Region: "eu-central-1",
      Key: key
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url
  } catch (error) {
    if (error.name === "NotFound") {
      return null;
    }
  }
};

export const get_jobs = async () => {
  try {
    const jobs = await JobPost.find({}, "-_id -updatedAt -__v")
      .populate(
        "_creator",
        "-stepPercent -__t -__v -jobs -about -_id -role -notificationDevices -password -updatedAt -createdAt -date -email"
      )
      .limit(16)
      .skip(0)
      .lean();

    for (let i = 0; i < jobs.length; i++) {
      const profile_id = jobs[i]._creator.profId;
      const profile_image =  await get_user_profile_image(profile_id)
      const image = await get_user_job_image(`${jobs[i].publicId}-${i}-job-post-thumbnail`)
      const creationDateDisplayable = getTimeAgo(jobs[i].createdAt);
      jobs[i]["createdAt"] = creationDateDisplayable
      jobs[i]["thumbnail"] = image
      jobs[i]["profPic"] = profile_image
    }

    return JSON.stringify({
      jobs,
      status: 200,
    })
  } catch (error) {
    console.log(error);
  }
};
