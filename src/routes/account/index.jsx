import { createAsync } from "@solidjs/router"
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import eyeFillSVG from "../../../public/svg-images/eye-fill.svg"
import eyeSlashSVG from "../../../public/svg-images/eye-slash.svg"
import { get_account, modify_user, update_password } from "~/routes/api/user";
import { send_email_verification_code, verify_code } from "../api/utils/verification";
import exclamationSVG from "../../../public/svg-images/exclamation.svg"

const Account = () => {
    const user = createAsync(get_account)
    const [editing, setEditing] = createSignal(false)
    const [showReset, setShowReset] = createSignal(false)
    const [timer, setTimer] = createSignal()
    const [error, setError] = createSignal()
    const [showPasswordForm, setShowPasswordForm] = createSignal(false)
    const [displayNewPassword, setDisplayNewPassword] = createSignal(false)
    const [displayRepeatPassword, setDisplayRepeatPassword] = createSignal(false)
    const [message, setMessage] = createSignal()

    let firstname;

    const editUser = async (event) => {
        event.preventDefault()
        try {
            if (editing()) {
                const formData = new FormData(event.target)
                const firstnamee = formData.get("firstname")
                const lastname = formData.get("lastname")
                const email = formData.get("email")
                const phone = formData.get("mobile")

                const response = await modify_user(firstnamee, lastname, email, phone)
                setMessage(response.message)
                if (response.state === "წარმატება") {
                    return setEditing(false)
                }
            } else {
                setEditing(true)
                firstname.focus()
            }
        } catch (error) {
            console.log(error)
        }
    }

    createEffect(() => {
        const interval_id = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval_id);
    })

    const showResetHandler = async () => {
        if (!user().email) return alert("ამჟამად ვერიფიკაცია მხოლოდ მეილით არის შესაძლებელი, გთხოვთ დაამატოთ მეილი.")
        try {
            setShowReset(true)
            const response = await send_email_verification_code()
            if (response === "წარმატება") {
                setTimer(180)
            }
            if (response === "კოდი უკვე გაგზავნილია მოიცადედ 3 წუთი") {
                setError(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const response = await verify_code(formData.get("verify"))
            if (response === "წარმატება") {
                setShowPasswordForm(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePasswordReset = async (event) => {
        event.preventDefault()
        try {
            const formData = new FormData(event.target);
            const new_password = formData.get("new_password")
            const repeat_password = formData.get("repeat_password")
            if (new_password.length < 8 || repeat_password.length < 8) {
                return alert("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს!")
            }
            if (new_password !== repeat_password) {
                return alert("პაროლები არ ემთხვევა.")
            }
            const response = await update_password(new_password)
            if (response === "წარმატება") {
                alert("პაროლი წარმატებით განახლდა.")
                setShowReset(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return <div class="flex px-10 items-start gap-x-2">
        <form onSubmit={editUser} class="flex-[6] mr-12">
            <div class="flex mb-3 gap-x-2 items-center">
                <img class="rounded-[50%] bg-gray-100" src={exclamationSVG}></img>
                <h1 class="font-[thin-font] text-gr break-all text-xs font-bold">გაითვალისწინეთ უკვე რეგისტრირებული მეილის ან ტელეფონის ნომრის შეცვლა შეუძლებელია გასაჩივრების გარეშე!</h1>
            </div>
            <div class="grid grid-cols-2 gap-x-8 gap-y-2">
                <div class="flex flex-col">
                    <label for="firstname" class="font-[thin-font] text-xl font-bold">სახელი</label>
                    <input type="text" name="firstname" id="firstname" ref={firstname} disabled={editing() ? false : true} value={user() && user()?.firstname} class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>
                </div>
                <div class="flex flex-col">
                    <label for="lastname" class="font-[thin-font] text-xl font-bold">გვარი</label>
                    <input type="text" id="lastname" disabled={editing() ? false : true} value={user()?.lastname} name="lastname" class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>
                </div>
                <div class="flex flex-col">
                    <label for="email" class="font-[thin-font] text-xl font-bold">მეილი</label>
                    {user() && user()?.email ? <p class="pt-1 font-[normal-font] text-base text-gray-[700]">{user() && user()?.email}</p> : <input type="text" name="email" id="email" placeholder="ცარიელი" disabled={editing() ? false : true} class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>}
                </div>
                <div class="flex flex-col">
                    <label for="mobile" class="font-[thin-font] text-xl font-bold">მობილური ნომერი</label>
                    {user() && user()?.phone ? <p class="pt-1 font-[normal-font] text-base text-gray-[700]">{user() && user()?.phone}</p> : <input type="text" name="mobile" placeholder="ცარიელი" id="mobile" disabled={editing() ? false : true} class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>}
                </div>
            </div>
            <div class="text-center mt-2">
                {message() && <p class="font-[thin-font] text-sm font-bold text-red-500">{message()}</p>}

            </div>
            <button type="submit" class={`text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold ${editing() ? "bg-dark-green hover:bg-dark-green-hover" : "bg-gray-900 hover:bg-gray-800"} duration-200 ease-in`}>
                {editing() ? "დადასტურება" : "შესწორება"}
            </button>
        </form>
        <Switch>
            <Match when={!showReset()}>
                <div class="flex-[6] flex flex-col h-full justify-between border-l pl-12">
                    {user() && !user().email && <p class="font-[thin-font] text-sm font-bold text-red-500">პაროლის შეცვლა ხდება მხოლოდ მეილის გამოყენებით გთხოვთ დაამატოთ მეილი.</p>}
                    <ul class="font-[thin-font] text-sm font-bold mt-3">
                        <li>1. დააჭირეთ ღილაკს "პაროლის შეცვლა"</li>
                        <li>2. შეიყვანეთ                                                                                                                                                                    გამოგზავნილი ვერიფიკაციის კოდი</li>
                        <li>3. შეცვალეთ პაროლი</li>
                    </ul>
                    <div>
                        <div class="flex mt-5 gap-x-2 items-center">
                            <img class="rounded-[50%] bg-gray-100" src={exclamationSVG}></img>
                            <h1 class="font-[thin-font] text-gr text-xs font-bold">კოდი იგზავნება მხოლოდ მეილზე.</h1>
                        </div>
                        <button onClick={showResetHandler} class="text-white mt-2 px-6 rounded-[16px] py-2 text-base font-[thin-font] bg-gray-900 hover:bg-gray-800 font-bold duration-200 ease-in">
                            პაროლის შეცვლა
                        </button>
                    </div>
                </div>
            </Match>
            <Match when={showReset() && !showPasswordForm()}>
                <div class="flex-[6] flex flex-col justify-between h-full border-l pl-12">
                    <form method="post" onSubmit={handleFormSubmit}>
                        <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="verif">
                            ვერიფიკაციის კოდი
                        </label>
                        <input class="bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="verif" type="text" name="verify" placeholder="4 ციფრა კოდი" />
                        <div>
                            <button type="submit" class="text-white flex items-center justify-center gap-x-2 px-4 py-2 text-base font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover rounded-[16px]">გაგრძელება</button>
                        </div>
                    </form>
                    <Show when={timer()}>
                        <div class="flex flex-col gap-y-1">
                            <p class="font-[thin-font] text-gr text-sm font-bold">ვერფიკაციის კოდი გამოიგზავნა მეილზე.</p>
                            <p class="font-[thin-font] text-gr text-sm font-bold">კოდის არა ეფექტურობამდე დარჩენილია {timer()} წამი.</p>
                        </div>
                    </Show>
                    {error() && <p class="font-[thin-font] text-gr text-sm font-bold">ვერფიკაციის კოდი უკვე გამოგზავნილია მეილზე გთხოვთ მოიცადოთ 3 წუთი.</p>}
                </div>
            </Match>
            <Match when={showPasswordForm()}>
                <form method="post" onSubmit={handlePasswordReset} class="flex-[6] border-l pl-12 flex-col h-full flex justify-between">
                    <div class="flex flex-col w-[300px] gap-y-1">
                        <div class="flex items-center focus:outline-none border border-gray-200 rounded py-3 px-4 mb-2 bg-gray-200 focus:bg-white focus:border-gray-500 justify-between">
                            <input type={displayNewPassword() ? "text" : "password"} class="font-[thin-font] font-bold bg-transparent outline-0 text-gray-700" name="new_password" placeholder="ახალი პაროლი" />
                            {displayNewPassword() ? <button onClick={() => setDisplayNewPassword(false)}><img src={eyeSlashSVG}></img></button> : <button onClick={() => setDisplayNewPassword(true)}><img src={eyeFillSVG}></img></button>}

                        </div>
                        <div class="flex items-center bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-2 focus:outline-none focus:bg-white focus:border-gray-500 justify-between">
                            <input type={displayRepeatPassword() ? "text" : "password"} class="font-[thin-font] font-bold bg-transparent outline-0 text-gray-700" name="repeat_password" placeholder="გაიმეორე პაროლი" />
                            {displayRepeatPassword() ? <button onClick={() => setDisplayRepeatPassword(false)}><img src={eyeSlashSVG}></img></button> : <button onClick={() => setDisplayRepeatPassword(true)}><img src={eyeFillSVG}></img></button>}
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="text-white flex items-center justify-center gap-x-2 px-4 py-2 text-base font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover rounded-[16px]">პაროლის განახლება</button>

                    </div>
                </form>
            </Match>
        </Switch>
    </div>
}

export default Account