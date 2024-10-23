'use server'
import {getRequestEvent} from "solid-js/web"
import {verify_user} from "../../session_management" 

export const modify_user_date = async (date) => {
    try {
        const event = getRequestEvent()
        const redis_user = await verify_user(event)
        
        const update_user = await Xelosani.findByIdAndUpdate(redis_user.userId, {
            date: date
        })        
        
        return 200
    }catch(error) {
        console.log(error)
    }
}
