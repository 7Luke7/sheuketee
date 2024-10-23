"use server"
import { json } from "@solidjs/router"
import bcrypt from "bcrypt";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export async function POST({request}) {
    try {
        const fd = await request.formData()
        const role = JSON.parse(fd.get("role"))
        const new_password = fd.get("new_password");
        const profId = JSON.parse(fd.get("profId"));

        if (!profId) throw new Error("პროფილის id სავალდებულოა.")
        if (!new_password) throw new Error("პაროლი სავალდებულოა.")

        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(new_password, salt);

    
        if (role === "xelosani") {
            await postgresql_server_request(
                "PUT",
                `${role}/password/${profId}`,
                {
                    body: JSON.stringify({
                        password: hash
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        } else if (role === "damkveti") {
            await Damkveti.updateOne({profId: profId}, 
                {$set: {password: hash}}
            )
        } else {
            throw new Error("როლი არ არსებობს")
        }

        return json("პაროლი განახლებულია", {status: 200})
    } catch (error) {
        console.log(error)    
        if (error.message === "400") {
            return json("ხელოსანი ვერ მოიძებნა", {status: 400})
        }
        if (error.name === "TypeError") {
            return json("ხელოსანი ვერ მოიძებნა", {status: 400})
        }
    }
}