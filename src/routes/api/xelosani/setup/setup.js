"use server"
import { getRequestEvent } from "solid-js/web"
import { Xelosani } from "../../models/User"
import { verify_user } from "../../session_management"
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "~/entry-server"
import {cache} from "@solidjs/router"

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
            await Xelosani.findByIdAndUpdate(redis_user.userId, {
                $set: {
                    phone: inputText,
                },
                $inc: {
                    'stepPercent': 15
                }
            })
        } else {
            await Xelosani.findByIdAndUpdate(redis_user.userId, {
                $set: {
                    email: inputText,
                },
                $inc: {
                    'stepPercent': 15
                }
            })
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
        console.log(error)
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

        const user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
            $set: {
                about: about,
            },
            $inc: {
                'stepPercent': 15
            }
        })

        return 200
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

export const handle_date_select = async (date) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const age = calculateAge(date)

        await Xelosani.findByIdAndUpdate(redis_user.userId, {
            $set: {
                age: age,
            },
            $inc: {
                'stepPercent': 15
            }
        })

        return 200
    } catch (error) {
        if (error) {
            return error.message
        } 
    }
}

function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const currentDate = new Date();
  
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    const dayDiff = currentDate.getDate() - birthDate.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age;
  }
  
  export const check_user_age = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event) 

        if (redis_user === 401) {
            throw new Error(401)
        }

        const user = await Xelosani.findById(redis_user.userId, "age")

        return user.age
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

        await Xelosani.findByIdAndUpdate(
            redis_user.userId,
            {
              $set: {
                gender: gender,
              },
              $inc: {
                'stepPercent': 15
              }
            })

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
        
        const no_id_user = user.skills.map((a) => ({completedJobs: a.completedJobs, reviews: a.reviews}))

        return no_id_user
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

        const skillsArray = skillNames.map(skillName => ({ skillName, reviews: 0, completedJobs: 0 }));

        await Xelosani.findByIdAndUpdate(
            redis_user.userId,
            {
              $push: {
                skills: skillsArray
              },
              $inc: {
                'stepPercent': 15
              }
            })
        
        return 200
    } catch (error) {
        console.log(error)
        if (error) {
            return error.message
        } 
    }
}