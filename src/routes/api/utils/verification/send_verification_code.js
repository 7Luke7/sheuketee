import { json } from "@solidjs/router"
import { send_email } from "../mailer";
import { memcached_server_request } from "../ext_requests/memcached_server_request";
import { postgresql_server_request } from "../ext_requests/posgresql_server_request";

export async function POST({request}) {
    try {
        const body = await request.json();
        const role = body.role
        const profId = body.profId

        if (!profId) {
            return json({ message: "პროფილის id სავალდებულოა." }, { status: 400 });
        }
        if (!role) {
            return json({ message: "როლი არ არის მითითებული" }, { status: 400 });
        }

        // const RATE_LIMIT = 3;
        // const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

        // const requestCount = await redisClient.get(`rate-limit:${profId}`);

        // if (requestCount && requestCount >= RATE_LIMIT) {
        //     return json({ message: "თქვენ გადააჭარბეთ მეილების მოთხოვნის ლიმიტს. სცადეთ ისევ 1 საათში." }, { status: 429 });
        // }

        // const code = await redisClient.get(profId);
        // if (code) {
        //     return json({ message: "კოდი უკვე გაგზავნილია. გთხოვთ მოიცადოთ 3 წუთი." }, { status: 400 });
        // }

        const random_id = crypto.randomUUID()
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        await memcached_server_request(
            "POST",
            "verify_code",
            {
                body: JSON.stringify({
                    random_id, 
                    profId,
                    verificationCode,
                    role,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        let user
        
        if (role === "xelosani") {
            const data = await postgresql_server_request(
                "GET",
                `xelosani/find_email_by_profId/${profId}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )   

            user = data
        } else if (role === "damkveti") {
            user = await Damkveti.findOne({profId: profId}, 'email -__t -_id')
        } else {
            throw new Error("როლი არ შეესაბამება.")
        }

        const mail = await send_email(user.email, verificationCode)

        if (mail === 500) {
            throw new Error("დაფიქსირდა შეცდომა მეილის გაგზავნის დროს.")
        }

        return json(random_id,
            {status:200}
        )
    } catch (error) {
        console.log(error)  
    }
}