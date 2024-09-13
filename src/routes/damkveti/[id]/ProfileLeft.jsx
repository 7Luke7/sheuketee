import {
  Index,
  Match,
  batch,
  createSignal,
  Show,
  Switch,
  createEffect,
} from "solid-js";
import location from "../../../../public/svg-images/location.svg";
import telephone from "../../../../public/svg-images/telephone.svg";
import envelope from "../../../../public/svg-images/envelope.svg";
import defaultProfileSVG from "../../../../public/default_profile.png";
import CameraSVG from "../../../../public/svg-images/camera.svg";
import pen from "../../../../public/svg-images/pen.svg";
import cake from "../../../../public/svg-images/cake.svg";
import spinnerSVG from "../../../../public/svg-images/spinner.svg";
import jobApplication from "../../../../public/svg-images/job_application.svg";
import { A, action } from "@solidjs/router";
import { upload_profile_picture } from "../../api/user";

export const ProfileLeft = (props) => {
  const [imageLoading, setImageLoading] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal(
    props.user().profile_image || defaultProfileSVG
  );
  const [formattedDate, setFormattedDate] = createSignal("");
  const handleFormSubmission = action(async (FormData) => {
    setImageLoading(true);
    try {
      const formData = new FormData(e.target);
      console.log(formData, props.user().profId);
      const url = await upload_profile_picture(formData, props.user().profId);
      if (url) {
        batch(() => {
          setImageUrl(url);
          setImageLoading(false);
        });
      }
    } catch (error) {
      alert(error.message || "Failed to process image");
      setImageLoading(false);
    }
  });

  createEffect(() => {
    const user = props.user();
    if (user && user.date) {
      const date = new Date(user.date);
      const translatedDate = date.toLocaleDateString("ka-GE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setFormattedDate(translatedDate);
    }
  });

  return (
    <div class="flex sticky top-[50px] gap-y-3 flex-col">
      <div class="border-2 py-2 flex flex-col px-2 items-center flex-[2]">
        <Switch>
          <Match when={props.user().status !== 401}>
            <Switch>
              <Match when={!imageLoading()}>
                <div>
                  <form
                    id="uploadForm"
                    onSubmit={handleFormSubmission}
                    enctype="multipart/form-data"
                  >
                    <input
                      type="file"
                      name="profilePic"
                      class="hidden"
                      id="profilePic"
                      accept="image/webp, image/png, image/jpeg, image/avif, image/jpg"
                    />
                  </form>

                  <label
                    for="profilePic"
                    class="hover:opacity-[0.7] cursor-pointer"
                  >
                    <div class="relative">
                      <img
                        id="prof_pic"
                        src={imageUrl()}
                        alt="Profile"
                        class="border-2 w-[130px] h-[130px] rounded-[50%] border-solid border-[#14a800] mb-4"
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
                <div class="w-[190px] flex flex-col justify-center mb-4 items-center h-[180px] rounded-[50%] bg-[#E5E7EB]">
                  <img class="animate-spin" src={spinnerSVG} />
                  <p class="text-dark-green font-[thin-font] text-xs font-bold">
                    იტვირთება...
                  </p>
                </div>
              </Match>
            </Switch>
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
    </div>
  );
};
