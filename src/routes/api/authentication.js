"use server"
import {Damkveti, Xelosani} from "./models/User";
import bcrypt from "bcrypt"
import { json } from "@solidjs/router";
import { create_session } from "./session_management";
import crypto from "crypto"
import { HandleError } from "./utils/errors/handle_errors";
import { CustomError } from "./utils/errors/custom_errors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\d{9}$/

export const LoginUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    
    try {        
        let role;
        let user;
        
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.").ExntendToErrorName("ValidationError")
        }
        
        if (emailRegex.test(phoneEmail)) {
            user = await Xelosani.findOne({ email: phoneEmail }, 'password _id profId');
            if (user) {
                role = 1;
            } else {
                user = await Damkveti.findOne({ email: phoneEmail }, 'password _id profId');
                if (user) {
                    role = 2;
                }
            }
        } else if (phoneRegex.test(phoneEmail)) {
            user = await Xelosani.findOne({ phone: phoneEmail }, 'password _id profId');
            if (user) {
                role = 1;
            } else {
                user = await Damkveti.findOne({ phone: phoneEmail }, 'password _id profId');
                if (user) {
                    role = 2;
                }
            }
        } else {
            throw new CustomError("email", "მეილი ან ტელეფონის ნომერი არასწორია.").ExntendToErrorName("ValidationError")
        }

        if (!user) {
            throw new CustomError("email", "მომხმარებელი მეილით ან ტელეფონის ნომრით არ არსებობს.").ExntendToErrorName("ValidationError");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("password", "პაროლი არასწორია.").ExntendToErrorName("ValidationError");
        }

        const sessionId = await create_session(user.profId, user._id, role);
        
        return json({ message: "წარმატებით შეხვედით.", role: role === 1 ? "xelosani" : "damkveti", profId: user.profId }, {
            status: 200,
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = new HandleError(error).validation_error()
            return {
                errors, 
                status: 400
            }
        } else {
            new HandleError().global_error()
        }
    }
};

export const RegisterUser = async (formData, role) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const rules = formData.get("rules-confirmation")
    
    try {
        if (!rules) {
            throw new CustomError("rules", "გთხოვთ დაეთანხმოთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას.").ExntendToErrorName("ValidationError")
        }

        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.").ExntendToErrorName("ValidationError")
        }

        if (role === "ხელოსანი") {
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt);
            const random_id = crypto.randomUUID()
            const isEmail = emailRegex.test(phoneEmail)
            
            const new_xelosani_credentials  = {
                profId: random_id,
                firstname: firstname.trim(),
                notificationDevices: isEmail ? ["email"] : ["phone"],
                lastname: lastname.trim(),
                ...(isEmail ? { email: phoneEmail } : { phone: phoneEmail }),
                password: hash,
            };
            
            const new_user = await Xelosani.create(new_xelosani_credentials);
            
            const sessionId = await create_session(new_user.profId, new_user._id, 1)
            
            return json({ message: "success", role: "xelosani" }, {
                status: 200,
                headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
                }
            });
        } else {
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt);
            const random_id = crypto.randomUUID()
            const isEmail = emailRegex.test(phoneEmail)

            const new_damkveti_credentials  = {
                profId: random_id,
                firstname: firstname.trim(),
                notificationDevices: isEmail ? ["email"] : ["phone"],
                lastname: lastname.trim(),
                ...(isEmail ? { email: phoneEmail } : { phone: phoneEmail }),
                password: hash,
            };
            
            const new_user = await Damkveti.create(new_damkveti_credentials);
            
            const sessionId = await create_session(new_user.profId, new_user._id, 2)
            
            return json({ message: "success", role: "damkveti"}, {
                status: 200,
                headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = new HandleError(error).validation_error()
            return {
                errors, 
                status: 400
            }
        } else {
            new HandleError().global_error()
        }
    }
}

export const LoginWithFacebook = async (accessToken, userID) => {
    try {
      console.log(accessToken, userID)  
    } catch(error) {
        console.log(error)
    }
}