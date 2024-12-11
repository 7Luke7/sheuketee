// "use server"
// import { getRequestEvent } from "solid-js/web";
// import { verify_user } from "../session_management";
// import { Damkveti } from "../models/User";
// import { HeadObjectCommand } from "@aws-sdk/client-s3";
// import { s3 } from "~/entry-server";

// export const navigateToStep = async () => {
//   const BASE_URL = "/setup/damkveti/step";
//   try {
//     const event = getRequestEvent();
//     const redis_user = await verify_user(event);
//     const user = await Damkveti.findById(redis_user.userId);

//     const params = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Region: "eu-central-1",
//       Key: `${redis_user.profId}-profpic`,
//     };

//     const headCommand = new HeadObjectCommand(params);
//     await s3.send(headCommand);

//     if (!user.phone) {
//       return `${BASE_URL}/contact`;
//     }
//     if (!user.email) {
//       return `${BASE_URL}/contact`;
//     }
//     if (!user.location) {
//       return `${BASE_URL}/location`;
//     }
//     if (!user.about) {
//       return `${BASE_URL}/about`;
//     }
//     if (!user.age) {
//       return `${BASE_URL}/age`;
//     }
//     if (!user.gender) {
//       return `${BASE_URL}/gender`;
//     }
//   } catch (error) {
//     console.log(error);
//     if (error.name === "NotFound") {
//       return `${BASE_URL}/photo`;
//     }
//   }
// };
