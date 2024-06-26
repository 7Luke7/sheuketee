import { Show } from "solid-js"

export const EmailPassword = ({error}) => {
    return <div class="flex flex-col mb-2">
        <div>
            <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email-mobile">
                მეილი ან ტელ.ნომერი
            </label>
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
        </div>
        <div>
            <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                პაროლი
            </label>
            <input
                class={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error()?.some(a => a.field === "password") ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                id="grid-password"
                type="password"
                name="password"
                placeholder="******************"
                />
            <Show when={error()?.some(a => a.field === "password")}>
                <p class="text-xs text-red-500 mt-1 font-[thin-font] font-bold">
                    {error().find(a => a.field === "password").message}
                </p>
            </Show>
        </div>
    </div>

}