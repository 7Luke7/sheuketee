import { A, createAsync, useParams } from "@solidjs/router"
import { Search } from "./Search"
import { Match, Switch, batch, createEffect, createSignal, onCleanup } from "solid-js"
import peopleIcon from "../../public/svg-images/svgexport-9.svg"
import jobsIcon from "../../public/svg-images/svgexport-11.svg"
import dropdownSVG from "../../public/svg-images/svgexport-8.svg"
import envelopeSVG from "../../public/svg-images/envelope.svg"
import person from "../../public/svg-images/person.svg"
import gear from "../../public/svg-images/gear.svg"
import bellSVG from "../../public/svg-images/bell.svg"
import { WorkDropdown } from "./header-comps/WorkDropdown"
import defaultProfileSVG from "../../public/default_profile.png"
import logoutSVG from "../../public/svg-images/box-arrow-right.svg"
import { logout_user } from "~/routes/api/user"
import { header } from "~/routes/api/header"

export const Header = () => {
    const user = createAsync(header)
    const [chosenQuery, setChosenQuery] = createSignal("ხელოსანი")
    const [value, setValue] = createSignal("")
    const [display, setDisplay] = createSignal(null)

    const switch_query_options = (query) => {
        if (query === "ხელოსანი" || query === "სამუშაო") {
            batch(() => {
                setChosenQuery(query)
                setDisplay(null)
            })
            document.getElementById("search_input").focus()
        } else {
            alert("მოძებნა ვერ მოხერხდება ცადეთ თავიდან")
        }
    }

    const handleBodyClick = (event) => {
        if (!event.target.closest("formmodal") || !event.target.closest("options-menu") || !event.target.closest("notification-menu") || !event.target.closest("message-menu")) {
            setDisplay(null)
        } 
    };

    createEffect(() => {
        document.body.addEventListener("click", handleBodyClick);
        onCleanup(() => {
            document.body.removeEventListener("click", handleBodyClick);
        });
    });

    const logoutUser = async () => {
        try {
            const result = await logout_user()
            if (result === "success") {
                location.href = "/login"
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    return  <header class="border-b sticky top-0 left-0 right-0 z-50 bg-white border-slate-300">
            <div class="flex h-[45px] itmes-center mx-auto w-[90%]">
                <div class="flex w-full justify-between items-center font-[normal-font]">
                    <nav class="flex font-[thin-font] font-bold text-sm gap-x-3 items-center">
                        <A href="/" class="text-dark-green text-xl">შეუკეთე</A>
                        <div class="relative group">
                            <div class="cursor-pointer flex">
                                <A href="/talent">მოძებნე ხელოსანი</A>
                                <img class="transform transition-transform duration-300 group-hover:rotate-180" src={dropdownSVG} alt="dropdown icon"></img>
                            </div>
                            <WorkDropdown></WorkDropdown>
                        </div>
                        <div class="group relative">
                            <div class=" cursor-pointer flex">
                                <A href="/work">მოძებნე სამუშაო</A>
                                <img class="transform transition-transform duration-300 group-hover:rotate-180" src={dropdownSVG}></img>
                            </div>
                            <WorkDropdown></WorkDropdown>
                        </div>
                        <A href="/namushevari">გაყიდე ნამუშევარი</A>
                        <A href="/work">რატომ შეუკეთე</A>
                        <A href="/news">სიახლე</A>
                    </nav>
                    <div class="px-3 font-[thin-font] text-sm items-center font-bold flex gap-x-3">
                        <Search value={value} setValue={setValue} chosenQuery={chosenQuery} setDisplay={setDisplay}></Search>
                        <Switch>
                            <Match when={user() !== 401}>
                                <div class="flex items-center gap-x-3">
                                    <button class="relative">
                                        <img onClick={() => setDisplay("notif")} src={bellSVG}></img>
                                        <div class="bg-red-700 pointer-events-none absolute top-3 right-0 w-[8px] h-[8px] text-white font-thin text-xs font-[thin-font] rounded-[50%]"></div>
                                    </button>
                                    <button class="relative" onClick={() => setDisplay("message")}>
                                        <img src={envelopeSVG}></img>
                                        <div class="bg-red-700 pointer-events-none absolute top-3 right-0 w-[8px] h-[8px] text-white font-thin text-xs font-[thin-font] rounded-[50%]"></div>
                                    </button>
                                    <button onClick={() => setDisplay("account")}>
                                        <img class="rounded-[50%] border-2 w-[25px] h-[25px]" src={user()?.profile_image || defaultProfileSVG}></img>
                                    </button>
                                </div>
                            </Match>
                            <Match when={user() === 401}>
                                <A href="/login">შესვლა</A>
                                <A href="/choose" class="bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-1 rounded-[16px]">რეგისტრაცია</A>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </div>
            {display() === "searchops" && <div id="options-menu" class={`shadow-2xl rounded-b-lg p-3 absolute border-t border-slate-300 ${user() !== 401 ? "right-[7%]" : "right-[12%]"} z-50 bg-white opacity-100 w-[230px]`}>
                <button class="text-left w-full flex p-2 hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2" onClick={() => switch_query_options("ხელოსანი")}>
                    <div>
                        <img src={peopleIcon}></img>
                    </div>
                    <div class="flex flex-col">
                        <h2 class="font-[normal-font] text-sm font-bold">ხელოსანი</h2>
                        <p class="text-gr font-bold text-xs font-[thin-font]">მოძებნე პროფესიონალი ხელოსნები</p>
                    </div>
                </button>
                <button class="text-left w-full flex p-2 hover:bg-[rgb(243,244,246)] rounded-[16px] mt-2 gap-x-2" onClick={() => switch_query_options("სამუშაო")}>
                    <div>
                        <img src={jobsIcon}></img>
                    </div>
                    <div class="flex flex-col">
                        <h2 class="font-[normal-font] text-sm font-bold">სამუშაო</h2>
                        <p class="text-gr font-bold text-xs font-[thin-font]">მოძებნე სამუშაო</p>
                    </div>
                </button>
            </div>}
            {display() === "account" && <div id="account-menu" class="shadow-2xl flex flex-col gap-y-2 rounded-b-lg p-3 absolute border-t border-slate-300 right-[0%] z-50 bg-white opacity-100 w-[230px]">
                <A  href={`/${user()?.role}/${user()?.profId}`} class="p-2 flex items-center gap-x-2 font-[thin-font] font-bold hover:bg-[rgb(243,244,246)] rounded-[16px] text-left w-full">
                    <img src={person}></img>
                    <p>პროფილი</p>
                </A>
                <A href="/account" class="p-2 flex items-center gap-x-2 font-[thin-font] font-bold hover:bg-[rgb(243,244,246)] rounded-[16px] text-left w-full">
                    <img src={gear}></img>
                    <p>ექაუნთი</p>
                </A>
                <button onClick={logoutUser} class="flex items-center justify-center gap-x-2 text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold bg-gray-900 duration-200 ease-in hover:bg-gray-800">
                    <p>გასვლა</p>
                    <img src={logoutSVG}></img>
                </button>
            </div>}
            {display() === "message" && <div id="message-menu" class="absolute shadow-2xl px-4 flex flex-col gap-y-2 rounded-b-lg py-3 border-t border-slate-300 right-[1%] z-50 bg-white opacity-100 w-[490px]">
                <h2 class="font-[bolder-font] text-gray-800">მესიჯები (5)</h2>
                <button class="text-left w-full border-t font-[thin-font] items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2 flex font-bold border-b p-2">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={defaultProfileSVG}></img>
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <button class="text-left w-full border-t font-[thin-font] items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2 flex font-bold border-b p-2">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={defaultProfileSVG}></img>
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <button class="text-left w-full border-t font-[thin-font] items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2 flex font-bold border-b p-2">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={defaultProfileSVG}></img>
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <button class="text-left w-full border-t font-[thin-font] items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2 flex font-bold border-b p-2">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={defaultProfileSVG}></img>
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <button class="text-left w-full border-t font-[thin-font] items-center hover:bg-[rgb(243,244,246)] rounded-[16px] gap-x-2 flex font-bold border-b p-2">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={defaultProfileSVG}></img>
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <div class="py-1 px-2">
                    <A href="/message" class="text-blue-500 font-[thin-font] font-bold text-sm underline">ნახე ყველა</A>
                </div>
            </div>}
            {display() === "notif" && <div id="notification-menu" class="absolute shadow-2xl flex flex-col gap-y-2 rounded-b-lg px-4 py-3 border-t border-slate-300 right-[1%] z-50 bg-white opacity-100 w-[490px]">
                <h2 class="font-[bolder-font] text-gray-800">შეტყობინებები (5)</h2>
                <button class="p-2 font-[thin-font] gap-x-2 font-bold hover:bg-[rgb(243,244,246)] text-left w-full border-b pb-2">
                    <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                    <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                </button>
                <button class="p-2 font-[thin-font] gap-x-2 font-bold hover:bg-[rgb(243,244,246)] text-left w-full border-b pb-2">
                    <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                    <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                </button>
                <button class="p-2 font-[thin-font] gap-x-2 font-bold hover:bg-[rgb(243,244,246)] text-left w-full border-b pb-2">
                    <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                    <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                </button>
                <button class="p-2 font-[thin-font] gap-x-2 font-bold hover:bg-[rgb(243,244,246)] text-left w-full border-b pb-2">
                    <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                    <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                </button>
                <button class="p-2 font-[thin-font] gap-x-2 font-bold hover:bg-[rgb(243,244,246)] text-left w-full border-b pb-2">
                    <div class="flex flex-col">
                        <p class="font-bold text-sm font-[thin-font]">ლუკა ჩიკვაიძე</p>
                        <p class="font-bold break-all text-gr text-xs font-[thin-font]">მაქსიმუმ 60 ჩარაქთერი</p>
                    </div>
                </button>
                <div class="px-2 py-1">
                    <A href="/message" class="text-blue-500 font-[thin-font] font-bold text-sm underline">ნახე ყველა</A>
                </div>
            </div>}
        </header>
}
