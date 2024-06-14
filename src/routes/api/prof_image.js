"use server"
import { getRequestEvent } from "solid-js/web"
import { upload_profile_picture } from "./user"
import { verify_user } from "./session_management"
import { Xelosani } from "./models/User"
import { HeadObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "~/entry-server"

export const handle_profile_image = async (buffer) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${redis_user.profId}-profpic`
        }
        
        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand); // if Exists throws error by the name of 403
        
        const image_buffer = await upload_profile_picture(buffer, redis_user)
        if (image_buffer === 200) {
            return 200
        }
        
    } catch (error) {
        if (error.name === "403") {
            const event = getRequestEvent()
            const redis_user = await verify_user(event) 
            const image_buffer = await upload_profile_picture(buffer, redis_user)
            const user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
                $inc: {
                    "stepPercent": 15 
                }
            })
        
            return 200
        } 
        console.log(error)
    }
}