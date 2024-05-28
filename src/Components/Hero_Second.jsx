import welcomeSVG from "../../public/svg-images/welcome.svg"
import Pen from "../../public/svg-images/svgexport-16.svg"
import Pin from "../../public/svg-images/svgexport-17.svg"
import Star from "../../public/svg-images/svgexport-18.svg"
import { A } from "@solidjs/router"

export const SecondHero = () => {
    return <section class="mt-24">
        <div class="flex justify-center">
            <div class="flex flex-[5] flex-col justify-start items-start">
                <h2 class="text-xl border-b border-slate-300 pb-2 font-[normal-font] font-bold w-full mb-5">შემოგვიერთდი როგორც <span class="text-dark-green-hover">ხელოსანი</span></h2>
                <div class="flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Pen}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">მოქნილი განრიგი</p>
                        <span class="py-3 text-gr font-[normal-font]">შეათავსეთ მუშაობა ცხოვრების სხვა აქტივობებთან.</span>
                    </div>
                </div>
                <div class="mt-5 flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Pin}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">გამოევლინეთ უნარები</p>
                        <span class="py-3 text-gr font-[normal-font]">უნარები ფასდება დამკვეთის მიერ რაც გიმაღლებთ რეპუტაციას.</span>
                    </div>
                </div>
                <div class="mt-5 flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Star}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">გახდი დამოუკიდებელი</p>
                        <span class="py-3 text-gr font-[normal-font]">იმუშავე როცა გინდა როგორც გინდა ვისთანაც გინდა.</span>
                    </div>
                </div>
                <div class="mt-5 flex items-center gap-x-2">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შემოგვიერთდი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
            <img src={welcomeSVG}></img>
            <div class="flex flex-[5] flex-col justify-start items-start">
                <h2 class="text-xl border-b border-slate-300 pb-2 font-[normal-font] font-bold w-full mb-5">შემოგვიერთდი როგორც <span class="text-dark-green-hover">დამკვეთი</span></h2>
                <div class="flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Pen}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">მოძებნე ხელოსანი</p>
                        <span class="py-3 text-gr font-[normal-font]">მოძებნე ხელოსანი შენს ქალაქში, რაიონში, სოფელში.</span>
                    </div>
                </div>
                <div class="mt-5 flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Pin}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">შეარჩიე ხელოსანი</p>
                        <span class="py-3 text-gr font-[normal-font]">გაარჩიეთ ხელოსნის პროფილი: განხილვები, კომენტარები.</span>
                    </div>
                </div>
                <div class="mt-5 flex gap-x-2">
                    <div>
                        <img width={24} height={24} src={Star}></img>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">თანხის გადახდის წესები</p>
                        <span class="py-3 text-gr font-[normal-font]">თანხის გადახდა ხდება შუამავლის(ჩვენი) დახმარებით.</span>
                    </div>
                </div>
                <div class="mt-5 flex items-center gap-x-2">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შემოგვიერთდი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
    </section>
}