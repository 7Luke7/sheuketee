import { A, createAsync, useNavigate } from "@solidjs/router";
import { Match, Switch, createSignal } from "solid-js";
import { check_about, handle_about } from "~/routes/api/xelosani/setup/setup";
import steps from "../steps.json"

const About = (props) => {
    const get_about = createAsync(check_about)
    const [input, setInput] = createSignal("")
    const navigate = useNavigate()

    const textTest = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const response = await handle_about(formData)
            if (response !== 200) throw new Error(response) 
            const steps_array = Object.keys(steps)
            const currentstepIndex = steps_array.indexOf(props.location.pathname.split("/")[4])
            const next_pathname = steps_array[currentstepIndex + 1]
            navigate(`/setup/xelosani/step/${next_pathname}`)
        } catch (error) {
            if (error.message === "401") {
                return alert("მომხმარებელი არ არის შესული სისტემაში.")
            }
            return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.")
        }
    }

    return (
        <div class="flex flex-col items-center mb-4">
            <Switch>
                <Match when={!get_about()}>
                    <form onSubmit={textTest}>
                        <textarea
                            name="about"
                            onInput={(e) => setInput(e.target.value)}
                            class="w-full resize rounded-lg p-3 pb-5 text-sm text-gr font-bold font-[thin-font] placeholder-gray-400 outline-none transition-colors duration-300 ease-in-out scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:placeholder-gray-400 focus:border-[#108a00] border-2 border-[#108a00] focus:ring-0 focus:ring-offset-0"
                            maxlength="600" id="with-avatar-focused" placeholder="აღწერეთ თქვენი უნარები, გამოცდილებები..." rows="5" cols="50"></textarea>
                        <p class="flex w-full items-center justify-between text-xs">
                            <span class="font-[thin-font] text-gray-700 font-bold">თქვენს შესახებ</span>
                            <span id="with-avatar-focused-character-count" class="text-slate-500 transition-colors duration-300 ease-in-out">{input().length}/600</span>
                        </p>
                        <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                            გაგრძელება
                        </button>
                    </form>
                </Match>
                <Match when={get_about()}>
                    <div class="flex flex-col items-center">
                        <p class="text-sm font-[normal-font] font-bold text-gray-700">თქვენ შესახებ დამატებული გაქვთ გთხოვთ განაგრძოთ.</p>
                        <A className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/xelosani/step/age">გაგრძელება</A>
                    </div>
                </Match>
            </Switch>
        </div>
    );
};

export default About;