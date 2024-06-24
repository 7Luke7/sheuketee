"use server"
import { redisClient, s3 } from "~/entry-server";
import { Damkveti, Xelosani } from "./models/User"
import { compress_image } from "./compress_images";
import { PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRequestEvent } from "solid-js/web";
import { cache, json } from "@solidjs/router";
import bcrypt from "bcrypt"
import { verify_user } from "./session_management";

export const get_account = cache(async () => {
    try {   
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        if (redis_user.role === 1) {
            const user = await Xelosani.findById(redis_user.userId, '-_id -__v -skills -updatedAt -notificationDevices -createdAt -password -gender -date -about -stepPercent -profId')
            return user._doc
        } else if(redis_user.role === 2) {
            const user = await Damkveti.findById(redis_user.userId, '-_id -__v -skills -updatedAt -notificationDevices -createdAt -password -gender -date -about -stepPercent -profId')
            return user._doc
        } else {
            throw new Error("როლი არ არსებობს.")
        }

    } catch (error) {
        if (error.message === "401") {
            return 401
        }
    }
}, "account")

export const get_xelosani = async (prof_id) => {
    try {   
        const event = getRequestEvent()
        const redis_user = await verify_user(event)  

        if (redis_user.profId !== prof_id) {
            throw new Error(401)
        }

        const {createdAt, _doc} = await Xelosani.findById(redis_user.userId, '-_id -__v -updatedAt -profId -notificationDevices -password')
        const profile_image = await get_user_profile_image(prof_id)
        return JSON.stringify({
            ..._doc,
            createdAt: createdAt.toISOString(),
            profile_image,
            status: 200
        })
    } catch (error) {
        if (error.message === "401") {
            const {createdAt, _doc} = await Xelosani.findOne({profId: prof_id}, '-_id -__v -profId -stepPercent -notificationDevices -updatedAt -password')
            const profile_image = await get_user_profile_image(prof_id)
            return JSON.stringify({
            ..._doc,
            createdAt: createdAt.toISOString(),
            profile_image,
            status: 401
        })
        }
    }
}
export const get_user_profile_image = async (id) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${id}-profpic`
        }
        const headCommand = new HeadObjectCommand(params);
        await s3.send(headCommand);

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); 
        return url
    } catch (error) {
        console.log("PROFILE IMAGE", error)
    }
}

export const upload_profile_picture = async (file, redis_user) => {
    try {

        console.log(file)
        //          const buffer = reader.readAsArrayBuffer(file)
        //        const compressed_buffer = await compress_image(buffer, 80, 140, 140)
        //        const params = {
        //            Bucket: process.env.S3_BUCKET_NAME, 
        //            Key: `${redis_user.profId}-profpic`,
        //            Region: "eu-central-1",
        //            Body: compressed_buffer, 
        //            ACL: "private",
        //            ContentType: "webp", 
        //        };
        //        const upload_image = new PutObjectCommand(params) 
        //        await s3.send(upload_image)
        //        return compressed_buffer
    } catch (error) {
        console.log("OUTER ERROR",error) 
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

        if (target === "phone") {
            const updated_xelosani = await Xelosani.findByIdAndUpdate(user_id.userId,
                                                                      [
                {
                    $set: {
                        notificationDevices: {
                            $cond: {
                                if: { $in: [target, "$notificationDevices"] },
                                then: { $filter: { input: "$notificationDevices", cond: { $ne: ["$$this", target] } } },
                                else: { $concatArrays: ["$notificationDevices", [target]] }
                            }
                        }
                    }
                },
            ],
                                                                      { new: true, fields: { notificationDevices: 1 } }
                                                                     );

            if (updated_xelosani.notificationDevices.includes(target)) {
                return 1
            } else {
                return 2
            }
        } else if (target === "email"){
            const updated_xelosani = await Xelosani.findByIdAndUpdate(user_id.userId,
                                                                      [
                {
                    $set: {
                        notificationDevices: {
                            $cond: {
                                if: { $in: [target, "$notificationDevices"] },
                                then: { $filter: { input: "$notificationDevices", cond: { $ne: ["$$this", target] } } },
                                else: { $concatArrays: ["$notificationDevices", [target]] }
                            }
                        }
                    }
                },
            ],
                                                                      { new: true, fields: { notificationDevices: 1 } }
                                                                     );

            if (updated_xelosani.notificationDevices.includes(target)) {
                return 1
            } else {
                return 2
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

        const user = await Xelosani.findById(user_id.userId, "notificationDevices -_id")
        return user.notificationDevices
    } catch (error) {
        console.log(error)
    }
}

export const update_password = async (new_password) => {
    try {
        const event = getRequestEvent()
        const user_id = await verify_user(event)

        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(new_password, salt);
        await Xelosani.findByIdAndUpdate(user_id.userId, {
            $set: {
                'password': hash
            }
        })

        return "წარმატება"
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

        const user = await Xelosani.findById(user_id.userId)
        const validateEmail = (email) => emailRegex.test(email);
        const validatePhone = (phone) => phoneRegex.test(phone);

        const checkExistingEmail = async (email) => {
            if (email && email.length) {
                return await Xelosani.findOne({ email });
            }
            return null;
        };

        const checkExistingPhone = async (phone) => {
            if (phone && phone.length) {
                return await Xelosani.findOne({ phone });
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

            user.stepPercent = Math.ceil(user.stepPercent + 14.28)
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
