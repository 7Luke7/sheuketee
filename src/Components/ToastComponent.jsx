import airPlane from "../svg-images/airplane.svg";
import closeIcon from "../svg-images/svgexport-12.svg";
import exclamationWhite from "../svg-images/exclamationWhite.svg";
import { createEffect, createSignal, onCleanup } from "solid-js";

export const Toast = (props) => {
    const [isExiting, setIsExiting] = createSignal(null)
    createEffect(() => {
    if (!props.toast()) return;
    let toastTimeout;
    let exitTimeout;
    toastTimeout = setTimeout(() => {
      setIsExiting(true);
      exitTimeout = setTimeout(() => {
        setIsExiting(false);
        props.setToast(null);
      }, 500);
    }, 5000);
    onCleanup(() => {
      if (toastTimeout) clearTimeout(toastTimeout);
      if (exitTimeout) clearTimeout(exitTimeout);
    });
  });
  return (
    <div
      id="toast-parentDiv"
      class={`${
        isExiting() ? "toast-exit" : "toast-enter"
      } fixed bottom-5 z-[200] left-1/2 -translate-x-1/2`}
      role="alert"
    >
      <div
        id="toast-div"
        class={`${
          !props.toast().type ? "border-red-400" : "border-dark-green-hover"
        } border flex relative bg-white space-x-4 rtl:space-x-reverse text-gray-500 border rounded-lg p-4 shadow items-center`}
      >
        <button
          id="toast-button"
          class="absolute top-1 right-3"
          onClick={() => props.setToast(null)}
        >
          <img id="toast-image" width={14} height={14} src={closeIcon}></img>
        </button>
        {!props.toast().type ? (
          <div id="toast-icon-wrapper" class="bg-red-500 rounded-full">
            <img id="toast-icon" src={exclamationWhite} />
          </div>
        ) : (
          <img id="toast-icon" class="rotate-[40deg]" src={airPlane} />
        )}
        <div
          id="toast-message"
          class={`${
            !props.toast().type && "text-red-600"
          } ps-4 border-l text-sm font-[normal-font]`}
        >
          {props.toast().message}
        </div>
      </div>
    </div>
  );
};
