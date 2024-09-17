import {
  Index,
  Match,
  batch,
  createSignal,
  Show,
  Switch,
  onCleanup,
} from "solid-js";
import location from "../../../../public/svg-images/location.svg";
import telephone from "../../../../public/svg-images/telephone.svg";
import envelope from "../../../../public/svg-images/envelope.svg";
import defaultProfileSVG from "../../../../public/default_profile.png";
import CameraSVG from "../../../../public/svg-images/camera.svg";
import pen from "../../../../public/svg-images/pen.svg";
import closeIcon from "../../../../public/svg-images/svgexport-12.svg";
import airPlane from "../../../../public/svg-images/airplane.svg";
import cake from "../../../../public/svg-images/cake.svg";
import spinnerSVG from "../../../../public/svg-images/spinner.svg";
import jobApplication from "../../../../public/svg-images/job_application.svg";
import { A } from "@solidjs/router";
import { preview_image, upload_profile_picture } from "../../api/user";

export const ProfileLeft = (props) => {
  const [imageLoading, setImageLoading] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal(
    props.user().profile_image || defaultProfileSVG
  );
  const [file, setFile] = createSignal()

  const handleProfileImageChange = async () => {
    if (imageLoading()) {
    }
  
    setImageLoading(true);
    try {
      const response = await upload_profile_picture(
        file(),
        props.user().profId
      );
      if (response) {
        batch(() => {
          setFile(null);
          setImageLoading(false);
          props.setToast({
            message: "პროფილის ფოტო განახლებულია.",
            type: true,
          });
          setTimeout(() => {
            props.setIsExiting(true);
            setTimeout(() => {
              props.setIsExiting(false);
              props.setToast(null)
            }, 500);
          }, 5000);
        });
      }
    } catch (error) {
      alert(error.message || "Failed to process image");
      setImageLoading(false);
    }
  };

  onCleanup(() => clearTimeout());
  const handleFilePreview = async (file) => {
    setImageLoading(true)
    try {
      const response = await preview_image(file, props.user().profId)
      if (response) {
        batch(() => {
          setFile(file)
          setImageLoading(false)
          setImageUrl(response)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div class="flex sticky top-[50px] gap-y-3 flex-col">
      <div class="border-2 py-2 flex flex-col px-2 items-center flex-[2]">
        <Switch>
        <Match when={props.user().status !== 401}>
            <Switch>
              <Match when={!imageLoading()}>
                <div>
                  <input
                    type="file"
                    name="profilePic"
                    class="hidden"
                    onChange={(e) => handleFilePreview(e.target.files[0])}
                    id="profilePic"
                    accept="image/webp, image/png, image/jpeg, image/webp, image/avif, image/jpg"
                  />
                  <label
                    for="profilePic"
                    class="hover:opacity-[0.7] cursor-pointer"
                  >
                    <div class="relative">
                      <img
                        id="prof_pic"
                        src={imageUrl()}
                        alt="Profile"
                        class="border-2 rounded-[50%] border-solid border-[#14a800] mb-4"
                      />
                      <img
                        src={CameraSVG}
                        alt="camera"
                        class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]"
                      />
                      <span class="bottom-1 right-4 absolute w-5 h-5 bg-[#14a800] border-2 border-indigo-100 rounded-full"></span>
                    </div>
                  </label>
                </div>
              </Match>
              <Match when={imageLoading()}>
                <div class="flex flex-col justify-center mb-4 items-center w-[130px] h-[130px] rounded-[50%] bg-[#E5E7EB]">
                  <img class="animate-spin" src={spinnerSVG} width={40} height={40} />
                  <p class="text-dark-green font-[thin-font] text-xs font-bold">
                    იტვირთება...
                  </p>
                </div>
              </Match>
            </Switch>
            <Show when={file() && !imageLoading()}>
            <button
                onClick={handleProfileImageChange}
                class="mb-2 bg-dark-green hover:bg-dark-green-hover w-[150px] text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
              >
               ფოტოს დაყენება
              </button>
            </Show>
            <Show when={imageLoading()}>
            <button
                onClick={handleProfileImageChange}
                class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
              >
                გაუქმება 
              </button>
            </Show>
          </Match>
          <Match when={props.user().status === 401}>
            <div class="relative">
              <img
                id="prof_pic"
                class="w-[130px] border-2 border-solid border-[#108a00] rounded-[50%] h-[130px]"
                src={props.user().profile_image || defaultProfileSVG}
              ></img>
              <span class="bottom-1 right-4 absolute w-5 h-5 bg-[#108a00] border-2 border-white rounded-full"></span>
            </div>
          </Match>
        </Switch>
        <h1 class="text-xl font-[boldest-font] text-gray-900">
          {props.user().firstname + " " + props.user().lastname}
        </h1>

        <div class="flex flex-col w-full justify-start mt-2 gap-y-2">
          <div class="flex pb-1 border-b px-2 items-center gap-x-1">
            <Switch>
              <Match when={props.user().location}>
                <div class="flex items-center w-full gap-x-2">
                  <img src={location}></img>
                  <p class="text-gr text-xs font-[thin-font] break-word font-bold">
                    {props.user().location.display_name.substr(0, 20)}.
                  </p>
                </div>
                <Show when={props.user().status === 200}>
                  <button onClick={() => props.setModal("ლოკაცია")}>
                    <img id="locationButton" src={pen} />
                  </button>
                </Show>
              </Match>
              <Match when={props.user().status === 200}>
                <A
                  href="/setup/damkveti/step/location"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ლოკაცია
                </A>
              </Match>
              <Match when={props.user().status === 401}>
                <img src={location}></img>
                <p class="text-gr text-xs font-[thin-font] font-bold">
                  არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex pb-1 px-2 border-b items-center gap-x-1">
            <Switch>
              <Match when={props.user().phone}>
                <img src={telephone}></img>
                <p class="text-gr text-xs ml-1 font-[thin-font] font-bold">
                  {props.user().phone}
                </p>
              </Match>
              <Match when={props.user().status === 200}>
                <A
                  href="/setup/damkveti/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ტელ. ნომერი
                </A>
              </Match>
              <Match when={props.user().status === 401}>
                <img src={telephone}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex px-2 pb-1 border-b items-center gap-x-1">
            <Switch>
              <Match when={props.user().email}>
                <img src={envelope}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  {props.user().email}
                </p>
              </Match>
              <Match when={props.user().status === 200}>
                <A
                  href="/setup/damkveti/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე მეილი
                </A>
              </Match>
              <Match when={props.user().status === 401}>
                <img src={envelope}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex pb-1 px-2 items-center gap-x-1">
            <Switch>
              <Match when={props.user().date}>
                <div class="flex justify-between w-full items-center">
                  <div class="flex items-end gap-x-2">
                    <img src={cake} />
                    <p class="text-gr text-xs font-[thin-font] font-bold">
                      {new Date(props.user().date).toLocaleDateString("ka-GE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Show when={props.user().status === 200}>
                    <button onClick={() => props.setModal("ასაკი")}>
                      <img src={pen} id="age" width={14} />
                    </button>
                  </Show>
                </div>
              </Match>
              <Match when={props.user().status === 200}>
                <A
                  href="/setup/damkveti/step/age"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე დაბ. თარიღი
                </A>
              </Match>
              <Match when={props.user().status === 401}>
                <p class="text-gr text-xs text-center font-[thin-font] font-bold">
                  ასაკი არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          {props.user().avgrating && (
            <div class="flex">
              <Index each={new Array(3)}>
                {() => {
                  return (
                    <div>
                      <img src={fullStar}></img>
                    </div>
                  );
                }}
              </Index>
              <Index each={new Array(5 - 3)}>
                {() => {
                  return (
                    <div>
                      <img src={emptyStar}></img>
                    </div>
                  );
                }}
              </Index>
            </div>
          )}
        </div>
      </div>
      <div class="border-2 py-2 flex flex-col px-2 flex-[2]">
        <div class="flex pb-1 px-2 border-b items-center gap-x-1">
          <Switch>
            <Match when={props.user().phone}>
              <img src={jobApplication}></img>
              <p class="text-gr text-xs ml-1 font-[thin-font] font-bold">
                25 განცხადება
              </p>
            </Match>
            <Match when={props.user().status === 200}>
              <A
                href="/setup/damkveti/step/contact"
                class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე ტელ. ნომერი
              </A>
            </Match>
            <Match when={props.user().status === 401}>
              <img src={jobApplication}></img>
              <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                არ არის დამატებული
              </p>
            </Match>
          </Switch>
        </div>
      </div>
      <Show when={props.toast()}>
        <div
          class={`${
            props.isExiting() ? "toast-exit" : "toast-enter"
          } fixed bottom-5 z-[200] left-1/2 -translate-x-1/2`}
          role="alert"
        >
          <div class={`${!props.toast().type ? "border-red-400" : "border-dark-green-hover"} border flex relative bg-white space-x-4 rtl:space-x-reverse text-gray-500 border rounded-lg p-4 shadow items-center`}>
            <button
              class="absolute top-1 right-3"
              onClick={() => props.setToast(null)}
            >
              <img width={14} height={14} src={closeIcon}></img>
            </button>
              {!props.toast().type ? <div class="bg-red-500 rounded-full">
                <img src={exclamationWhite} />
                </div> : <img class="rotate-[40deg]" src={airPlane} />}
            <div class={`${!props.toast().type  && "text-red-600"} ps-4 border-l text-sm font-[normal-font]`}>
              {props.toast().message}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
