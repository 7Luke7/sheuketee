import { Header } from "~/Components/Header";
import { get_xelosani } from "../../api/user";
import { createAsync, useNavigate } from "@solidjs/router";
import { Footer } from "~/Components/Footer";
import {
  Show,
  createEffect,
  Switch,
  Match,
  onCleanup,
  createSignal,
} from "solid-js";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileRight } from "./ProfileRight";
import { navigateToStep } from "~/routes/api/xelosani/setup/step";
import { ModifyLocaitonModal } from "../modals/ModifyLocationModal";
import { ModifyWorkSchedule } from "../modals/ModifyWorkSchedule";
import { ModifyAge } from "../modals/ModifyAge";
import { MetaProvider, Link } from "@solidjs/meta";

const Xelosani = (props) => {
  const user = createAsync(async () =>
    JSON.parse(await get_xelosani(props.params.id))
  );
  const navigate = useNavigate();
  const [modal, setModal] = createSignal(null);

  const handlenavigateToStep = async () => {
    try {
      const response = await navigateToStep();
      navigate(response);
    } catch (error) {
      console.log(error);
      alert("წარმოიშვა შეცდომა გთხოვთ ცადოთ მოგვიანებით.");
    }
  };
  const clickFN =  (event) => {
    if (!event.target.closest('#modal') && !event.target.closest("#search_wrapper") && !event.target.closest("#search_btn") && !event.target.closest("#inner_search_wrapper") && event.target.id !== "daynumber" && !event.target.closest("#yeardropdown") && event.target.id !== "locationButton" && !event.target.closest('#modal') && event.target.id !== "age") {
        setModal(null);
    }

}
createEffect(() => {
    document.addEventListener("click", clickFN)

    onCleanup(() => {
        document.removeEventListener("click", clickFN)
    })
})
  return (
    <MetaProvider>
      <script
        defer
        src="https://unpkg.com/embla-carousel/embla-carousel.umd.js"
      ></script>
      <script
        defer
        src="https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js"
      ></script>

      <div class={`${modal() && "pointer-events-none blur-[0.8px]"}`}>
        <Header />
      </div>
      <div class="relative">
        <div class="w-[90%] mx-auto relative mt-8">
          <Show when={user()}>
            <Show when={modal()}>
              <div
                id="modal"
                class="bg-white shadow-2xl z-[50] top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2  border fixed p-4"
              >
                <Switch>
                  <Match when={modal() === "ლოკაცია"}>
                    <ModifyLocaitonModal
                      setModal={setModal}
                      location={user().location}
                    ></ModifyLocaitonModal>
                  </Match>
                  <Match when={modal() === "ასაკი"}>
                    <ModifyAge
                      setModal={setModal}
                      date={user().date}
                    ></ModifyAge>
                  </Match>
                  <Match when={modal() === "განრიგი"}>
                    <ModifyWorkSchedule
                      setModal={setModal}
                      schedule={user().schedule}
                    ></ModifyWorkSchedule>
                  </Match>
                </Switch>
              </div>
            </Show>
            <Show when={user().status === 200}>
              <div
                class={`${
                  modal() && "blur-[0.8px] pointer-events-none"
                } flex items-center justify-between mb-3`}
              >
                <div class="flex items-center w-full">
                  <div class="h-5 w-full rounded-[16px] bg-[#E5E7EB] relative">
                    <div
                      class="bg-dark-green rounded-[16px] h-full absolute"
                      style={{ width: `${user().stepPercent}%` }}
                    ></div>
                    <span class="font-[thin-font] text-[11px] text-green-800 font-bold absolute right-2 top-1/2 transform -translate-y-1/2">
                      {user().stepPercent}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={handlenavigateToStep}
                  class="py-1 w-1/6 text-center rounded-md text-xs font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover ml-2"
                >
                  სეტაპის გაგრძელება
                </button>
              </div>
            </Show>
            <div
              class={`${
                modal() && "blur-[0.8px] pointer-events-none"
              } flex items-start`}
            >
              <ProfileLeft setModal={setModal} user={user} />
              <ProfileRight user={user} />
            </div>
          </Show>
          <div class={`${modal() && "pointer-events-none blur-[0.8px]"}`}>
            <Footer />
          </div>
        </div>
      </div>
    </MetaProvider>
  );
};

export default Xelosani;
