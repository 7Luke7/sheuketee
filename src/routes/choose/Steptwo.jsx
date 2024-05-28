import { createSignal } from "solid-js"
import stepBack from "../../../public/svg-images/svgexport-25.svg"
import { A } from "@solidjs/router"

export const Steptwo = ({ setStep, current }) => {
  const [chosen, setChosen] = createSignal("მეილი")

  return <div class="flex-[10] border p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-5 justify-center items-center">
    <div class="flex gap-x-5">
      <img src={stepBack} class="cursor-pointer" onClick={() => setStep(0)}></img>
      <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">გაიარე რეგისტრაცია როგორც <span class="text-gr">{current()}</span></h1>
    </div>
    <form class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
            სახელი
          </label>
          <input class="appearance-none font-[normal-font] block w-full bg-gray-200 text-gray-700 border border-gray-200 leading-tight rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-first-name" type="text" placeholder="ლუკა" />
          {/* <p class="font-[thin-font] font-bold text-red-500 text-xs italic">გთხოვთ შეავსოთ ეს ჩარჩო.</p> */}
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
            გვარი
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="ჩიკვაიძე" />
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <div class="flex items-center justify-between">
            <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email-mobile">
              მეილი ან ტელ.ნომერი
            </label>
            <div class="flex items-center">
              <button type="button" onClick={() => setChosen("მეილი")} class={`font-[normal-font] border border-dark-green ${chosen() === "მეილი" ? "bg-dark-green text-white" : "text-gray-700"} tracking-wide px-2 py-1 rounded-l text-xs font-bold mb-2`}>მეილით</button>
              <button type="button" onClick={() => setChosen("ტელეფონი")} class={`font-[normal-font] tracking-wide border-dark-green ${chosen() === "ტელეფონი" ? "bg-dark-green text-white" : "text-gray-700"} border tracking-wide px-2 py-1 rounded-r text-xs font-bold mb-2`}>ტელეფონით</button>
            </div>
          </div>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email-mobile" type="email" placeholder="example@gmail.com" />
        </div>
        <div class="w-full px-3">
          <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            პაროლი
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
        </div>
      </div>
      <div class="flex gap-y-2 flex-col mt-5">
        <div class="flex items-center gap-x-2 justify-center">
          <input type="checkbox" name="rules-confirmation" id="must"></input>
          <label for="must" name="rules-confirmation" class="font-[thin-font] text-gr text-xs font-bold">წავიკითხე და ვეთანხმები <A href="/rules" class="underline" target="_blank">სერვისის წესებსა</A> და <A href="/conf" class="underline" target="_blank">კონფიდენციალურობის პოლიტიკას</A></label>
        </div>
        <button type="submit" onClick={() => setStep(1)} class="font-[thin-font] text-center text-lg font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">რეგისტრაცია როგორც {current()}</button>
      </div>
    </form>
  </div>
}