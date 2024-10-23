'use server'
import { json } from "@solidjs/router";
import { create_session } from "./session_management";
import { HandleError } from "./utils/errors/handle_errors";
import { CustomError } from "./utils/errors/custom_errors";
import bcrypt from "bcrypt"
import { postgresql_server_request } from "./utils/ext_requests/posgresql_server_request";
import { memcached_server_request } from "./utils/ext_requests/memcached_server_request";

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
                `xelosani/login`,
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
                `xelosani/login`,
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
                    role: user.role === "ხელოსანი" ? 1 : 2,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return json({
            message: "წარმატებით შეხვედით.",
            role: user.role === "დამკვეთი" ? "damkveti" : "xelosani",
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
    let isEmail = null

    try {
        if (!firstname.length) {
            throw new CustomError("firstname", "სახელი სავალდებულოა.")
        }
        if (!lastname.length) {
            throw new CustomError("lastname", "გვარი სავალდებულოა.")
        }

        if (emailRegex.test(phoneEmail)) {
            isEmail = true
        } else if (phoneRegex.test(phoneEmail)) {
            isEmail = false
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
        if (role === "xelosani") {
            const column = isEmail ? 'email' : 'phone'
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt);

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
                        role: 1,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            return json({ message: "success", role: "xelosani", profId: data.prof_id }, {
                status: 200,
                headers: {
                    'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt);

            const column = isEmail ? 'email' : 'phone'
            const text = `INSERT INTO damkveti(firstname, lastname, notification_devices, ${column}, password) VALUES($1, $2, $3, $4, $5) RETURNING id, prof_id`
            const values = [firstname.trim(), lastname.trim(), [column], phoneEmail, hash]

            const data = await query(text, values)
            const sessionId = await create_session(data.rows[0].prof_id, data.rows[0].id, 2)

            return json({ message: "success", role: "damkveti", profId: data.rows[0].prof_id}, {
                status: 200,
                headers: {
                    'Set-Cookie': `sessionId=${sessionId}; Path=/; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
                    'Content-Type': 'application/json'
                }
            });
        }
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
