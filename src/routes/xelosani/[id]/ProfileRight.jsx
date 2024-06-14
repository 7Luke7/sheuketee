import { A } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import fullStar from "../../../../public/svg-images/svgexport-19.svg"
import { Services } from "./Services"
import { ReviewCarousel } from "./ReviewCarousel"

export const ProfileRight = ({ user }) => {

    return <div class="flex flex-[8] flex-col border-r px-3">
        <div class="flex items-center justify-between">
            <h2 class="font-[boldest-font] text-lg">ჩემს შესახებ</h2>
            <p class="text-xs font-[thin-font] font-bold">შემოუერთდა 5 დღის წინ</p>
        </div>
            <Switch>
                <Match when={user().about}>
                    <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">{user().about}</p>
                </Match>
                <Match when={user().status === 200}>
                    <A href="/modify" class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">
                        დაამატე აღწერა
                    </A>
                </Match>
                <Match when={user().status === 401}>
                    <p class="text-gr text-xs font-[thin-font] font-bold">მომხმარებელს ინფორმაცია არ აქვს დამატებული.</p>
                </Match>
            </Switch>
        <h2 class="text-lg font-[boldest-font] mt-5">სერვისები</h2>
        <Switch>
            <Match when={true}>
                <Services status={user().status}></Services>
            </Match>
            <Match when={user().status === 200}>
                <A href="/profile/services" class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">
                    დაამატე სერვისები
                </A>
            </Match>
            <Match when={user().status === 401}>
                <p class="text-gr text-xs font-[thin-font] font-bold">მომხმარებელს ინფორმაცია არ აქვს დამატებული.</p>
            </Match>
        </Switch>
        <div class="flex items-center justify-between mt-5">
            <h2 class="text-lg font-[boldest-font]">მომხმარებლის შეფასებები</h2>
            <A href="#" class="underline text-xs text-gr font-[font-thin] font-bold">ნახე ყველა</A>
        </div>
        <ReviewCarousel></ReviewCarousel>
        <h2 class="text-lg font-[boldest-font] mt-5">ხელობა/სპეციალობა</h2>
        <div class="mt-2">
            <section class="w-full">
                <div class="grid grid-cols-4 gap-5 place-content-between">
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                        <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                        <div class="flex gap-x-5 mt-2 items-center">
                            <div class="flex items-center">
                                <img src={fullStar} width={28} height={28}></img>
                                <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                            </div>
                            <div class="flex items-center">
                                <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                            </div>
                        </div>
                    </div>
                    <A href="#">
                        <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                            <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">კომპიუტერის შეკეთება</h2>
                            <div class="flex gap-x-5 mt-2 items-center">
                                <div class="flex items-center">
                                    <img src={fullStar} width={28} height={28}></img>
                                    <p class="text-gr font-bold font-[normal-font]">4.32/5</p>
                                </div>
                                <div class="flex items-center">
                                    <p class="text-dark-green font-bold font-[normal-font]">320 სამუშაო</p>
                                </div>
                            </div>
                        </div>
                    </A>
                </div>
            </section>
        </div>
    </div>
}