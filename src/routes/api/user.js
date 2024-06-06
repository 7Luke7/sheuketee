"use server"
import { redisClient, s3 } from "~/entry-server";
import { User } from "./models/User"
import { compress_image } from "./compress_images";
import { PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRequestEvent } from "solid-js/web";
import { json } from "@solidjs/router";
import { get_user_by_session } from "./utils/user_manipulations";
import bcrypt from "bcrypt"
export const get_user = async () => {
    try {   
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        const sess = await redisClient.get(session);
        if (!sess) {
            return 401
        }
        const user_id = JSON.parse(sess) 
        const user = await User.findById(user_id.userId)
        return JSON.stringify(user)
    } catch (error) {
        console.log(error) 
    }
}

export const get_user_profile_image = async () => {
    try {
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        const sess = await redisClient.get(session);
        if (!sess) {
            return null
        }
        const user_id = JSON.parse(sess) 

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${user_id.userId}-profpic`
        }
        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand);

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); 
        return url
    } catch (error) {
        console.log(error)
    }
}

export const upload_profile_picture = async (buffer, session) => {
    try {
        const sess = await redisClient.get(session);
        const user_id = JSON.parse(sess) 
        const compressed_buffer = await compress_image(buffer, 80, 200, 200)
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, 
            Key: `${user_id.userId}-profpic`,
            Region: "eu-central-1",
            Body: compressed_buffer, 
            ACL: "private",
            ContentType: "webp", 
        };
        const upload_image = new PutObjectCommand(params) 
        await s3.send(upload_image)
        return compressed_buffer
    } catch (error) {
        console.log(error) 
    }
}

export const logout_user = async () => {
    try {
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        await redisClient.del(session)
        return json("success", {
            status: 200,
            headers: {
                'Set-Cookie': `sessionId=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const toggle_notification = async (target) => {
    try {
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        const user = await get_user_by_session(session)

        if (target === "phone") {
            const phone_index = user.notificationDevices.findIndex((a) => a === "phone")
            if (typeof phone_index === "number" && phone_index >= 0) {
                user.notificationDevices.splice(phone_index, phone_index + 1)
                await user.save()
                return json("მობილურზე შეტყობინებები გამოირთო", {
                    status: 200
                })
            } else {
                user.notificationDevices.push("phone")
                await user.save()
                return json("მობილურზე შეტყობინებები ჩაირთო", {
                    status: 200
                })
            }
        } else if (target === "email"){
            const email_index = user.notificationDevices.findIndex((a) => a === "email")
            if (typeof email_index === "number" && email_index >= 0) {
                user.notificationDevices.splice(email_index, email_index + 1)
                await user.save()
                return json("მეილზე შეტყობინებები გამოირთო", {
                    status: 200
                })
            } else {
                user.notificationDevices.push("email")
                await user.save()
                return json("მეილზე შეტყობინებები ჩაირთო", {
                    status: 200
                })
            } 
        } else {
            return 500
        }
    } catch (error) {
        console.log(error)
    }
}

export const get_notification_targets = async () => {
    try {
        const event = getRequestEvent()
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        const sess = await redisClient.get(session);
        if (!sess) {
            return 401
        }
        const user_id = JSON.parse(sess) 
        const user = await User.findById(user_id.userId)
        return JSON.stringify(user.notificationDevices)
    } catch (error) {
        console.log(error)
    }
}

export const update_password = async (new_password) => {
    try {
        const event = getRequestEvent()
        const sessionId = event.request.headers.get("cookie").split("sessionId=")[1]
        const user = await get_user_by_session(sessionId)

        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(new_password, salt);

        user.password = hash
        await user.save()
        return json("წარმატება", {
            status: 200
        })
    } catch (error) {
        console.log(error)
    }
}