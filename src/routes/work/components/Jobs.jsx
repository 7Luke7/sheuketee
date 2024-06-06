import { A } from "@solidjs/router"
import { For, Switch, createSignal } from "solid-js"
import "./scrollbar.css"
import dropdownSVG from "../../../../public/svg-images/svgexport-8.svg"
import { JobType } from "./filter-comps/JobType"
import { Pay } from "./filter-comps/Pay"
import { Sort } from "./filter-comps/Sort"
import { Location } from "./filter-comps/Location"
import { Paginate } from "./Paginate"

export const Jobs = ({findLocation, marker, map }) => {
    const [isOpen, setIsOpen] = createSignal({
        jobType: false,
        location: false,
        pay: false,
        sort: false
    })
    const recently_complete_jobs = [
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დწაჯდწად აწდპაწ ჯდპაწჯ დწაჯდ წაპდწადიპ აწჯ დპაწჯდპ აწჯდპწაჯ დპაჯდპა ჯდწა ა ჯ აწდად დაწჯდ წადჯ აპდჯაწჯ პ",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დაწ წადწადაწ დაწ დწადაწ დ",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დწად ა დწა დ",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანასე ჰსჯ ეჰაე4ჰ ეზჰ ",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
        },
    ]

    return <div class="flex-[6] relative overflow-y-scroll custom-scrollbar">
        <div class="flex border-b sticky z-[10] top-0 bg-white px-4 pb-2 items-center justify-between">
            <div class="flex items-center mt-2">
                <button onClick={() => setIsOpen((prev) => {
                    return {
                        location: false,
                        pay: false,
                        date: false, jobType: !prev.jobType
                    }
                })} class="flex items-center">
                    <p class="font-[thin-font] text-md font-bold">
                        სამუშაოს ტიპი
                    </p>
                    <img src={dropdownSVG}></img>
                </button>
            </div>
            <div class="flex items-center mt-2">
                <button onClick={() => setIsOpen((prev) => {
                    return {
                        jobType: false,
                        pay: false,
                        date: false, location: !prev.location
                    }
                })} class="flex items-center">
                    <p class="font-[thin-font] text-md font-bold">
                        მდებარეობა
                    </p>
                    <img src={dropdownSVG}></img>
                </button>
            </div>
            <div class="flex items-center mt-2">
                <button onClick={() => setIsOpen((prev) => {
                    return {
                        jobType: false,
                        location: false,
                        date: false, pay: !prev.pay
                    }
                })} class="flex items-center">
                    <p class="font-[thin-font] text-md font-bold">
                        ანაზღაურება
                    </p>
                    <img src={dropdownSVG}></img>
                </button>
            </div>
            <div class="flex items-center mt-2">
                <button onClick={() => setIsOpen((prev) => {
                    return {
                        jobType: false,
                        location: false,
                        pay: false,
                        sort: !prev.sort
                    }
                })} class="flex items-center">
                    <p class="font-[thin-font] text-md font-bold">
                        დალაგება
                    </p>
                    <img src={dropdownSVG}></img>
                </button>
            </div>
        </div>
        <div class="relative">
            <div class="sticky top-[41px] z-[10]">
                <Switch>
                    <Match when={isOpen().jobType}>
                        <JobType></JobType>
                    </Match>
                    <Match when={isOpen().location}>
                        <Location findLocation={findLocation} marker={marker} map={map}></Location>
                    </Match>
                    <Match when={isOpen().sort}>
                        <Sort></Sort>
                    </Match>
                    <Match when={isOpen().pay}>
                        <Pay></Pay>
                    </Match>
                </Switch>
            </div>
            <For each={recently_complete_jobs}>{(user) => {
                return <A href="#id">
                    <div class="pt-4 px-4 hover:bg-gray-100 border-b">
                        <div class="flex items-center h-full justify-between">
                            <h2 class="text-gray-900 text-lg font-[bolder-font]">მაცივრის ხელოსანი</h2>
                            <div class="gap-x-2 flex my-1 items-center">
                            <p class="text-gr border-r px-2 font-[normal-font]">{user.timestamp}</p>
                                <img class="rounded-[50%] w-[28px] h-[28px]" src={user.profile_image}></img>
                                <p class="text-slate-900 font-bold text-sm font-[thin-font]">{user.firstname + " " + user.lastName}</p>
                            </div>
                        </div>
                        <p class="py-3 text-gr text-sm font-bold font-[thin-font]">{user.job_description.length > 120 ? user.job_description.substring(0, 120) + "..." : user.job_description}</p>
                        <div class="flex items-center gap-x-2">
                            <p class="text-dark-green font-bold font-[normal-font]">₾20.00</p>
                            <p class="text-gray-500 font-bold text-sm font-[thin-font]">მის: ფოთი რეკვავას 2 ბინა 10</p>
                        </div>
                    </div>
                </A>
            }}</For>
        </div>
        <Paginate></Paginate>
    </div>
}