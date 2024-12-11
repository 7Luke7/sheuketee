import { A } from "@solidjs/router"
import hirer from "../../svg-images/hirer.svg"
import worker from "../../svg-images/worker.svg"
import { createSignal } from "solid-js"
const Choose = () => {
    const [current, setCurrent] = createSignal(null)

    return <div class="flex-[10] flex flex-col gap-y-5 justify-center items-center">
    <div class="flex gap-x-5 items-center">
        <div onClick={() => setCurrent("ხელოსანი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
            <div class="flex justify-between w-full">
                <img src={worker}></img>
                <div class={`w-[26px] h-[26px] ${current() === "ხელოსანი" && "bg-dark-green"} rounded-[50%] border-2 border-slate-300`}></div>
            </div>
            <h2 class="font-[thin-font] font-semibold text-xl">რეგისტრაცია როგორც ხელოსანი</h2>
            <p class="font-[thin-font] text-gr font-semibold text-sm">თქვენ შეძლებთ მოიძიოთ სამუშაო, რუკაზე სადაც დამკვეთი განათავსებს სამუშაოს, რომელზეც გააკეთებთ შეთავაზებას რასაც დამკვეთი განიხილავს.</p>
            <A href="/login" class="text-slate-800 font-[thin-font] underline text-sm font-bold">გაიგე მეტი</A>
        </div>
        <div onClick={() => setCurrent("დამკვეთი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
            <div class="flex justify-between w-full">
                <img src={hirer}></img>
                <div class={`w-[26px] h-[26px] ${current() === "დამკვეთი" && "bg-dark-green"} rounded-[50%] border-2 border-slate-300`}></div>
            </div>
            <h2 class="font-[thin-font] font-semibold text-xl">რეგისტრაცია როგორც დამკვეთი</h2>
               <p class="font-[thin-font] text-gr font-semibold text-sm">თქვენ
                შეძლებთ მოძებნოთ ხელოსანი, განათავსოთ თქვენი დაკვეთა რუკაზე
რასაც ახლოს                 მყოფი ხელოსანი იპოვის და განათავსებს
შეთავაზებას.</p>
                                        <A href="/login" class="text-slate-800
font-[thin-font] underline text-sm font-bold">გაიგე მეტი</A>
           </div>
       </div>
    <A href={current() ? `${current() === "ხელოსანი" ? "xelosani" : "damkveti"}` : "#"} class="font-[thin-font] text-center text-lg font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">გაგრძელება როგორც {current()}</A>
</div>
}

export default Choose
