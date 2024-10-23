import { batch } from "solid-js"
import closeIcon from "../../../svg-images/svgexport-12.svg"
import "../../assets/inputTime.css"

export const ServiceSchedule = (props) => {    
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
            const insertableSchedule = [
                {
                    startTime: formData.get("ორშაბათი-საწყისი-დრო"),
                    endTime: formData.get("ორშაბათი-სასრული-დრო"),
                    day: "ორშაბათი"
                },
                {
                    startTime: formData.get("სამშაბათი-საწყისი-დრო"),
                    endTime: formData.get("სამშაბათი-სასრული-დრო"),
                    day: "სამშაბათი"
                },
                {
                    startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
                    endTime: formData.get("ოთხშაბათი-სასრული-დრო"),
                    day: "ოთხშაბათი"
                },
                {
                    startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
                    endTime: formData.get("ხუთშაბათი-სასრული-დრო"),
                    day: "ხუთშაბათი"
                },
                {
                    startTime: formData.get("პარასკევი-საწყისი-დრო"),
                    endTime: formData.get("პარასკევი-სასრული-დრო"),
                    day: "პარასკევი"
                },
                {
                    startTime: formData.get("შაბათი-საწყისი-დრო"),
                    endTime: formData.get("შაბათი-სასრული-დრო"),
                    day: "შაბათი"
                },
                {
                    startTime: formData.get("კვირა-საწყისი-დრო"),
                    endTime: formData.get("კვირა-სასრული-დრო"),
                    day: "კვირა"
                }
            ]
            batch(() => {
                props.setSchedule(insertableSchedule)
                props.setIsUsingMainSchedule(false)
                props.setToast({
                  message: "განრიგი დამატებულია.",
                  type: true
                })
                props.setShowSchedule(null)
            });
        } catch(error) {
            alert(error)
        }
    }
    return <div class="w-[800px] h-full">
    <div className="flex w-full justify-between items-center mb-2">
        <h1 className="font-[bolder-font] font-bold text-lg">სერვისზე მუშაობის განრიგი</h1>
        <button onClick={() => props.setShowSchedule(null)}>
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
                {week_days.map((a, i) => {
                    return <div class="flex items-center w-full justify-between border-b pb-2">
                        <p class="font-[normal-font] text-xl w-[100px] font-bold text-gray-800 tracking-wider">{a}</p>
                        <span class="font-[boldest-font] text-3xl font-bold">-</span>
                        <div class="flex items-center gap-x-2 ml-2">
                            <input value={(props.schedule() && props.schedule()[i].startTime) || "12:00"} min="00:00" step="60" max="23:59" type="time" name={`${a}-საწყისი-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                            <input value={(props.schedule() && props.schedule()[i].endTime) || "12:00"} min="00:00" step="60" max="23:59" name={`${a}-სასრული-დრო`} class="outline-none bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                        </div>
                    </div>
                })}
                <button type="submit" className="py-2 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                    გაგრძელება
                </button>
            </form>
        </div>
    </div>
}
