import { createSignal } from "solid-js";
import hirer from "../../svg-images/hirer.svg";
import worker from "../../svg-images/worker.svg";
import { A } from "@solidjs/router";

const ResetPasswordStepOne = () => {
    const [current, setCurrent] = createSignal(null)

    return <div class="flex flex-col">
        <h1 class="font-bold mb-5 text-slate-900 text-xl font-[bolder-font]">
            თქვენი ექაუნთის ძებნა
        </h1>
    <div class="flex gap-x-5 h-[150px] items-center">
    <div
      onClick={() => setCurrent("ხელოსანი")}
      class="border w-1/2 flex flex-col h-full items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2"
    >
      <div class="flex justify-between w-full">
        <img src={worker}></img>
        <div
          class={`w-[26px] h-[26px] ${
            current() === "ხელოსანი" && "bg-dark-green"
          } rounded-[50%] border-2 border-slate-300`}
        ></div>
      </div>
      <h2 class="font-[thin-font] font-semibold text-xl">
        რეგისტრირებული როგორც ხელოსანი
      </h2>
    </div>
    <div
      onClick={() => setCurrent("დამკვეთი")}
      class="border w-1/2 flex flex-col h-full items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2"
    >
      <div class="flex justify-between w-full">
        <img src={hirer}></img>
        <div
          class={`w-[26px] h-[26px] ${
            current() === "დამკვეთი" && "bg-dark-green"
          } rounded-[50%] border-2 border-slate-300`}
        ></div>
      </div>
      <h2 class="font-[thin-font] font-semibold text-xl">
        რეგისტრირებული როგორც დამკვეთი
      </h2>
    </div>
  </div>
  <A href={current() ? `find/${current() === "ხელოსანი" ? "xelosani" : "damkveti"}` : "#"} class="font-[thin-font] w-full mt-5 text-center text-lg font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">გაგრძელება</A>
    </div>
}

export default ResetPasswordStepOne