import { A } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { Services } from "./Services";
import { SkillCarousel } from "./SkillCarousel";
import pen from "../../../svg-images/pen.svg";

export const ProfileRight = (props) => {
  return (
    <div class="flex flex-1 flex-col border-r px-3">
      <div class="flex justify-between items-center">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          ჩემს შესახებ
        </h2>
        <p class="text-xs font-[thin-font] font-bold">
          შემოუერთდა {props.user().creationDateDisplayable}
        </p>
      </div>
      <Switch>
        <Match when={props.user().about}>
          <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">
            {props.user().about}
          </p>
        </Match>
        <Match when={props.user().status === 200}>
          <div class="flex items-center justify-between">
            <A
              href="/setup/xelosani/step/about"
              class="px-4 py-2 mt-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
            >
              დაამატე აღწერა
            </A>
          </div>
        </Match>
        <Match when={props.user().status === 401}>
          <p class="text-gr text-xs font-[thin-font] font-bold">
            მომხმარებელს ინფორმაცია არ აქვს დამატებული.
          </p>
        </Match>
      </Switch>
      <div class="flex items-center gap-x-1 mt-5">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          ხელობა/სპეციალობა
        </h2>
        <Show
          when={
            props.user().status === 200 &&
            props.user().skills.displayableSkills.length
          }
        >
          <button onClick={() => props.setModal("სპეციალობა")}>
            <img id="locationButton" src={pen} />
          </button>
        </Show>
      </div>
      <div class="mt-2">
        <section class="w-full flex">
          <Switch>
            <Match when={!props.user().skills.displayableSkills.length}>
              <button
                id="locationButton"
                type="button"
                onClick={() => props.setModal("სპეციალობა")}
                class="px-4 py-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე სპეციალობა
              </button>
            </Match>
            <Match when={props.user().skills}>
              <SkillCarousel skills={props.user().skills}></SkillCarousel>
            </Match>
            <Match when={!props.user().skills}>
              <A
                href="/setup/xelosani/step/skills"
                class="px-4 py-2 mt-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე სპეციალობა
              </A>
            </Match>
            <Match when={!props.user().skills && !props.user().setupDone}>
              <A
                href="/setup/xelosani/step/skills"
                class="px-4 py-2 mt-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე სპეციალობა
              </A>
            </Match>
          </Switch>
        </section>
      </div>
      <div class="flex items-center gap-x-1 mt-5">
        <h2 class="font-[bolder-font] font-bold text-gray-900 text-lg">
          სერვისები
        </h2>
      </div>
      <div class="mt-2">
        <Switch>
          <Match when={props.user().services}>
            <Services status={props.user().status}></Services>
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
      </div>
    </div>
  );
};
