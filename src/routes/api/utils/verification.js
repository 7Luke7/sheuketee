"use server"
import { redisClient } from "~/entry-server"
import nodemailer from "nodemailer"
import { json } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../session_management"
import { Xelosani } from "../models/User"

export const send_email_verification_code = async () => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
        if (redis_user === 401) throw new Error("მომხმარებელი არ არის შესული.")

        const code = await redisClient.get(redis_user.userId)
        if (code) {
            return json("კოდი უკვე გაგზავნილია მოიცადედ 3 წუთი", {
                status: 400
            })
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        await redisClient.set(redis_user.userId, verificationCode, { PX: 3 * 60 * 1000 });

        const user = await Xelosani.findById(redis_user.userId, 'email')

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
            return "წარმატება"
    } catch (error) {
        console.log(error)  
    }
}

const code_regex = /^\d{4}$/

export const verify_code = async (verify_input) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
        if (redis_user === 401) throw new Error("მომხმარებელი არ არის შესული.")

        const user = await Xelosani.findById(redis_user.userId, 'email')
        
        if (!user) {
            return json("სესია ამოიწურა თავიდან შედით ექაუნთში.", {
                status: 401
            })
        }
        
        if (!user.email) {
            return json("ამჟამად ვერიფიკაცია მხოლოდ მეილით არის შესაძლებელი, გთხოვთ დაამატოთ მეილი.", {
                status: 400
            })
        }
                
        if (!code_regex.test(verify_input)) {
            return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
                status: 400
            })
        }
        const code = await redisClient.get(redis_user.userId);

        if (code !== verify_input) {
            return json("თქვენს მიერ შევსებული კოდი არასწორია.", {
                status: 400
            })
        } 

        await redisClient.del(redis_user.userId)
        return "წარმატება"
    } catch (error) {
        console.log(error)
    }
} 