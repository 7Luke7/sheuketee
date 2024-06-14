import WomanSVG from "../../../../../public/svg-images/woman.svg"
import ManSVG from "../../../../../public/svg-images/man.svg"
import { Match, Switch, createSignal } from "solid-js";
import steps from "../steps.json"
import { A, createAsync, useNavigate } from "@solidjs/router"
import { check_user_gender, handle_user_gender } from "~/routes/api/xelosani/setup/setup";

const Gender = (props) => {
  const user_gender = createAsync(check_user_gender)
  const [current, setCurrent] = createSignal()
  const navigate = useNavigate()

  const handleGender = async () => {
    try {
      const response = await handle_user_gender(current())
      if (response !== 200) throw new Error(response)
      const steps_array = Object.keys(steps)
      const currentstepIndex = steps_array.indexOf(props.location.pathname.split("/")[4])
      const next_pathname = steps_array[currentstepIndex + 1]
      navigate(`/setup/xelosani/step/${next_pathname}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Switch>
      <Match when={!user_gender()}>
        <div class="flex flex-col justify-center mb-4">
          <div class="flex gap-x-5 items-center">
            <button onClick={() => setCurrent("კაცი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
              <div class="flex justify-between w-full">
                <img src={ManSVG}></img>
                <span type="radio" class={`w-[26px] h-[26px] ${current() === "კაცი" && "bg-dark-green"}  rounded-[50%] border-2 border-slate-300`}></span>
              </div>
              <h2 class="font-[normal-font] font-bold text-xl text-gr">კაცი</h2>
            </button>
            <button onClick={() => setCurrent("ქალი")} class="h-[220px] border w-1/2 flex flex-col items-start cursor-pointer gap-y-2 p-5 border-slate-300 rounded border-2">
              <div class="flex justify-between w-full">
                <img src={WomanSVG}></img>
                <span type="radio" class={`w-[26px] h-[26px] ${current() === "ქალი" && "bg-dark-green"}  rounded-[50%] border-2 border-slate-300`}></span>
              </div>
              <h2 class="font-[normal-font] font-bold text-xl text-gr">ქალი</h2>
            </button>
          </div>
          <button onClick={handleGender} className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
            გაგრძელება
          </button>
        </div>
      </Match>
      <Match when={user_gender()}>
        <div class="flex flex-col items-center">
          <p class="text-sm font-[normal-font] font-bold text-gray-700">თქვენ სქესი დამატებული გაქვთ გთხოვთ განაგრძოთ.</p>
          <A className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/xelosani/step/skills">გაგრძელება</A>
        </div>
      </Match>
    </Switch>
  );
};

export default Gender;
