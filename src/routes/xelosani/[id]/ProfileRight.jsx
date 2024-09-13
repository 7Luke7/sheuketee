import { A } from "@solidjs/router";
import { Match, Switch} from "solid-js";
import { Services } from "./Services";
import { ReviewCarousel } from "./ReviewCarousel";
import { SkillCarousel } from "./SkillCarousel";

export const ProfileRight = (props) => {
  return (
    <div class="flex flex-1 flex-col border-r px-3">
      <Switch>
        <Match when={props.user().about}>
          <div class="flex flex-col">
            <div class="flex justify-between items-center">
              <h2 class="font-[boldest-font] text-lg">ჩემს შესახებ</h2>
              <p class="text-xs font-[thin-font] font-bold">
                შემოუერთდა {props.user().creationDateDisplayable}
              </p>
            </div>
            <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">
              {props.user().about}
            </p>
          </div>
        </Match>
        <Match when={props.user().status === 200}>
          <div class="flex items-center justify-between">
            <A
              href="/setup/xelosani/step/about"
              class="mt-2 w-[150px] bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
            >
              დაამატე აღწერა
            </A>
            <p class="text-xs font-[thin-font] font-bold">
              შემოუერთდა {props.user().creationDateDisplayable}
            </p>
          </div>
        </Match>
        <Match when={props.user().status === 401}>
          <p class="text-gr text-xs font-[thin-font] font-bold">
            მომხმარებელს ინფორმაცია არ აქვს დამატებული.
          </p>
        </Match>
      </Switch>
      <Switch>
        <Match when={props.user().services}>
          <h2 class="text-lg font-[boldest-font] mt-5">სერვისები</h2>
          <Services status={props.user().status}></Services>
        </Match>
        <Match when={props.user().status === 200}>
          <A
            href="/setup/xelosani/step/services"
            class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
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
      <div class="flex items-center justify-between mt-5">
        <h2 class="text-lg font-[boldest-font]">მომხმარებლის შეფასებები</h2>
        <A
          href="#"
          class="underline text-xs text-gr font-[font-thin] font-bold"
        >
          ნახე ყველა
        </A>
      </div>
      <ReviewCarousel></ReviewCarousel>
      <h2 class="text-lg font-[boldest-font] mt-5">ხელობა/სპეციალობა</h2>
      <div class="mt-2">
        <section class="w-full flex">
            <Switch>
              <Match when={props.user().skills}>
                <SkillCarousel skills={props.user().skills}></SkillCarousel>
              </Match>
              <Match when={!props.user().skills}>
                <A
                  href="/setup/xelosani/step/skills"
                  class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ხელობა
                </A>
              </Match>
            </Switch>
        </section>
      </div>
    </div>
  );
};
