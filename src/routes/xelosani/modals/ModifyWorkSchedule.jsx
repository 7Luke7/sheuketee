import { batch } from "solid-js"
import closeIcon from "../../../svg-images/svgexport-12.svg"
import {modify_user_schedule} from "~/routes/api/xelosani/modify/schedule"

export const ModifyWorkSchedule = (props) => {    
    const handle_user_schedule = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const response = await modify_user_schedule(formData)
            if (response !== 200) throw new Error(response)
            batch(() => {
                props.setToast({
                  message: "განრიგი განახლებულია.",
                  type: true
                })
                props.setModal(null)
            });
        } catch(error) {
            alert(error)
        }
    }
    return <div class="w-[800px] h-full">
    <div className="flex w-full justify-between items-center mb-2">
        <h1 className="font-[boldest-font] text-lg">განრიგის შეცვლა</h1>
        <button onClick={() => props.setModal(null)}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
        <div  class='flex flex-col w-full px-4 py-2 h-full'>
            <div class="flex items-center justify-between border-b pb-2">
                <p class="font-bold font-[normal-font] text-md">კვირის დღეები</p>
                <div class="flex items-center w-[235px] justify-around">
                    <p class="font-bold font-[normal-font] text-md">დასაწყისი</p>
                    <p class="font-bold font-[normal-font] text-md">დასასრული</p>
                </div>
            </div>
            <form onSubmit={handle_user_schedule} class="flex flex-col gap-y-2 py-2 justify-between w-full">
                {props.schedules.map((sc, i) => {
                    return <div class="flex items-center w-full justify-between border-b pb-2">
                        <p class="font-[normal-font] text-xl w-[100px] font-bold text-gray-800 tracking-wider">{sc.day_of_week}</p>
                        <span class="font-[boldest-font] text-3xl font-bold">-</span>
                        <div class="flex items-center gap-x-2 ml-2">
                            <input type="time" name={`${sc.day_of_week}-საწყისი-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={sc.available_from} />
                            <input type="time" name={`${sc.day_of_week}-სასრული-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={sc.available_to} />
                        </div>
                    </div>
                })}
                <button type="submit" className="py-2 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                    დადასტურება
                </button>
            </form>
        </div>
    </div>
}
