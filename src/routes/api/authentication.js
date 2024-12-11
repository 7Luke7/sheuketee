'use server'
import { json } from "@solidjs/router";
import { HandleError } from "./utils/errors/handle_errors";
import { CustomError } from "./utils/errors/custom_errors";
import { postgresql_server_request } from "./utils/ext_requests/posgresql_server_request";
import { memcached_server_request } from "./utils/ext_requests/memcached_server_request";
import bcrypt from "bcrypt"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\d{9}$/

export const LoginUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");

    try {
        if (!phoneEmail.length) {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
        }
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.")
        }

        let user = null;

        if (emailRegex.test(phoneEmail)) {
            const data = await postgresql_server_request(
                "POST",
                "login",
                {
                    body: JSON.stringify({
                        email: phoneEmail,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            if (data.status !== 200) {
                throw new CustomError(data.field, data.message)
            }

            user = data
        } else if (phoneRegex.test(phoneEmail)) {
            const data = await postgresql_server_request(
                "POST",
                "login",
                {
                    body: JSON.stringify({
                        phone: phoneEmail,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            
            if (data.status !== 200) {
                throw new CustomError(data.field, data.message)
            }
            user = data
        } else {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("password", "პაროლი არასწორია.")
        }

        const sessionId = await memcached_server_request(
            "POST",
            "session",
            {
                body: JSON.stringify({
                    profId: user.prof_id, 
                    userId: user.id,
                    role: user.role
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return json({
            message: "წარმატებით შეხვედით.",
            role: user.role,
            profId: user.prof_id,
            status: 200
        },{
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
            },
        })
    } catch (error) {
        const errors = new HandleError(error).validation_error();
        console.log(errors)
        return {
            errors,
            status: 400
        };
    }
};

export const RegisterUser = async (formData, role) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const rules = formData.get("rules-confirmation")
    let column

    try {
        if (!firstname.length) {
            throw new CustomError("firstname", "სახელი სავალდებულოა.")
        }
        if (!lastname.length) {
            throw new CustomError("lastname", "გვარი სავალდებულოა.")
        }

        if (emailRegex.test(phoneEmail)) {
            column = "email"
        } else if (phoneRegex.test(phoneEmail)) {
            column = "phone"
        } else {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
        }
        
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.")
        }

        if (!rules) {
            throw new CustomError("rules", "გთხოვთ დაეთანხმოთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას.")
        }
        // Check for role not being equal to "xelosani" or "damkveti" throw error
            
        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(password, salt);
        if (role !== "xelosani" && role !== "damkveti") {
            throw new CustomError("role", "როლი არ არსებობს.")
        }

        const data = await postgresql_server_request(
            "POST",
            `${role}/register`,
            {
                body: JSON.stringify({
                    firstname: firstname.trim(), 
                    lastname: lastname.trim(),
                    notification_devices: column,
                    [column]: phoneEmail,
                    password: hash
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (data.status !== 200) {
            throw new CustomError(data.field, data.message)
        }
        const sessionId = await memcached_server_request(
            "POST",
            "session",
            {
                body: JSON.stringify({
                    profId: data.prof_id, 
                    userId: data.id,
                    role
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return json({ message: "success", role, profId: data.prof_id }, {
            status: 200,
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        const errors = new HandleError(error).validation_error();
        return {
            errors,
            status: 400
        };
    }
}

export const LoginWithFacebook = async (accessToken, userID) => {
    try {
        console.log(accessToken, userID)  
    } catch(error) {
        console.log(error)
    }
}
