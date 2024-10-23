import { MetaProvider } from "@solidjs/meta";
import { createAsync, useNavigate } from "@solidjs/router";
import { navigateToStep } from "~/routes/api/damkveti/step";
import { Match, Show, Switch } from "solid-js";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { Header } from "~/Components/Header";
import { get_damkveti } from "~/routes/api/user";
import { ModifyLocaitonModal } from "../modals/ModifyLocationModal";
import { ModifyAge } from "../modals/ModifyAge";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileRight } from "./ProfileRight";
import { Footer } from "~/Components/Footer";
import { FireworkConfetti } from "~/Components/FireworkConfetti";
import checkedGreen from "../../../svg-images/checkedGreen.svg"
import { Toast } from "~/Components/ToastComponent";

const Damkveti = (props) => {
  const user = createAsync(() => get_damkveti(props.params.id));
  const navigate = useNavigate();
  const [modal, setModal] = createSignal(null);
  const [toast, setToast] = createSignal();
  const [isExiting, setIsExiting] = createSignal(false);

  const handlenavigateToStep = async () => {
    try {
      const response = await navigateToStep();
      navigate(response);
    } catch (error) {
      console.log(error);
      alert("წარმოიშვა შეცდომა გთხოვთ ცადოთ მოგვიანებით.");
    }
  };
  const clickFN = (event) => {  
    if (
      !event.target.closest("#search_wrapper") &&
      !event.target.closest("#search_btn") &&
      !event.target.closest("#inner_search_wrapper") &&
      event.target.id !== "locationButton" && 
      event.target.id !== "daynumber" &&
      !event.target.closest("#yeardropdown") &&
      !event.target.closest("#modal") &&
      event.target.id !== "age"
    ) {
      setModal(null);
    }
  };
  
  createEffect(() => {
    document.addEventListener("click", clickFN);

    onCleanup(() => {
      document.removeEventListener("click", clickFN);
    });
  });

  return (
    <MetaProvider>
        <Header />
      <div class="relative">
        <div class="w-[90%] mx-auto relative mt-8">
          <Show when={user()}>
            <Show when={modal()}>
              <div
                id="modal"
                class="bg-white shadow-2xl z-40 top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2  border fixed p-4"
              >
                <Switch>
                  <Match when={modal() === "ლოკაცია"}>
                    <ModifyLocaitonModal
                      setModal={setModal}
                      setIsExiting={setIsExiting}
                      setToast={setToast}
                      location={user().location}
                    ></ModifyLocaitonModal>
                  </Match>
                  <Match when={modal() === "ასაკი"}>
                    <ModifyAge
                      setModal={setModal}
                      setIsExiting={setIsExiting}
                      setToast={setToast}
                      date={user().date}
                    ></ModifyAge>
                  </Match>
                </Switch>
              </div>
            </Show>
            <Show when={user().status === 200 && !(user().stepPercent > 100)}>
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
              <ProfileLeft
                setIsExiting={setIsExiting}
                setToast={setToast}
                setModal={setModal}
                user={user}
              />
              <ProfileRight user={user} />
            </div>
            <Show when={!user().setupDone && user().stepPercent > 100}>
              <FireworkConfetti></FireworkConfetti>
                <div
                  id="completed-message"
                  class="fixed bottom-5 z-[200] left-1/2 -translate-x-1/2"
                  role="alert"
                >
                  <div class="border-dark-green-hover border gap-x-1 flex relative bg-white space-x-4 rtl:space-x-reverse text-gray-500 border rounded-lg p-4 shadow items-center">
                    <img src={checkedGreen}></img>
                    <p class="font-[thin-font] font-bold text-xs">გილოცავთ სეტაპი დასრულებულია.</p>
                  </div>
                </div>
            </Show>
          </Show>
          <div class={`${modal() && "pointer-events-none blur-[0.8px]"}`}>
            <Footer />
          </div>
        </div>
        <Show when={toast()}>
          <Toast toast={toast} setToast={setToast} isExiting={isExiting} setIsExiting={setIsExiting}></Toast>
        </Show>
      </div>
    </MetaProvider>
  );
};

export default Damkveti;
