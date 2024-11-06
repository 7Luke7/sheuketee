"use server"
import { json } from "@solidjs/router"
import { verify_user } from "./session_management"
import { getRequestEvent } from "solid-js/web"
import { postgresql_server_request } from "./utils/ext_requests/posgresql_server_request"

export async function POST({request}) {
    try {   
        const user = await verify_user({request})
        if (user === 401) {
            return 401
        }

        const body = await request.json()
        const privacyData = body.split("-")
        const field = privacyData[0]
        const value = privacyData[1]
        
        if (user.role === "damkveti") {
            await Damkveti.findByIdAndUpdate(user.userId, {
                $set: { [`privacy.${field}`]: value } 
            }, {$new: false})

            return json("ოპერაცია წარმატებით შესრულდა.", {
                status: 200
            })
        }

        const privacy = await postgresql_server_request(
            "PUT",
            `xelosani/privacy`,
            {
                body: JSON.stringify({
                    userId: user.userId,
                    field,
                    value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return json("ოპერაცია წარმატებით შესრულდა.", {
            status: 200
        })
    } catch(error){
        console.log(error)
    }
}

export const get_privacy = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event)

        if (user === 401) {
             return 401
        }

        if (user.role === "damkveti") {
            const privacy = await postgresql_server_request(
                "POST",
                `xelosani/privacy`,
                {
                    body: JSON.stringify({
                        userId: user.userId,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            return privacy
        }
        const privacy = await postgresql_server_request(
            "POST",
            `xelosani/privacy`,
            {
                body: JSON.stringify({
                    userId: user.userId,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return privacy
    } catch (error) {
        console.log(error)
    }
}