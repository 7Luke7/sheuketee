import { A } from "@solidjs/router";
import { Match, Switch, Suspense, Show, startTransition } from "solid-js";
import { Services } from "./Services";
import { SkillCarousel } from "./SkillCarousel";
import pen from "../../../svg-images/pen.svg";

export const ProfileRight = (props) => {
  return (
    <div class="flex flex-1 flex-col border-r px-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-x-1">
          <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
            ჩემს შესახებ
          </h2>
          <Show when={props.user().status === 200 && props.user().about}>
            <button onClick={() => startTransition(() => props.setModal("აღწერა"))}>
              <img loading="lazy" id="locationButton" src={pen} />
            </button>
          </Show>
        </div>
        
        <p class="text-xs font-[thin-font] font-bold">
          შემოუერთდა {props.user().creationDateDisplayable}
        </p>
      </div>
      <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">
        {props.user().about}
      </p>
      
      <div class="flex items-center gap-x-1 mt-5">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          ხელობა/სპეციალობა
        </h2>
        <Show when={props.user().status === 200 && props.user().skills.length}>
          <button onClick={() => startTransition(() => props.setModal("სპეციალობა"))}>
            <img loading="lazy" id="locationButton" src={pen} />
          </button>
        </Show>
      </div>
      <div class="mt-2">
        <section class="w-full flex">
          <SkillCarousel skills={props.user().skills}></SkillCarousel>
        </section>
      </div>
      
      <div class="flex items-center gap-x-1 mt-5">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          სერვისები
        </h2>
      </div>
      <div class="mt-2">
        <Suspense fallback={<div>Loading Services...</div>}>
          <Switch>
            <Match when={props.user().services}>
              <Services
                services={props.user().services}
                setEditingServiceTarget={props.setEditingServiceTarget}
                setModal={props.setModal}
                status={props.user().status}
              ></Services>
            </Match>
            <Match when={props.user().status === 200}>
              <A
                href="/xelosani/services"
                class="px-4 py-2 mt-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე სერვისები
              </A>
            </Match>
            <Match when={props.user().status === 401}>
              <p class="text-gr text-xs font-[thin-font] font-bold">
                მომხმარებელს ინფორმაცია არ აქვს დამატებული.
              </p>
            </Match>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};
