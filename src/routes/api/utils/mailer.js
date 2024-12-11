"use server"
import nodemailer from "nodemailer"

export const send_email = async (target, code) => {
    try {
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
                    to: target,
                    subject: "ვერიფიკაციის კოდი",
                    html: `
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                        <h2 style="text-align: center;">ვერიფიკაციის კოდი</h2>
                        <p style="text-align: center;">გამოიყენე მოცემული კოდი ვერიფიკაციის გასავლელად:</p>
                        <div style="background-color: #f4f4f4; border-radius: 5px; padding: 20px; text-align: center;">
                            <h3 style="margin-bottom: 20px;">ვერიფიკაციის კოდი:</h3>
                            <p style="font-size: 24px; font-weight: bold;">${code}</p>
                        </div>
                        <p style="text-align: center; margin-top: 20px;">თუ არ მოგითხოვიათ ვერიფიკაციის კოდი, გთხოვთ დააიგნოროთ მეილი.</p>
                        <p style="text-align: center;">მადლობა,<br>შეუკეთე</p>
                    </div>
                    `
                });
    
                return 200
            } catch (error) {
                return 500
            }
        }

        const mail = await main()
        if (!mail) {
            return 500
        } 
        if (mail === 500) {
            return 500
        }

        return 200
    } catch (error) {
        return 500
    }
}
