import { A, createAsync, useNavigate } from "@solidjs/router"
import { Match, Switch, createSignal } from "solid-js";
import { check_contact, handle_contact } from "~/routes/api/xelosani/setup/setup";
import steps from "../steps.json"

const Contact = (props) => {
    const contact = createAsync(check_contact)
    const [error, setError] = createSignal("")
    const navigate = useNavigate()

    const handleContact = async (event) => {
        event.preventDefault()
        try {
            const formData = new FormData(event.target);
            const response = await handle_contact(formData, contact())
            if (response !== 200) throw new Error(response) 
            const steps_array = Object.keys(steps)
            const currentstepIndex = steps_array.indexOf(props.location.pathname.split("/")[4])
            const next_pathname = steps_array[currentstepIndex + 1]
            navigate(`/setup/xelosani/step/${next_pathname}`)
        } catch (error) {
            if (error.message === "401") {
                return alert("მომხმარებელი არ არის შესული სისტემაში.")
            }
            setError(error.message)
        }
    }
    return <Switch>
        <Match when={contact() === "email" || contact() === "phone"}>
            <form class="w-full" onSubmit={handleContact}>
                <div class="flex items-center justify-between">
                    <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="input">
                        {contact() === "email" ? "მეილი" : "ტელეფონის ნომერი"}
                    </label>
                </div>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="input" type="text" name="input" placeholder={contact() === "email" ? "example@gmail.com" : "555555555"} />
                <p class="font-[thin-font] text-red-500 text-xs font-bold">{error()}</p>
                <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                    გაგრძელება
                </button>
            </form>
        </Match>
        <Match when={contact() === "fine"}>
            <div class="flex flex-col items-center">
            <p class="text-sm font-[normal-font] font-bold text-gray-700">თქვენ საკონტაქტოები დამატებული გაქვთ გთხოვთ განაგრძოთ.</p>
            <A className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/xelosani/step/about">გაგრძელება</A>
            </div>
        </Match>
    </Switch>
}

export default Contact