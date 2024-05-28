import { A } from "@solidjs/router"
import PitchHirerSVG from "../../public/svg-images/pitch-hirer.svg"

export const WorkerLanding = () => {
    return <section class="mt-24 w-full">
        <div class="flex bg-pink-50 justify-center rounded-[16px] px-5 py-10 gap-x-5">
            <img src={PitchHirerSVG}></img>
            <div class="flex flex-col">
                <h2 class="text-xl border-b border-slate-300 pb-2 font-[normal-font] font-bold w-full mb-5">
                    დამკვეთის ბენეფიტები ჩვენთან
                </h2>
                <div class="flex flex-col items-start gap-y-2">
                    <div>
                        <p class="text-gr font-[boldest-font]">ხელოსნებთან კავშირი</p>
                        <span class="py-3 text-gr font-[normal-font]">ჩვენ გაკავშირებთ თქვენს გარშემო მყოფ ხელოსნებთან.</span>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">დაცული გადახდათა სისტემა</p>
                        <span class="py-3 text-gr font-[normal-font]">ჩვენს მიერ შემუშავებული სისტემა ხელჰყოფს ყოველგვარ თაღლითობას.</span>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">განათავსე ფოტოები</p>
                        <span class="py-3 text-gr font-[normal-font]">უმთავრესი ნაწილი პოსტის შექმნისას ფოტოებია.</span>
                    </div>
                    <div>
                        <p class="text-gr font-[boldest-font]">აღწერე სამუშაო</p>
                        <span class="py-3 text-gr font-[normal-font]">თქვენს მიერ სწორი აღწერა დაეხმარება ხელოსანს სამუშაოს აღქმაში.</span>
                    </div>
                    <div class="flex gap-x-2 mt-3 items-center">
                        <A href="/choose" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">გახდი ხელოსანი</A>
                        <A href="/xelosani" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                    </div>              
              </div>
            </div>
        </div>
    </section>
}