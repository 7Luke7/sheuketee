"use server"
import { CustomError } from "../utils/errors/custom_errors"
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"
import { HandleError } from "../utils/errors/handle_errors"
import { json } from "@solidjs/router"

export async function POST({request}) {
    try {
        const fd = await request.formData()
        const role = fd.get("role")

        const phoneEmail = fd.get("phoneEmail")
        const field = /^\d{9}$/.test(phoneEmail) ? "phone" : "email"

        let user

        //profId, firstname, lastname
        if (role === "xelosani") {
            const data = await postgresql_server_request(
                "POST",
                `xelosani/find_by_phone_email`,
                {
                    body: JSON.stringify({
                        [field]: phoneEmail,
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
        } else if (role === "damkveti") {
            user = await Damkveti.findOne(
                {...(isPhone ? { phone: phoneEmail } : { email: phoneEmail })}
            , "profId firstname -_id lastname -__t").lean()
        } else {
            throw new Error("როლები არ შეესაბამება")
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