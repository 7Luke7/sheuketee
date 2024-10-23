import { makeAbortable } from "@solid-primitives/resource";
import { Show, createSignal } from "solid-js"
import spinnerSVG from "../../../../svg-images/spinner.svg";
import { useNavigate } from "@solidjs/router";

const FindUser = (props) => {
    const [error, setError] = createSignal()
    const [user, setUser] = createSignal()
    const [signal,abort,filterErrors] = makeAbortable({timeout: 0, noAutoAbort: true});
    const [isSendingRequest, setIsSendingRequest] = createSignal(false)
    
    const navigate = useNavigate()

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^\d{9}$/;
    const role = props.params.role

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const formData = new FormData(e.target)
            const phoneEmail = formData.get("phoneEmail")

            if (!emailRegex.test(phoneEmail) && !phoneRegex.test(phoneEmail)) {
                return setError([{
                    field: "phoneEmail",
                    message: "მეილი ან ტელეფონის ნომერი არასწორია."
                }])
            }

            formData.append("role", role)
            setIsSendingRequest(true)
            const response = await fetch(`/api/password/find_user`, {
                method: "POST",
                body: formData,
                signal: signal()
            })
            const data = await response.json()
            if (response.status === 400) {
                console.log([{
                    field: data[0].field,
                    message: data[0].message
                }])
                return setError([{
                    field: data[0].field,
                    message: data[0].message
                }])
            }

            setIsSendingRequest(false)
            console.log(data)
            setUser(data) 
        } catch (error) {
            filterErrors(error)
            console.log(error)
        } finally {
            setIsSendingRequest(false)
        }
    }

    const changePasswordHandler = async () => {
        try {
            const response = await fetch(`/api/utils/verification/send_verification_code`, {
                method: "POST",
                body: JSON.stringify({role, profId: user().prof_id}),
                headers: {
                    "Content-Type": "application/json"
                }  
            })
            if (!response.ok) {
                throw new Error(500)
            }

            localStorage.setItem("otpExpirationTime", Date.now() + 3 * 60 * 1000);

            const data = await response.json()
            navigate(`/resetpassword/${role}/${user().prof_id}/${data}`)
        } catch (error) {
            console.log(error)
        }
    }
    
    return <div class="w-full">
        <form onSubmit={handleEmailSubmit}>
        <div class="flex items-end justify-between">
        <div>
        <h1 class="font-bold mb-5 text-slate-900 text-xl font-[bolder-font]">
            თქვენი ექაუნთის ძებნა როგორც {role === "xelosani" ? "ხელოსანი" : role === "დამკვეთი" && "დამკვეთი"}
        </h1>
        <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email-mobile">
            მეილი ან ტელ.ნომერი
        </label>
        </div>
        <Show when={user()}>
        <div class="flex gap-y-1 flex-col items-center">
            <p class="text-gray-900 font-bold font-[normal-font] text-sm">თქვენ ხომ არ ხართ?</p>
            <img src={user().profImage} width={80} height={80} class="rounded-full"></img>
            <div class="flex gap-x-2 justify-center">
                <p class="text-gray-700 font-[normal-font] text-sm font-bold">{user().firstname}</p>
                <p class="text-gray-700 font-[normal-font] text-sm font-bold">{user().lastname}</p>
            </div>
            <button type="button" onClick={changePasswordHandler} class="text-dark-green underline">პაროლის შეცვლა</button>
        </div>
        </Show>
        </div>
        <input
            class={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error()?.some(a => a.field === "phoneEmail") ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight mb-2 focus:outline-none focus:bg-white focus:border-gray-500`}
            id="grid-email-mobile"
            type="text"
            name="phoneEmail"
            placeholder="example@gmail.com ან 555555555"
            />
        <Show when={error()?.some(a => a.field === "phoneEmail")}>
            <p class="text-xs mb-2 text-red-500 mt-1 font-[thin-font] font-bold">
                {error().find(a => a.field === "phoneEmail").message}
            </p>
        </Show>
        {isSendingRequest() ? (
                <button
                  type="button"
                  id="abort-service-update"
                  onClick={(e) => {
                    e.preventDefault()
                    abort()
                  }}
                  class="font-[thin-font] text-center text-lg w-full font-bold bg-gray-600 text-white px-3 py-2 rounded-[16px]"
                >
                  <div class="flex items-center justify-center">
                    <img
                      src={spinnerSVG}
                      class="animate-spin mr-2"
                      alt="იტვირთება..."
                    />
                    <p class="font-[normal-font] font-bold text-base text-gray-200">
                      გაუქმება
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  class="font-[thin-font] text-center text-lg w-full font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]"
                >
                  ექაუნთის ძებნა
                </button>
              )}
        </form>
        <Show when={error()?.some(a => a.field === "main")}>
            <p class="text-xs mb-2 text-red-500 mt-1 font-[thin-font] font-bold">
                {error().find(a => a.field === "main").message}
            </p>
        </Show>
    </div>
}

export default FindUser