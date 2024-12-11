import { Header } from "~/Components/Header";
import { get_xelosani } from "../../api/user";
import { createAsync, useNavigate } from "@solidjs/router";
import {
  Show,
  createEffect,
  Switch,
  Match,
  onCleanup,
  createSignal,
  lazy,
  Suspense
} from "solid-js";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileRight } from "./ProfileRight";
import { navigateToStep } from "~/routes/api/xelosani/setup/step";
import { MetaProvider } from "@solidjs/meta";
import { SmallFooter } from "~/Components/SmallFooter";

const FireworkConfetti = lazy(() => import("~/Components/FireworkConfetti"));
const Toast = lazy(() => import("~/Components/ToastComponent"));
const ModifyAge = lazy(() => import("../modals/ModifyAge"));
const ModifySkill = lazy(() => import("../modals/ModifySkills"));
const ModifyAbout = lazy(() => import("../modals/ModifyAbout"));
const ModifyWorkSchedule = lazy(() => import("../modals/ModifyWorkSchedule"));
const ModifyServiceFront = lazy(() => import("../modals/ModifyServiceFront"));

import checkedGreen from "../../../svg-images/checkedGreen.svg";

const Xelosani = (props) => {
  const user = createAsync(() => get_xelosani(props.params.id), {deferStream: true})
  const navigate = useNavigate();
  const [modal, setModal] = createSignal(null);
  const [toast, setToast] = createSignal();
  const [editingService, setEditingServiceTarget] = createSignal();

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
    const ignoreIds = [
      "daynumber",
      "locationButton",
      "schedule",
      "approve-modify",
      "delete-thumbnail-button",
      "div-button",
      "toast-button2",
      "toast-button",
      "age",
      "cancel-service-file-preview",
      "service_btn",
    ];

    const ignoreSelectors = [
      "#search_wrapper",
      "#search_btn",
      "#abort-service-update",
      "#inner_search_wrapper",
      "#yeardropdown",
      "#modal",
    ];

    const isIgnoredId = ignoreIds.includes(event.target.id);
    const isInsideModal = event.target.closest("#modal");
    const isInsideToast = event.target.closest("#toast-parentDiv");
    const isInsideIgnoredSelector = ignoreSelectors.some((selector) =>
      event.target.closest(selector)
    );

    if (
      isInsideModal ||
      isInsideToast ||
      isIgnoredId ||
      isInsideIgnoredSelector
    ) {
      return;
    }

    setModal(null);
  };

  createEffect(() => {
    if (!modal()) return
    document.addEventListener("click", clickFN);

    onCleanup(() => {
      document.removeEventListener("click", clickFN);
    });
  });

  return (
    <MetaProvider>    
      <Header />
      <Show when={user()} fallback={<div>Loading...</div>}>
        <div class="relative">
          <div class="w-[90%] mx-auto relative mt-8">
            <Show when={user().status === 200 && user().stepPercent !== 100}>
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
                setToast={setToast}
                setModal={setModal}
                profileId={props.params.id}
                user={user}
              />
              <ProfileRight
                user={user}
                setEditingServiceTarget={setEditingServiceTarget}
                setModal={setModal}
              />
            </div>
            <Suspense fallback={<div>Loading...</div>}>

            <Show when={modal()}>
              <div
                id="modal"
                class="bg-white shadow-2xl z-[10] top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2 border fixed p-4"
              >
                <Switch>
                  <Match when={modal() === "ლოკაცია"}>
                    <ModifyLocaitonModal
                      setModal={setModal}
                      setToast={setToast}
                      location={user().location}
                    ></ModifyLocaitonModal>
                  </Match>
                  <Match when={modal() === "ასაკი"}>
                    <ModifyAge
                      setModal={setModal}
                      setToast={setToast}
                      date={user().date}
                    ></ModifyAge>
                  </Match>
                  <Match when={modal() === "აღწერა"}>
                    <ModifyAbout
                      setModal={setModal}
                      setToast={setToast}
                      id={props.params.id}
                      about={user().about}
                    ></ModifyAbout>
                  </Match>
                  <Match when={modal() === "განრიგი"}>
                    <ModifyWorkSchedule
                      setModal={setModal}
                      setToast={setToast}
                      schedule={user().schedule}
                    ></ModifyWorkSchedule>
                  </Match>
                  <Match when={modal() === "სპეციალობა"}>
                    <ModifySkill
                      setModal={setModal}
                      setToast={setToast}
                      skills={user().skills}
                      parent={user().parent}
                      child={user().child} 
                      main={user().main}
                    ></ModifySkill>
                  </Match>
                  <Match when={modal() === "სერვისები"}>
                    <ModifyServiceFront
                      setModal={setModal}
                      profileId={props.params.id}
                      editingService={editingService}
                      setToast={setToast}
                      setEditingServiceTarget={setEditingServiceTarget}
                    ></ModifyServiceFront>
                  </Match>
                </Switch>
              </div>
            </Show>
            </Suspense>
            <Show when={!user().setup_done && user().stepPercent === 100}>
              <FireworkConfetti></FireworkConfetti>
              <div
                id="completed-message"
                class="fixed bottom-5 z-[200] left-1/2 -translate-x-1/2"
                role="alert"
              >
                <div class="border-dark-green-hover border gap-x-1 flex relative bg-white space-x-4 rtl:space-x-reverse text-gray-500 border rounded-lg p-4 shadow items-center">
                  <img loading="lazy" src={checkedGreen}></img>
                  <p class="font-[thin-font] font-bold text-xs">
                    გილოცავთ სეტაპი დასრულებულია.
                  </p>
                </div>
              </div>
            </Show>
            <div class={`mt-16 ${modal() && "pointer-events-none blur-[0.8px]"}`}>
              <SmallFooter></SmallFooter>
            </div>
          </div>
          <Show when={toast()}>
            <Toast toast={toast} setToast={setToast}></Toast>
          </Show>
        </div>
      </Show>
    </MetaProvider>
  );
};

export default Xelosani;
