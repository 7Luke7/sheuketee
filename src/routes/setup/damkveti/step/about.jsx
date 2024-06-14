import { createSignal } from "solid-js";

const About = () => {
  const [about, setAbout] = createSignal("")
  return (
    <div class="flex flex-col items-center mb-4">
          <textarea
            onInput={(e) => setAbout(e.target.value)}
            class="w-full resize rounded-lg p-3 pb-5 text-sm text-gr font-bold font-[thin-font] placeholder-gray-400 outline-none transition-colors duration-300 ease-in-out scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:placeholder-gray-400 focus:border-[#108a00] border-2 border-[#108a00] focus:ring-0 focus:ring-offset-0"
            maxlength="600" id="with-avatar-focused" placeholder="აღწერეთ თქვენი უნარები, გამოცდილებები..." rows="5" cols="50"></textarea>
          <p class="flex w-full items-center justify-between text-xs">
            <span class="font-[thin-font] text-gray-900 font-bold">თქვენს შესახებ</span>
            <span id="with-avatar-focused-character-count" class="text-slate-500 transition-colors duration-300 ease-in-out">{about().length}/600</span>
          </p>
          <button className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
          გაგრძელება
        </button>
      </div>
  );
};

export default About;
