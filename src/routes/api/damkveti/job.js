"use server"
import { getRequestEvent } from "solid-js/web"
import { Damkveti, JobPost } from "../models/User"
import { verify_user } from "../session_management"
import { HandleError } from "../utils/errors/handle_errors"
import crypto from "node:crypto"
import { compress_image } from "../compress_images"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "~/entry-server"

const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024; 
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

const add_job_image = async (buffer, identifier, type) => {
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
        console.log(error)
    }
}

export const create_job = async (fd, location, imageLength, mileStone) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event)

         if (user === 401 || user.role === 1) {
            return 401
        }
        const random_id = crypto.randomUUID()

        if (mileStone) {
            for (let i = 0; i < mileStone.length; i++) {
                const random_id = crypto.randomUUID()
                mileStone[i]["milestoneDisplayId"] = random_id
            }
        } 

        const job_post = await JobPost.create({
            publicId: random_id,
            _creator: user.userId,
            title: fd.get("title"),
            description: fd.get("description"),
            mileStones: mileStone || null,
            price: fd.get("price"),
            location: location
        })
        
        await Damkveti.findByIdAndUpdate(user.userId, {
            $addToSet: { jobs: job_post._id } 
        })

        let count = 0
        
        for (let i = 0; i < imageLength; i++) {
            const image = fd.get(`image${i}`)
            if (image.size > MAX_SINGLE_FILE_SIZE) {
                throw Error(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`)
            }
            count += image.size
            if (count > MAX_TOTAL_SIZE) {
                throw Error("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.")
            }
            const bytes = await image.arrayBuffer(image);
            const buffer = Buffer.from(bytes)
            if (i === 0) {
                const compressed_buffer = await compress_image(buffer, 80, 200, 200);  // mobile has to be added
                await add_job_image(compressed_buffer, `${job_post.publicId}${i}`, 'job-post-thumbnail')  
            } else {
                const compressed_buffer = await compress_image(buffer, 80, 600, 400);  // mobile has to be added
                await add_job_image(compressed_buffer, `${job_post.publicId}${i}`, 'job-post-gallery')
            }
        }

        return 200
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = new HandleError(error).validation_error()
            return {
                errors,
                status: 400
            }
        } else {
            console.log(error)
            return {
                status: 500
            }
        }
    }
}

export const get_location = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event)
 
        if (user === 401 || user.role === 1) {
            return 401
        }
        const {location} = await Damkveti.findById(user.userId, "location -_id -__t").lean()
        return location
    } catch (error) {
        console.log(error)
    }
}