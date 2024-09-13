"use server"
import { getRequestEvent } from "solid-js/web"
import { Xelosani } from "../../models/User"
import { verify_user } from "../../session_management"
import { s3 } from "~/entry-server"
import {upload_profile_picture} from "../../user"
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
export const upload_profile_picture_setup = async (file) => {
    console.log(file)
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)

        const buffer = fs.readFile(file.name,)
        console.log("BUFFER: ", buffer)
        const compressed_buffer = await compress_image(buffer, 80, 140, 140);
    
        console.log(compressed_buffer, Buffer.from(compressed_buffer).toString())
        return 200
    } catch (error) {
        console.log(error)
    }
}

export const navigateToStep = async () => {
    const BASE_URL = "/setup/xelosani/step"
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
        const user = await Xelosani.findById(redis_user.userId)

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${redis_user.profId}-profpic`
        }

        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand);

        if (!user.phone) {
            return `${BASE_URL}/contact`
        }
        if (!user.email) {
            return `${BASE_URL}/contact` 
        }
        if (!user.location) {
            return `${BASE_URL}/location`  
        }
        if (!user.about) {
            return `${BASE_URL}/about`  
        }
        if (!user.age) {
            return `${BASE_URL}/age`  
        }
        if (!user.gender) {
            return `${BASE_URL}/gender`  
        }
        if (!user.schedule) {
            return `${BASE_URL}/schedule`
        }
        if (!user.skills.length) {
            return `${BASE_URL}/skills`
        }
    } catch (error) {
        if (error.name === "NotFound") {
            return `${BASE_URL}/photo`
        }
    }
}
