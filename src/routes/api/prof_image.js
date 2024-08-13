"use server"
import { getRequestEvent } from "solid-js/web"
import { upload_profile_picture } from "./user"
import { verify_user } from "./session_management"
import { Xelosani } from "./models/User"
import { HeadObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "~/entry-server"
import {action} from "@solidjs/router"

export const handle_profile_image = action(async (formData) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${redis_user.profId}-profpic`
        }
        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand); // if Doesn't exists throws error by the name of 403

        const compressed_buffer = await upload_profile_picture(file, redis_user)
        console.log(compressed_buffer)
        if (compressed_buffer) {
            const base64string = Buffer.from(compressed_buffer, "utf-8").toString('base64')
            return `data:image/png;base64,${base64string}`
        }

    } catch (error) {
        console.log(error, error.name, error.message, error.code, "HIII")
        if (error.name === "403") {
            const event = getRequestEvent()
            const redis_user = await verify_user(event) 
            const compressed_buffer = await upload_profile_picture(buffer, redis_user)
            const user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
                $inc: {
                    "stepPercent": 15 
                }
            })

            if (compressed_buffer) {
                const base64string = Buffer.from(compressed_buffer, "utf-8").toString('base64')
                return `data:image/png;base64,${base64string}`
            }
        } 
    }
})
