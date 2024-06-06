"use server"
import {User} from "./models/User";
import bcrypt from "bcrypt"
import { json } from "@solidjs/router";
import { create_session } from "./session_management";
import crypto from "crypto"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;

export const LoginUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    
    try {
        if (!emailRegex.test(phoneEmail) && !phoneRegex.test(phoneEmail)) {
            throw new Error("მეილი ან ტელეფონის ნომერი არასწორია.");
        }
        
        if (password.length < 8) {
            throw new Error("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.");
        }

        let user;
        if (emailRegex.test(phoneEmail)) {
            user = await User.findOne({ email: phoneEmail });
        } else if (phoneRegex.test(phoneEmail)) {
            user = await User.findOne({ phone: phoneEmail });
        }

        if (!user) {
            throw new Error("მომხმარებელი ვერ მოიძებნა.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("პაროლი არასწორია.");
        }

        const sessionId = await create_session(user._id);
        
        return json(JSON.stringify({ message: "წარმატებით შეხვედით." }), {
            status: 200,
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return {
            error: error.message
        }
    }
};

export const RegisterUser =  async (formData, role) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const rules = formData.get("rules-confirmation")

    try {
        if (!firstname.length > 0) {
            throw new Error("სახელი უნდა შეიცავდეს მინიმუმ 1 ასოს.");            
        }
        
        if (!lastname.length > 0) {
            throw new Error("გვარი უნდა შეიცავდეს მინიმუმ 1 ასოს.");            
        }

        if (!emailRegex.test(phoneEmail) && !phoneRegex.test(phoneEmail)) {
            throw new Error("მეილი ან ტელეფონის ნომერი არასწორია.");
        }

        if (emailRegex.test(phoneEmail)) {
            if (role === "ხელოსანი") {
                const check_user = await User.findOne({email: phoneEmail, role: "ხელოსანი"})
                if (check_user) {
                    throw new Error("ხელოსანი მეილით უკვე არსებობს.")
                }
            } else if (role === "დამკვეთი")  {
                const check_user = await User.findOne({email: phoneEmail, role: "დამკვეთი"})
                if (check_user) {
                    throw new Error("დამკვეთი მეილით უკვე არსებობს.")
                }
            } else {    
                throw new Error("როლი არ არსებობს უნდა დაფიქსირდა შეცდომა გთხოვთ ცადოთ თავიდან.")
            }
        } else if(phoneRegex.test(phoneEmail)) {
            if (role === "ხელოსანი") {
                const check_user = await User.findOne({phone: phoneEmail, role: "ხელოსანი"})
                if (check_user) {
                    throw new Error("ხელოსანი ტელ. ნომრით უკვე არსებობს.")
                }
            } else if (role === "დამკვეთი")  {
                const check_user = await User.findOne({phone: phoneEmail, role: "დამკვეთი"})
                if (check_user) {
                    throw new Error("დამკვეთი ტელ. ნომრით უკვე არსებობს.")
                }
            } else {
                throw new Error("როლი არ არსებობს უნდა დაფიქსირდა შეცდომა გთხოვთ ცადოთ თავიდან.")
            }
        }

        if (password.length < 8) {
            throw new Error("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.");
        }
        if (!rules) {
            throw new Error("გთხოვთ დაეთანხმეთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას.");
        }

        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(password, salt);

        const random_id = crypto.randomUUID()

        const userData = {
            role,
            profId: random_id,
            firstname: firstname.trim(),
            notificationDevices: emailRegex.test(phoneEmail) ? ["email"] : ["phone"],
            lastname: lastname.trim(),
            ...(emailRegex.test(phoneEmail) ? { email: phoneEmail } : { phone: phoneEmail }),
            password: hash,
        };
        
        const new_user = new User(userData);
            
        await new_user.save();
        const sessionId = await create_session(new_user.profId, new_user._id)
        
        return json({ message: "Successfully registered" }, {
            status: 200,
            headers: {
              'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=strict; Max-Age=${7 * 24 * 60 * 60}`,
              'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return {
            error: error.message
        };
    }
}