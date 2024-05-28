import { A } from "@solidjs/router"
import { Search } from "./Search"
import { createEffect, createSignal, onCleanup } from "solid-js"
import peopleIcon from "../../public/svg-images/svgexport-9.svg"
import jobsIcon from "../../public/svg-images/svgexport-11.svg"
import dropdownSVG from "../../public/svg-images/svgexport-8.svg"
import { WorkDropdown } from "./header-comps/WorkDropdown"

export const Header = () => {
    const [displayOptions, setDisplayOption] = createSignal(false)
    const [chosenQuery, setChosenQuery] = createSignal("ხელოსანი")
    const [value, setValue] = createSignal("")

    const switch_query_options = (query) => {
        if (query === "ხელოსანი") {
            setChosenQuery("ხელოსანი")
            setDisplayOption(false)
            document.getElementById("search_input").focus()
        } else if (query === "სამუშაო") {
            setChosenQuery("სამუშაო")
            setDisplayOption(false)
            document.getElementById("search_input").focus()
        } else {
            return alert("მოძებნა ვერ მოხერხდება ცადეთ თავიდან")
        }
    }

    const handleBodyClick = (event) => {
        if (event.target.id !== "options-menu" && event.target.parentElement.id !== "search_query_options_button") {
            setDisplayOption(false);
        }
    };

    createEffect(() => {
        document.body.addEventListener("click", handleBodyClick);
        onCleanup(() => {
            document.body.removeEventListener("click", handleBodyClick);
        });
    });

    return <>
        <header class="border-b sticky top-0 left-0 right-0 z-50 bg-white border-slate-300">
            <div class="flex itmes-center py-3 m-auto w-[90%]">
                <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
                <div class="flex w-full justify-between items-center font-[normal-font]">
                    <nav class="px-3 flex justify-around font-[thin-font] font-bold text-sm gap-x-3">
                        <div class="relative group flex items-center">
                            <div class="flex cursor-pointer items-center">
                                <A href="/talent">მოძებნე ხელოსანი</A>
                                <img class="transform transition-transform duration-300 group-hover:rotate-180" src={dropdownSVG} alt="dropdown icon"></img>
                            </div>
                            <WorkDropdown hook={"xelosani"}></WorkDropdown>
                        </div>
                        <div class="flex group relative items-center">
                            <A href="/job">მოძებნე სამუშაო</A>
                            <img class="transform transition-transform duration-300 group-hover:rotate-180" src={dropdownSVG}></img>
                            <WorkDropdown hook={"samushao"}></WorkDropdown>
                        </div>
                        <A href="/namushevari">გაყიდე ნამუშევარი</A>
                        <A href="/work">რატომ შეუკეთე</A>
                        <A href="/news">სიახლე</A>
                        <A href="/blog">ბლოგი</A>
                    </nav>
                    <div class="px-3 font-[thin-font] text-sm items-center font-bold flex gap-x-3">
                        <Search value={value} setValue={setValue} chosenQuery={chosenQuery} setDisplayOption={setDisplayOption}></Search>
                        <A href="/login">შესვლა</A>
                        <A href="/choose" class="bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-1 rounded-[16px]">რეგისტრაცია</A>
                    </div>
                </div>
            </div>
            {displayOptions() && <div id="options-menu" class="absolute border-t border-slate-300 right-[13%] z-50 bg-white opacity-100 w-[230px]">
                <ul class="shadow-2xl rounded-lg p-3 w-full">
                    <button class="text-left w-full" onClick={() => switch_query_options("ხელოსანი")}>
                        <li class="flex p-2 hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2">
                            <div>
                                <img src={peopleIcon}></img>
                            </div>
                            <div class="flex flex-col">
                                <h2 class="font-[normal-font] text-sm font-bold">ხელოსანი</h2>
                                <p class="text-gr font-bold text-xs font-[thin-font]">მოძებნე პროფესიონალი ხელოსნები</p>
                            </div>
                        </li>
                    </button>
                    <button class="text-left w-full" onClick={() => switch_query_options("სამუშაო")}>
                        <li class="flex p-2 hover:bg-[rgb(243,244,246)] rounded-[16px] mt-2 gap-x-2">
                            <div>
                                <img src={jobsIcon}></img>
                            </div>
                            <div class="flex flex-col">
                                <h2 class="font-[normal-font] text-sm font-bold">სამუშაო</h2>
                                <p class="text-gr font-bold text-xs font-[thin-font]">მოძებნე სამუშაო</p>
                            </div>
                        </li>
                    </button>
                </ul>
            </div>}
        </header>
    </>
}