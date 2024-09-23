import { For, createSignal } from "solid-js"
import jobs from "./all_jobs.json"
import clear from "../../../../svg-images/svgexport-12.svg"

export const JobType = () => {
    const [allJobs, setAllJobs] = createSignal(jobs)
    const job_search = (e) => {
        setAllJobs(() => {
            return jobs.filter((a) => a.includes(e.target.value))
        })
    }
    return <div class="absolute overflow-y-scroll max-h-[210px] top-0 bg-white p-2 border border-t-0 left-0">
        <input type="text" onInput={job_search} placeholder="მოძებნე" class="border font-[thin-font] text-sm font-bold outline-0 px-2 py-1 w-full rounded-[16px] mb-2"></input>
        <div class="flex flex-col gap-1">
            <div class="grid grid-cols-3 gap-1">
                <div class="flex items-center border-2 border-dark-green px-2 py-1 rounded-[16px] gap-x-1">
                    <p class="font-[thin-font] text-sm font-bold">ავეddddჯი</p>
                    <button type="button">
                        <img width={12} height={12} src={clear} alt="წაშლა" class="border border-gr rounded-[50%]"></img>
                    </button>
                </div>
                <div class="flex items-center border-2 border-dark-green px-2 py-1 rounded-[16px] gap-x-1">
                    <p class="font-[thin-font] text-sm font-bold">ავეddddჯი</p>
                    <button type="button">
                        <img width={12} height={12} src={clear} alt="წაშლა" class="border border-gr rounded-[50%]"></img>
                    </button>
                </div>
                <div class="flex items-center border-2 border-dark-green px-2 py-1 rounded-[16px] gap-x-1">
                    <p class="font-[thin-font] text-sm font-bold">ავეddddჯი</p>
                    <button type="button">
                        <img width={12} height={12} src={clear} alt="წაშლა" class="border border-gr rounded-[50%]"></img>
                    </button>
                </div>
                <div class="flex items-center border-2 border-dark-green px-2 py-1 rounded-[16px] gap-x-1">
                    <p class="font-[thin-font] text-sm font-bold">ავეddddჯი</p>
                    <button type="button">
                        <img width={12} height={12} src={clear} alt="წაშლა" class="border border-gr rounded-[50%]"></img>
                    </button>
                </div>
            </div>
            <For each={allJobs()}>
                {(j) => {
                    return <div class="flex hover:bg-gray-200 duration-100 ease-in items-center border-t border-dark-green gap-x-1">
                        <button class="font-[thin-font] text-sm py-2 w-full px-2 text-left font-bold">{j}</button>
                    </div>
                }}
            </For>
        </div>
    </div>
}