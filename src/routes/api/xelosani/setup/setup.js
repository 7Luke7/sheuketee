"use server"
import { getRequestEvent } from "solid-js/web"
import { Xelosani } from "../../models/User"
import { verify_user } from "../../session_management"
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "~/entry-server"
import {cache} from "@solidjs/router"
import {CustomError} from "../../utils/errors/custom_errors"
import {HandleError} from "../../utils/errors/handle_errors"

export const get_xelosani_step = cache(async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)

        const user = await Xelosani.findById(redis_user.userId, 'stepPercent')

        return user.stepPercent
    } catch (error) {
        console.log(error)
    }
}, "xelosani_step")

export const profile_image_no_id = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Region: "eu-central-1",
            Key: `${redis_user.profId}-profpic`
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

export const handle_contact = async (formData, contact) => {
    try {
        const inputText = formData.get("input") 
        if (contact === "phone") {
            if (!phoneRegex.test(inputText)) {
                throw new Error("ტელეფონის ნომერი არასწორია.")
            }
        } else {
            if (!emailRegex.test(inputText)) {
                throw new Error("მეილი არასწორია.")
            }
        }

        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findOne({
            $or: [
                { phone: contact === "phone" ? inputText : null },
                { email: contact === "email" ? inputText : null }
            ],
            _id: { $ne: redis_user.userId }
        });

        if (user) {
            if (contact === "phone" && user.phone === inputText) {
                throw new Error("მომხმარებელი ტელეფონის ნომრით უკვე არსებობს.");
            } else if (contact === "email" && user.email === inputText) {
                throw new Error("მომხმარებელი მეილით უკვე არსებობს.");
            }
        }

        if (contact === "phone") {
            await Xelosani.updateOne({_id: redis_user.userId}, {
                $set: {
                    phone: inputText,
                },
                $inc: {
                    'stepPercent': 15
                }
            }, {runValidators: true})
        } else {
            await Xelosani.updateOne({_id: redis_user.userId}, {
                $set: {
                    email: inputText,
                },
                $inc: {
                    'stepPercent': 15
                }
            }, {runValidators: true})
        }

        return 200
    } catch (error) {
        if (error.message === "401") {
            return 401
        }
        return error.message
    }
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;
export const check_contact = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, 'phone email')

        if (user.email && !user.phone) {
            return "phone"
        } else if (user.phone && !user.email) {
            return "email"
        } else {
            return "fine"
        }
    } catch (error) {
        if (error.message === "401") {
            return 401
        }
        console.log(error)
    }
}

export const check_about = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, "about")

        return user.about
    } catch (error) {
        if (error.message === "401") {
            return 401
        }
    }
}

export const handle_about = async (formData) => {
    try {
        const about = formData.get("about")
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.updateOne({_id: redis_user.userId}, {
            $set: {
                about: about,
            },
            $inc: {
                'stepPercent': 15
            }
        }, {runValidators: true})

        return 200
    } catch (error) {
        if (error.name === "ValidationError") {
            const handled_error = new HandleError(error).validation_error()
            return {...handled_error[0], status:400}
        }
        return error.message
    }
}

export const handle_date_select = async (date) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        await Xelosani.updateOne(
            { _id: redis_user.userId },
            {
                $set: { date: date },
                $inc: { stepPercent: 15 }
            }, {runValidators: true}
        );


        return 200
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const check_user_age = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, "date")

        return user.date
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}  

export const handle_user_gender = async (gender) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        await Xelosani.updateOne(
            { _id: redis_user.userId },
            {
                $set: {
                    gender: gender,
                },
                $inc: {
                    'stepPercent': 15
                }
            }, {runValidators: true}
        );


        return 200
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const check_user_gender = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, 'gender');

        return user.gender;
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const check_selected_jobs = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, 'skills');
        
        if (!user.skills) {
            return 200
        }

        return 400
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const handle_selected_skills = async (skillNames) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const skillsArray = skillNames.map(skillName => ({ skillName }));

        await Xelosani.updateOne({_id: redis_user.userId},
                                 {
            $push: {
                skills: skillsArray
            },
            $inc: {
                'stepPercent': 15
            }
        }, {runValidators: true})


        return 200
    } catch (error) {
        console.log(error)
        if (error) {
            return error.message
        } 
    }
}

export const handle_location = async (location) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }
        if (!location) {
            throw new Error("აირჩიე ლოკაცია")
        }

        await Xelosani.updateOne({_id: redis_user.userId}, {
            $set: {
                'location': location
            },
            $inc: {
                'stepPercent': 15
            }
        })

        return 200
    } catch(error) {
        console.log(error)
    }
}

export const check_location = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, 'location');

        if (user.location) {
            return 400
        }

        return 200 
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const check_user_schedule = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, 'schedule');

        if (user.schedule) {
            return 400
        }

        return 200 
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const add_user_schedule = async (formData) => {
    const insertableObject = {
        monday: {
            startTime: formData.get("ორშაბათი-საწყისი-დრო"),
            endTime: formData.get("ორშაბათი-სასრული-დრო")
        },
        tuesday: {
            startTime: formData.get("სამშაბათი-საწყისი-დრო"),
            endTime: formData.get("სამშაბათი-სასრული-დრო")
        },
        wednesday: {
            startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
            endTime: formData.get("ოთხშაბათი-სასრული-დრო")
        },
        thursday: {
            startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
            endTime: formData.get("ხუთშაბათი-სასრული-დრო")
        },
        friday: {
            startTime: formData.get("პარასკევი-საწყისი-დრო"),
            endTime: formData.get("პარასკევი-სასრული-დრო")
        },
        saturday: {
            startTime: formData.get("შაბათი-საწყისი-დრო"),
            endTime: formData.get("შაბათი-სასრული-დრო")
        },
        sunday: {
            startTime: formData.get("კვირა-საწყისი-დრო"),
            endTime: formData.get("კვირა-სასრული-დრო")
        }
    }

    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        await Xelosani.updateOne({_id: redis_user.userId}, {
            $set: {
                'schedule': insertableObject
            },
            $inc: {
                'stepPercent': 15
            }
        })

        return 200
    } catch(error) {
        console.log(error)
    }
}