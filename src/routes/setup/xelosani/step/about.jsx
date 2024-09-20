import { A, createAsync, useNavigate } from "@solidjs/router";
import { createSignal, Match, Show, Switch } from "solid-js";
import { check_about, handle_about } from "~/routes/api/xelosani/setup/setup";

const About = () => {
    const get_about = createAsync(check_about)
    const [input, setInput] = createSignal("")
    const [message, setMessage] = createSignal()
    const [submitted, setSubmitted] = createSignal(false)

    const navigate = useNavigate()

    const textTest = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const response = await handle_about(formData)
            if (response.status === 400) {
                return setMessage(response.message)
            }
            if (response.status !== 200) throw new Error(response)
            if (response.stepPercent === 100) {
                return navigate(`/xelosani/${response.profId}`) //ჩანიშვნა
            }
            setSubmitted(true)
        } catch (error) {
            console.log(error)
            if (error.message === "401") {
                return alert("მომხმარებელი არ არის შესული სისტემაში.")
            }
            return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.")
        }
    }

    return (
        <div class="flex p-10 flex-col items-center mb-4">
            <Switch>
                <Match when={!get_about() && !submitted()}>
                    <form onSubmit={textTest}>
                        <textarea
                            name="about"
                            onInput={(e) => setInput(e.target.value)}
                            class="w-full resize rounded-lg p-3 pb-5 text-sm text-gr font-bold font-[thin-font] placeholder-gray-400 outline-none transition-colors duration-300 ease-in-out scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:placeholder-gray-400 focus:border-[#108a00] border-2 border-[#108a00] focus:ring-0 focus:ring-offset-0"
                            maxlength="600" id="with-avatar-focused" placeholder="აღწერეთ თქვენი უნარები, გამოცდილებები..." rows="5" cols="50"></textarea>
                        <p class="flex w-full items-center justify-between text-xs">
                            <span class="font-[thin-font] text-gray-700 font-bold">თქვენს შესახებ</span>
                            <span id="with-avatar-focused-character-count" class="text-slate-500 transition-colors duration-300 ease-in-out">{input().trim().length}/600</span>
                        </p>
                        <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                            გაგრძელება
                        </button>
                        <Show when={message()}>
                            <p class="text-red-500 font-[thin-font] font-bold text-xs mt-2">{message()}</p>
                        </Show>
                    </form>
                </Match>
                <Match when={get_about() || submitted()}>
                    <div class="flex flex-col w-full items-center">
                        <p class="text-sm font-[normal-font] font-bold text-gray-700">თქვენ შესახებ დამატებული გაქვთ გთხოვთ განაგრძოთ.</p>
                        <A className="py-2 mt-3 text-center w-full rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/damkveti/step/age">გაგრძელება</A>
                    </div>
                </Match>
            </Switch>
        </div>
    );
};

export default About;
