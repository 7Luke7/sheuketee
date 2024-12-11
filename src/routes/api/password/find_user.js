"use server"
import { CustomError } from "../utils/errors/custom_errors"
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"
import { HandleError } from "../utils/errors/handle_errors"
import { json } from "@solidjs/router"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\d{9}$/

export async function POST({request}) {
    try {
        const fd = await request.formData()
        const phoneEmail = fd.get("phoneEmail")

        let user

        if (emailRegex.test(phoneEmail)) {
            const data = await postgresql_server_request(
                "POST",
                "user/find_by_phone_email",
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
                "user/find_by_phone_email",
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
        if (!user) {
            throw new Error(400)
        }

        // const profImage = await get_s3_image(`${user.profId}-profpic`)

        return json({...user, profImage: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"}, {status: 200})
    } catch (error) {
        const errors = new HandleError(error).validation_error();
        return json(errors, {status: 400})
    }
}