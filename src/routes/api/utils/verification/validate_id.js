"use server"
import { json } from "@solidjs/router"
import { memcached_server_request } from "../ext_requests/memcached_server_request"

export async function POST({request}) {
    try {
        const body = await request.json()
        const profId = body.profId
        const randomId = body.randomId
        
        
        const vsession = await memcached_server_request(
            "GET",
            `validate_id/${profId}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (vsession === "empty") {
            throw new Error(400)
        }
        const parsed_session = JSON.parse(vsession)

        if (parsed_session.random_id !== randomId) {
            throw new Error(400)
        }

        return json("წარმატებული", {
            status: 200
        })
    } catch (error) {
        if (error.message === "400") {
            return json("თქვენ მოხვდით არასწორ გვერდზე, დაბრუნდით უკან.", {status: 400})
        }
    }
}