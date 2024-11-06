import { createSignal } from "solid-js";
import {add_user_schedule, check_user_schedule} from "../../../api/xelosani/setup/setup"
import { A, createAsync, useNavigate } from "@solidjs/router";

const schedule = () => {
    const schedule = createAsync(check_user_schedule)
    const [submitted, setSubmitted] = createSignal(false)
    const navigate = useNavigate()

    const week_days = [
        "ორშაბათი",
        "სამშაბათი",
        "ოთხშაბათი",
        "ხუთშაბათი",
        "პარასკევი",
        "შაბათი",
        "კვირა"
    ]

    const handle_user_schedule = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const response = await add_user_schedule(formData)
            if (response.status !== 200) throw new Error("error") 
            if (response.stepPercent === 100) {
                return navigate(`/xelosani/${response.profId}`) //ჩანიშვნა
            }
            setSubmitted(true)
        } catch(error) {
            console.log(error)
        }
    }

    return <div  class='flex flex-col w-full px-4 py-2 h-full'>
        <Switch>
            <Match when={schedule() === 400 && !submitted()}>
                <div class="flex items-center justify-between border-b pb-2">
                    <p class="font-bold font-[normal-font] text-md">კვირის დღეები</p>
                    <div class="flex items-center w-[235px] justify-around">
                        <p class="font-bold font-[normal-font] text-md">დასაწყისი</p>
                        <p class="font-bold font-[normal-font] text-md">დასასრული</p>
                    </div>
                </div>
                <form onSubmit={handle_user_schedule} class="flex flex-col gap-y-2 py-2 justify-between w-full">
                    {week_days.map((a) => {
                        return <div class="flex items-center w-full justify-between border-b pb-2">
                            <p class="font-[normal-font] text-xl w-[100px] font-bold text-gray-800 tracking-wider">{a}</p>
                            <span class="font-[boldest-font] text-3xl font-bold">-</span>
                            <div class="flex items-center gap-x-2 ml-2">
                                <input type="time" name={`${a}-საწყისი-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"  value="00:00" />
                                <input type="time" name={`${a}-სასრული-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"  value="00:00" />
                            </div>
                        </div>
                    })}
                    <button type="submit" className="py-2 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                        გაგრძელება
                    </button>
                </form>
            </Match>
            <Match when={schedule() === 200 || submitted()}>
                <div class="flex flex-col justify-center h-full items-center">
                    <p class="text-sm font-[normal-font] font-bold text-gray-700">განრიგი დამატებული გაქვთ გთხოვთ განაგრძოთ.</p>
                    <A className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/xelosani/step/skills">გაგრძელება</A>
                </div>
            </Match>
        </Switch>
    </div>
}

export default schedule