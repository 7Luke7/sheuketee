import { A, createAsync } from "@solidjs/router"
import { For, Show, createSignal } from "solid-js"
import { work_categories } from "~/lib/json_data"
import dropdownGreenSVG from "../../../public/svg-images/svgexport-13.svg"

export const WorkDropdown = ({hook}) => {
    const [showCat, setShowCat] = createSignal()
    const jobs = createAsync(work_categories)

    const handleCategories = (m, i) => {
        setShowCat({
            index: i(),
            catName: m
        })
    }

    return <div id="options-menu" class="hidden pt-5 group-hover:block absolute top-full left-0 z-50">
        <ul class="rounded-lg flex shadow-2xl bg-white max-h-[235px] pt-3 pb-5 px-2">
            <Show when={jobs()}>
                <div class="w-[200px]">
                    <For each={jobs().flatMap(obj => Object.keys(obj))}>
                        {(m, i) => {
                            return <A href="#" onMouseEnter={() => handleCategories(m, i)} class="text-left">
                            <li class="flex p-2 justify-between items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2">
                                <h2 class="font-[normal-font] text-sm font-bold">{m}</h2>
                                <img src={dropdownGreenSVG}></img>
                            </li>
                        </A>
                        }}
                    </For>
                </div>
            </Show>
            <Show when={showCat()}>
                <div class="flex w-[320px] px-3 h-[40px] flex-wrap">
                    <For each={jobs()[showCat().index][showCat().catName]}>
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