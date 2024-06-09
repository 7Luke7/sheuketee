"use server"
import { redisClient, s3 } from "~/entry-server";
import { User } from "./models/User"
import { compress_image } from "./compress_images";
import { PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRequestEvent } from "solid-js/web";
import { cache, json } from "@solidjs/router";
import { create_serializable_object, create_serializable_object_secure } from "./utils/user_manipulations";
import bcrypt from "bcrypt"
import { verify_user } from "./session_management";

export const get_account = cache(async () => {
    try {   
        const event = getRequestEvent()
        const user_id = await verify_user(event) 
    
        const user = await User.findById(user_id.userId)
        const serialized_user = create_serializable_object_secure(user)

        return {
            ...serialized_user,
            status: 200
        }
        } catch (error) {
        console.log("GET USER", error)
    }
}, "account")

export const get_user = cache(async (prof_id) => {
    try {   
        const event = getRequestEvent()
        const redis_user = await verify_user(event)  

        if (redis_user.profId !== prof_id) {
            throw new Error(401)
        }

        const user = await User.findById(redis_user.userId)
        const serialized_user = create_serializable_object(user)
        return {...serialized_user, status: 200}
    } catch (error) {
        if (error.message === "401") {
            const user = await User.findOne({profId: prof_id})
            const serialized_user = create_serializable_object_secure(user)
            return {...serialized_user, status: 401}
        }
        console.log("GET USER", error)
    }
}, "user")

export const get_user_profile_image = cache(async (id) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
        
        if (redis_user === 401) {
            throw new Error("401")
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${redis_user.profId}-profpic`
        }
        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand);
       
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); 
        return json(url, {
            status: 200
        })
    } catch (error) {
        if (error.message === "401") {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Region: "eu-central-1",
                Key: `${id}-profpic`
            }
            const headCommand = new HeadObjectCommand(params);
            await s3.send(headCommand);
           
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); 
            return json(url, {
                status: 200
            })
        }
        console.log("PROFILE IMAGE", error)
    }
}, "profpic")

export const upload_profile_picture = async (buffer, redis_user) => {
    try {
        const compressed_buffer = await compress_image(buffer, 80, 200, 200)
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, 
            Key: `${redis_user.profId}-profpic`,
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
        const user_id = await verify_user(event)
 
        const user = await User.findById(user_id.userId)

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
        const user_id = await verify_user(event)
 
        const user = await User.findById(user_id.userId)
        return JSON.stringify(user.notificationDevices)
    } catch (error) {
        console.log(error)
    }
}

export const update_password = async (new_password) => {
    try {
        const event = getRequestEvent()
        const user_id = await verify_user(event)
 
        const user = await User.findById(user_id.userId)
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;

export const modify_user = async (firstname, lastname, email, phone) => {
    try {
        const event = getRequestEvent();
        const user_id = await verify_user(event)
 
        const user = await User.findById(user_id.userId)
        const validateEmail = (email) => emailRegex.test(email);
        const validatePhone = (phone) => phoneRegex.test(phone);

        const checkExistingEmail = async (email) => {
            if (email && email.length) {
                return await User.findOne({ email });
            }
            return null;
        };

        const checkExistingPhone = async (phone) => {
            if (phone && phone.length) {
                return await User.findOne({ phone });
            }
            return null;
        };

        let message;

        if (phone && !validatePhone(phone)) {
            message = "ტელეფონის ნომერი არასწორია.";
        } else if (email && !validateEmail(email)) {
            message = "მეილი არასწორია.";
        }

        if (message) {
            user.firstname = firstname;
            user.lastname = lastname;

            await user.save();

            return json({
                state: "წარმატება",
                message
            }, {
                status: 200
            });
        }

        const check_email = await checkExistingEmail(email);
        const check_phone = await checkExistingPhone(phone);

        if (check_email) {
            message = "მეილი უკვე არსებობს.";
        } else if (check_phone) {
            message = "ტელეფონის ნომერი უკვე არსებობს.";
        } else {
            user.firstname = firstname;
            user.lastname = lastname;
            if (email && email.length) user.email = email;
            if (phone && phone.length) user.phone = phone;

            await user.save();
            return json({
                state: "წარმატება",
                message
            }, {
                status: 200
            });
        }

        return json({
            state: "წარუმატებელი",
            message
        }, {
            status: 400
        });

    } catch (error) {
        console.log(error);
        return json({
            state: "წარუმატებელი",
            message: "შიდა შეცდომა"
        }, {
            status: 500
        });
    }
};
