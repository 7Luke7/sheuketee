import { EmailPassword } from "~/Components/EmailPassword"
import stepBack from "../../../public/svg-images/svgexport-25.svg"
import { A } from "@solidjs/router"
import { createSignal } from "solid-js";
import { RegisterUser } from "../api/authentication";

export const Steptwo = ({ setStep, current }) => {
  const [error, setError] = createSignal(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
      setError(null);
      const formData = new FormData(event.target);
      const result = await RegisterUser(formData, current());
      if (result.error) {
        setError(result.error);
      } else {
        location.href = `/setup`
      }
  };

  return <div class="flex-[10] border p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-5 justify-center items-center">
    <div class="flex gap-x-5">
      <img src={stepBack} class="cursor-pointer" onClick={() => setStep(0)}></img>
      <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">გაიარე რეგისტრაცია როგორც <span class="text-gr">{current()}</span></h1>
    </div>
    <form method="post" onSubmit={handleSubmit} class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
            სახელი
          </label>
          <input class="appearance-none font-[normal-font] block w-full bg-gray-200 text-gray-700 border border-gray-200 leading-tight rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-first-name" name="firstname" type="text" placeholder="ლუკა" />
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
            გვარი
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" name="lastname" placeholder="ჩიკვაიძე" />
        </div>
      </div>
      <EmailPassword></EmailPassword>
      <div class="flex gap-y-2 flex-col mt-5">
        <div class="flex items-center gap-x-2 justify-center">
          <input type="checkbox" name="rules-confirmation" class="accent-dark-green-hover" id="must"></input>
          <label for="must" name="rules-confirmation" class="font-[thin-font] text-gr text-xs font-bold">წავიკითხე და ვეთანხმები <A href="/rules" class="underline" target="_blank">სერვისის წესებსა</A> და <A href="/conf" class="underline" target="_blank">კონფიდენციალურობის პოლიტიკას</A></label>
        </div>
        <button type="submit" onClick={() => setStep(1)} class="font-[thin-font] text-center text-lg font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">რეგისტრაცია როგორც {current()}</button>
        {error() && <p class="text-red-500 text-xs font-[thin-font] font-bold mb-1">{error()}</p>}
      </div>
    </form>
  </div>
}