"use server"
import { redisClient } from "~/entry-server"
import { get_user_by_session } from "./user_manipulations"
import nodemailer from "nodemailer"
import { json } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"

export const send_email_verification_code = async () => {
    try {
        const event = getRequestEvent()
        const sessionId = event.request.headers.get("cookie").split("sessionId=")[1]

        const user = await get_user_by_session(sessionId)
        const user_id = user._id.toString("hex")
        const code = await redisClient.get(user_id);
        // check if code already sent 
        if (code) {
            return json("კოდი უკვე გაგზავნილია მოიცადედ 3 წუთი", {
                status: 400
            })
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        await redisClient.set(user_id, verificationCode, { PX: 3 * 60 * 1000 });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "pro.chikvaidze@gmail.com",
                pass: "iefh akuy pstk ihvz"
            },
            });

            async function main() {
                try {
                    await transporter.sendMail({
                        from: '"შეუკეთე" <pro.chikvaidze@gmail.com>',
                        to: user.email,
                        subject: "ვერიფიკაციის კოდი",
                        html: `
                                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                            <h2 style="text-align: center;">ვერიფიკაციის კოდი</h2>
                            <p style="text-align: center;">გამოიყენე მოცემული კოდი ვერიფიკაციის გასავლელად:</p>
                            <div style="background-color: #f4f4f4; border-radius: 5px; padding: 20px; text-align: center;">
                                <h3 style="margin-bottom: 20px;">Verification Code:</h3>
                                <p style="font-size: 24px; font-weight: bold;">${verificationCode}</p>
                            </div>
                            <p style="text-align: center; margin-top: 20px;">თუ არ მოგითხოვიათ ვერიფიკაციის კოდი, გთხოვთ დააიგნოროთ მეილი.</p>
                            <p style="text-align: center;">მადლობა,<br>შეუკეთე</p>
                        </div>
                        `
                    });
        
                } catch (error) {
                    console.log(error)
                }
            }
            await main()
            return json("წარმატება", {
                status: 200
            })
    } catch (error) {
        console.log(error)  
    }
}

const code_regex = /^\d{4}$/

export const verify_code = async (verify_input) => {
    try {
        const event = getRequestEvent()
        const sessionId = event.request.headers.get("cookie").split("sessionId=")[1]

        const user = await get_user_by_session(sessionId)

        if (!user().email) {
            return json("ამჟამად ვერიფიკაცია მხოლოდ მეილით არის შესაძლებელი, გთხოვთ დაამატოთ მეილი.", {
                status: 400
            })
        }

        if (!user) {
            return json("სესია ამოიწურა თავიდან შედით ექაუნთში.", {
                status: 401
            })
        }
                
        if (!code_regex.test(verify_input)) {
            return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
                status: 400
            })
        }
        const user_id = user._id.toString("hex")
        const code = await redisClient.get(user_id);

        if (code !== verify_input) {
            return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
                status: 400
            })
        } 

        await redisClient.del(user_id)
        return json("წარმატება", {
            status: 200
        })
    } catch (error) {
        console.log(error)
    }
} 