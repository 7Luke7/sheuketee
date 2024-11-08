import { batch, createSignal } from "solid-js"
import closeIcon from "../../../svg-images/svgexport-12.svg";
import { modify_about } from "~/routes/api/xelosani/modify/about";

export const ModifyAbout = (props) => {
    const [input, setInput] = createSignal(props.about)

    const modify_about_handler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const response = await modify_about(formData)
            if (response !== 200) throw new Error(response)
            batch(() => {
                props.setToast({
                    message: "აღწერა წარმატებით განახლდა.",
                    type: true,
                });
                props.setModal(null);
            });
        } catch (error) {
            console.log(error)
            if (error.message === "401") {
                return alert("მომხმარებელი არ არის შესული სისტემაში.")
            }
            return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.")
        }
    }

    return <div className="flex flex-col w-[445px] h-[340px]">
        <div class="flex w-full justify-between items-center mb-2">
        <h1 class="font-[boldest-font] text-lg">აღწერის შეცვლა</h1>
        <button onClick={() => props.setModal(null)}>
          <img src={closeIcon} />
        </button>
      </div>
            <form onSubmit={modify_about_handler} class="h-[240px]">
                <textarea
                    name="about"
                    value={props.about}
                    onInput={(e) => setInput(e.target.value)}
                    class="w-full h-full resize rounded-lg p-3 pb-5 text-sm text-gr font-bold font-[thin-font] placeholder-gray-400 outline-none transition-colors duration-300 ease-in-out scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:placeholder-gray-400 focus:border-[#108a00] border-2 border-[#108a00] focus:ring-0 focus:ring-offset-0"
                    maxlength="600" id="with-avatar-focused" placeholder="აღწერეთ თქვენი უნარები, გამოცდილებები..." rows="5" cols="50"></textarea>
                <p class="flex w-full items-center justify-between text-xs">
                    <span class="font-[thin-font] text-gray-700 font-bold">თქვენს შესახებ</span>
                    <span id="with-avatar-focused-character-count" class="text-slate-500 transition-colors duration-300 ease-in-out">{input().trim().length}/600</span>
                </p>
                <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                    დადასტურება
                </button>
            </form>
    </div>
}