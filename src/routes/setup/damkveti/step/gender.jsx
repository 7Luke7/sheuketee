import WomanSVG from "../../../../../public/svg-images/woman.svg"
import ManSVG from "../../../../../public/svg-images/man.svg"
import { createSignal } from "solid-js";

const Gender = () => {
  const [current, setCurrent] = createSignal()

  return (
    <div class="flex flex-col justify-center mb-4">
      <div class="flex gap-x-5 items-center">
        <button onClick={() => setCurrent("კაცი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
          <div class="flex justify-between w-full">
            <img src={ManSVG}></img>
            <div class={`w-[26px] h-[26px] ${current() === "კაცი" && "bg-dark-green"} rounded-[50%] border-2 border-slate-300`}></div>
          </div>
          <h2 class="font-[normal-font] font-bold text-xl text-gr">კაცი</h2>
        </button>
        <button onClick={() => setCurrent("ქალი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
          <div class="flex justify-between w-full">
            <img src={WomanSVG}></img>
            <div class={`w-[26px] h-[26px] ${current() === "ქალი" && "bg-dark-green"}  rounded-[50%] border-2 border-slate-300`}></div>
          </div>
          <h2 class="font-[normal-font] font-bold text-xl text-gr">ქალი</h2>
        </button>
      </div>
      <button className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
        გაგრძელება
      </button>
    </div>
  );
};

export default Gender;
