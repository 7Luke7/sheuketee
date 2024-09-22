import { A } from "@solidjs/router"
import { For, Show, batch, createSignal } from "solid-js"
import dropdownGreenSVG from "../../../public/svg-images/svgexport-13.svg"
import jobs from "./jobs_list"

export const WorkDropdown = () => {
    const [showChildCat, setShowChildCat] = createSignal()
    const [showGrandChildCat, setShowGrandChildCat] = createSignal()

    const handleCategories = (m) => {
        batch(() => {
            setShowChildCat(jobs[0][m])
            setShowGrandChildCat(null)
        })
    }
    const handleChildCategories = (i) => {
        setShowGrandChildCat(showChildCat()[i()]["სამუშაოები"])
    }

    return <div id="options-menu" onMouseLeave={() => {
        batch(() => {
            setShowChildCat(null)
            setShowGrandChildCat(null)
        })
    }} class="hidden pt-[13px] group-hover:block absolute top-full left-0 z-[100]">
        <ul class="rounded-b-lg flex shadow-2xl bg-white pt-3 pb-5 px-2">
            <Show when={jobs}>
                <div class="w-[400px]">
                    <For each={jobs.flatMap(obj => Object.keys(obj))}>
                        {(m) => {
                            return <A href="#" onMouseEnter={() => handleCategories(m)} class="text-left">
                            <li class="flex p-2 justify-between items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2">
                                <h2 class="font-[normal-font] text-sm font-bold">{m}</h2>
                                <img src={dropdownGreenSVG}></img>
                            </li>
                        </A>
                        }}
                    </For>
                </div>
            </Show>
            <Show when={showChildCat()}>
                <div class="flex flex-col w-[400px] px-3 h-[40px]">
                    <For each={showChildCat()}>
                        {(c, i) => {
                            return <A href="#" onMouseEnter={() => handleChildCategories(i)} class="text-left">
                            <li class="flex p-2 justify-between items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2">
                                <h2 class="font-[normal-font] text-sm font-bold">{c["კატეგორია"]}</h2>
                                <img src={dropdownGreenSVG}></img>
                            </li>
                        </A>
                        }}
                    </For>
                </div>
            </Show>
            <Show when={showGrandChildCat()}>
                <div class="flex w-[600px] px-3 h-[40px] flex-wrap">
                    <For each={showGrandChildCat()}>
                        {(c) => {
                            return <A href="#" class="text-left">
                            <li class="p-2 hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2">
                                <h2 class="font-[normal-font] text-sm font-bold">{c}</h2>
                            </li>
                        </A>
                        }}
                    </For>
                </div>
            </Show>
        </ul>
    </div>
}