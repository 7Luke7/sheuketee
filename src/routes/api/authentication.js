"use server"
import {Damkveti, User, Xelosani} from "./models/User";
import bcrypt from "bcrypt"
import { json } from "@solidjs/router";
import { create_session } from "./session_management";
import { HandleError } from "./utils/errors/handle_errors";
import { CustomError } from "./utils/errors/custom_errors";
import crypto from "node:crypto"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\d{9}$/

export const LoginUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");

    try {
        if (!phoneEmail.length) {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.")
                .ExntendToErrorName("ValidationError");
        }

        let user = null;

        if (emailRegex.test(phoneEmail)) {
            user = await User.findOne({ email: phoneEmail }, 'password _id profId role');
        } else if (phoneRegex.test(phoneEmail)) {
            user = await User.findOne({ phone: phoneEmail }, 'password _id profId role');
        } else {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }

        if (!user) {
            throw new CustomError("phoneEmail", "მომხმარებელი მეილით ან ტელეფონის ნომრით არ არსებობს.")
                .ExntendToErrorName("ValidationError");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("password", "პაროლი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }

        const sessionId = await create_session(user.profId, user._id, user.role === "ხელოსანი" ? 1 : 2);

        return json({
            message: "წარმატებით შეხვედით.",
            role: user.role === "დამკვეთი" ? "damkveti" : "xelosani",
            profId: user.profId,
            status: 200
        },{
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
            },
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = new HandleError(error).validation_error();
            return {
                errors,
                status: 400
            };
        } else {
            new HandleError().global_error();
            return {
                message: "შიდა სისტემური შეცდომა.",
                status: 500
            };
        }
    }
};


export const RegisterUser = async (formData, role) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const rules = formData.get("rules-confirmation")
    let isEmail = null
    console.log(firstname, phoneEmail, password, lastname, rules)

    try {
        if (!firstname.length) {
            throw new CustomError("firstname", "სახელი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }
        if (!lastname.length) {
            throw new CustomError("lastname", "გვარი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }

        if (emailRegex.test(phoneEmail)) {
            isEmail = true
        } else if (phoneRegex.test(phoneEmail)) {
            isEmail = false
        } else {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
                .ExntendToErrorName("ValidationError");
        }
        
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.").ExntendToErrorName("ValidationError")
        }

        if (!rules) {
            throw new CustomError("rules", "გთხოვთ დაეთანხმოთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას.").ExntendToErrorName("ValidationError")
        }

        if (role === "ხელოსანი") {
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt);
            const random_id = crypto.randomUUID()

            const new_xelosani_credentials  = {
                role: role,
                profId: random_id,
                firstname: firstname.trim(),
                notificationDevices: isEmail ? ["email"] : ["phone"],
                lastname: lastname.trim(),
                ...(isEmail ? { email: phoneEmail } : { phone: phoneEmail }),
                password: hash,
            };
            
            const new_user = await Xelosani.create(new_xelosani_credentials);

            const sessionId = await create_session(new_user.profId, new_user._id, 1)

            return json({ message: "success", role: "xelosani", profId: random_id }, {
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

            const new_damkveti_credentials  = {
                role: role,
                profId: random_id,
                firstname: firstname.trim(),
                notificationDevices: isEmail ? ["email"] : ["phone"],
                lastname: lastname.trim(),
                ...(isEmail ? { email: phoneEmail } : { phone: phoneEmail }),
                password: hash,
            };

            const new_user = await Damkveti.create(new_damkveti_credentials);

            const sessionId = await create_session(new_user.profId, new_user._id, 2)

            return json({ message: "success", role: "damkveti", profId: random_id}, {
                status: 200,
                headers: {
                    'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            const errors = new HandleError({field: "phoneEmailRegister", message: "მომხმარებელი მეილით ან ტელეფონის ნომრით უკვე არსებობს.", name: "ValidationError" }).validation_error()
            return {
                errors,
                status: 400
            }
        }
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
