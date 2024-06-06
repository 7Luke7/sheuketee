import { createAsync, useNavigate } from "@solidjs/router"
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import PlusSVG from "../../../public/svg-images/plus.svg"
import eyeFillSVG from "../../../public/svg-images/eye-fill.svg"
import eyeSlashSVG from "../../../public/svg-images/eye-slash.svg"
import { get_user, update_password } from "~/routes/api/user";
import { send_email_verification_code, verify_code } from "../api/utils/verification";

const fetchUser = async (navigate) => {
    try {
        const response = await get_user();
        const data = JSON.parse(response);
        if (data === 401) {
            navigate("/login");
        }
        return data;
    } catch (error) {
        console.log(error)
        alert(error)
    }
};

const Account = () => {
    const navigate = useNavigate()
    const user = createAsync(() => fetchUser(navigate))
    const [editing, setEditing] = createSignal(false)
    const [showReset, setShowReset] = createSignal(false)
    const [timer, setTimer] = createSignal()
    const [error, setError] = createSignal()
    const [showPasswordForm, setShowPasswordForm] = createSignal(false)
    const [displayNewPassword, setDisplayNewPassword] = createSignal(false)
    const [displayRepeatPassword, setDisplayRepeatPassword] = createSignal(false)

    let firstname;
    let lastname;

    const editUser = () => {
        if (editing()) {
            firstname.disabled = true
            lastname.disabled = true
            // გააგზავნე რექვესთ
        } else {
            firstname.disabled = false
            lastname.disabled = false
            firstname.focus()
        }
        setEditing(true)
    }

    createEffect(() => {
        const interval_id = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval_id);
    })

    const showResetHandler = async () => {
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
        <Show when={user()}>
            <div class="mr-12">
                <div class="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                        <p class="font-[thin-font] text-xl font-bold">სახელი</p>
                        <input type="text" ref={firstname} disabled={true} value={user().firstname} class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>
                    </div>
                    <div>
                        <p class="font-[thin-font] text-xl font-bold">გვარი</p>
                        <input type="text" ref={lastname} disabled={true} value={user().lastname} class={`px-2 mt-1 py-1 ${editing() && "ring-1 ring-dark-green"} outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}></input>
                    </div>
                    {
                        user().email ? <div>
                            <p class="font-[thin-font] text-xl font-bold">მეილი</p>
                            <p class="pt-1 font-[normal-font] text-base text-gray-[700]">{user().email}</p>
                        </div> : <button class="text-white mt-4 flex items-center justify-center gap-x-2 w-full py-2 text-base font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover rounded-[16px]">
                            <img src={PlusSVG} class="border-2 rounded-[50%]"></img>
                            <p class="font-[thin-font] font-bold">დაამატე მეილი</p>
                        </button>
                    }
                    {
                        user().phone ? <div>
                            <p class="font-[thin-font] text-xl font-bold">მობილური ნომერი</p>
                            <p class="pt-1 font-[normal-font] text-base text-gray-[700]">{user().phone}</p>
                        </div> : <button class="text-white mt-4 flex items-center justify-center gap-x-2 w-full py-2 text-base font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover rounded-[16px]">
                            <img src={PlusSVG} class="border-2 rounded-[50%]"></img>
                            <p class="font-[thin-font] font-bold">დაამატე ტელ. ნომერი</p>
                        </button>
                    }
                </div>
                <button onClick={editUser} class={`text-white mt-4 w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold ${editing() ? "bg-dark-green hover:bg-dark-green-hover" : "bg-gray-900 hover:bg-gray-800"} duration-200 ease-in`}>
                    {editing() ? "დადასტურება" : "შესწორება"}
                </button>
            </div>
            <Switch>
                <Match when={!showReset()}>
                    <div class="flex-[6] flex flex-col h-full justify-between border-l pl-12">
                        {!user().email && <p class="font-[thin-font] text-sm font-bold text-red-500">პაროლის შეცვლა ხდება მხოლოდ მეილის გამოყენებით გთხოვთ დაამატოთ მეილი.</p>}
                        <ul class="font-[thin-font] text-sm font-bold mt-3">
                            <li>1. დააჭირეთ ღილაკს "პაროლის შეცვლა"</li>
                            <li>2. შეიყვანეთ მეილზე გამოგზავნილი ვერიფიკაციის კოდი</li>
                            <li>3. შეცვალეთ პაროლი</li>
                        </ul>
                        <div>
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
        </Show>
    </div>
}

export default Account