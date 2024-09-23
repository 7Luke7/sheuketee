import { A } from "@solidjs/router"
import HeroSVG from "../svg-images/hero_svg.svg"
import { PeopleWorking } from "./PeopleWorking"

export const Hero = () => {
    return <section class="flex mt-32 justify-between">
        <div class="flex flex-col justify-between">
            <div>
            <h1 class="text-5xl font-[bolder-font] text-dark-green">
                მოძებნე სამუშაო<br/>
                იმუშავე დამოუკიდებლად
            </h1>
            <p role="text" class="w-[500px] mt-4 text-gr text-lg font-bold font-[normal-font]">
                დაივიწყე ძველი წესები. შეხვდი დამკვეთებს. აიმაღლე რეპუტაცია. გამოიმუშავე თანხა.
            </p>
            <div class="mt-4">
                <A href="/choose" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-4 py-2 rounded-[16px]">დაიწყე ახლა</A>
            </div>
            </div>
            <div class="mt-5 border-t border-slate-200 w-[620px]">
                <PeopleWorking></PeopleWorking>
            </div>
        </div>
        <div>
            <img src={HeroSVG} alt="მოძებნე სამუშაო შეუკეთე" />
        </div>
    </section>
}