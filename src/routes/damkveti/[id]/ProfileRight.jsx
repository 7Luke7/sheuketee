import { A } from "@solidjs/router";
import { Match, Switch } from "solid-js";

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
              href="/setup/damkveti/step/about"
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
        <Match when={props.user().status === 200}>
         
        </Match>
      </Switch>
    </div>
  );
};
