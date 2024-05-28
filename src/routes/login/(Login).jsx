import { A } from "@solidjs/router"
import { createSignal } from "solid-js"
import { SmallFooter } from "~/Components/SmallFooter"

const Login = () => {
  const [chosen, setChosen] = createSignal("მეილი")

  return <div class="mx-12 mt-6">
    <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
    <div class="border w-[600px] mx-auto p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-5 justify-center items-center">
      <div class="flex gap-x-5">
        <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">შესვლა</h1>
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
        <div class="flex flex-wrap -mx-3 mb-2">
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
        <button type="submit" onClick={() => setStep(1)} class="font-[thin-font] text-center text-lg w-full font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">გაგრძელება</button>
      </form>
      <div class="flex items-center max-w-lg justify-start w-full">
        <hr class="flex-grow border-t border-gray-300"></hr>
        <span class="mx-4 text-gray-500 font-[thin-font] font-bold">ან</span>
        <hr class="flex-grow border-t border-gray-300"></hr>
      </div>
      <p class="text-center mt-1 font-[thin-font] font-bold text-sm text-gray-700">არ გაქვს ექაუნთი? <A href="/choose" class="text-gr underline">შექმნა</A></p>
    </div>
    <div class="mt-32">
      <SmallFooter></SmallFooter>
    </div>
  </div>
}

export default Login