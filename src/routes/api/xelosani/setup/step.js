"use server"
import { getRequestEvent } from "solid-js/web"
import { Xelosani } from "../../models/User"
import { verify_user } from "../../session_management"
import { s3 } from "~/entry-server"
import {upload_profile_picture} from "../../user"
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

export const upload_profile_picture_setup = async (file) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
            
        const buffer = await upload_profile_picture(file, redis_user)
        
        const user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
            $inc: {
                'stepPercent': 15
            }
        })
        
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
        if (!user.skills.length) {
            return `${BASE_URL}/skills`  
        }
    } catch (error) {
        if (error.name === "403") {
            console.log(`${BASE_URL}/photo`)
            return `${BASE_URL}/photo`
        }
    }
}