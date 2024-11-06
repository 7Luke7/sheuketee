import { Index, Match, createSignal, Show, Switch, batch } from "solid-js";
import location from "../../../svg-images/location.svg";
import telephone from "../../../svg-images/telephone.svg";
import envelope from "../../../svg-images/envelope.svg";
import defaultProfileSVG from "../../../default_profile.png";
import CameraSVG from "../../../svg-images/camera.svg";
import pen from "../../../svg-images/pen.svg";
import cake from "../../../svg-images/cake.svg";
import spinnerSVG from "../../../svg-images/spinner.svg";
import { A } from "@solidjs/router";
import { makeAbortable } from "@solid-primitives/resource";

export const ProfileLeft = (props) => {
  const [imageLoading, setImageLoading] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal(
    props.user().profile_image || defaultProfileSVG
  );
  const [file, setFile] = createSignal();
  const [signal,abort,filterErrors] = makeAbortable({timeout: 0, noAutoAbort: true});
  const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

  const handleProfileImageChange = async () => {
    setImageLoading(true)
    if (file().size > MAX_SINGLE_FILE_SIZE) {
      setImageLoading(false)
      return props.setToast({
        type: false,
        message: `${file().name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`
      });
    }
    const formData = new FormData();
    formData.append('profile_image', file());

    try {
      const response = await fetch(`/api/upload_profile_picture/${props.user().profId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: signal()
      });

      if (!response.ok) {
        setImageLoading(false)
        return props.setToast({
          message: "პროფილის ფოტო ვერ განახლდა, სცადეთ თავიდან.",
          type: false,
        });
      }

      const data = await response.text()
      if (data) {
        batch(() => {
          setFile(null);
          setImageLoading(false);
          props.setToast({
            message: "პროფილის ფოტო განახლებულია.",
            type: true,
          });
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
        setImageLoading(false)
      }
    }
  };

  const handleFilePreview = async (file) => {
    setImageLoading(true);
    if (file.size > MAX_SINGLE_FILE_SIZE) {
      setImageLoading(false)
      return props.setToast({
        type: false,
        message: `${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`
      });
    }
    const formData = new FormData();
    formData.append('profile_image', file);
  
    try {
      const response = await fetch(`/api/preview_image/${props.user().profId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: signal()
      });      

      if (!response.ok) {
        return props.setToast({
          message: "ფოტო ვერ აიტვირთა, სცადეთ თავიდან.",
          type: false,
        });
      }

      const data = await response.text()
  
      if (data) {
        batch(() => {
          setFile(file);
          setImageUrl(data);
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setImageLoading(false)
    }
  };

  return (
    <div class="flex sticky top-[50px] gap-y-3 flex-col">
      <div class="border-2 py-2 flex flex-col min-w-[240px] px-2 items-center flex-[2]">
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
                        class="border-2 rounded-[50%] w-[140px] h-[140px] border-solid border-[#14a800] mb-4"
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
                <div class="flex flex-col justify-center mb-4 items-center w-[140px] h-[140px] rounded-[50%] bg-[#E5E7EB]">
                  <img
                    class="animate-spin"
                    src={spinnerSVG}
                    width={40}
                    height={40}
                  />
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
                onClick={() => abort()}
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
                src={imageUrl()}
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
                  href="/setup/xelosani/step/location"
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
              <Match when={props.user().phone && props.user().privacy.phone !== "დამალვა"}>
                <img src={telephone}></img>
                <p class="text-gr text-xs ml-1 font-[thin-font] font-bold">
                  {props.user().phone}
                </p>
              </Match>
              <Match when={props.user().status === 200 && !props.user().phone && props.user().privacy.phone !== "დამალვა"}>
                <A
                  href="/setup/xelosani/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ტელ. ნომერი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.phone !== "დამალვა"}>
                <img src={telephone}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  ტელ.ნომერი არ არის დამატებული
                </p>
              </Match>
              <Match when={props.user().privacy.phone === "დამალვა"}>
                <img src={telephone}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  ტელ.ნომერი დამალულია
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex px-2 pb-1 border-b items-center gap-x-1">
          <Switch>
              <Match when={props.user().email && props.user().privacy.email !== "დამალვა"}>
                <img src={envelope}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  {props.user().email}
                </p>
              </Match>
              <Match when={props.user().status === 200 && !props.user().email && props.user().privacy.email !== "დამალვა"}>
                <A
                  href="/setup/xelosani/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე მეილი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.email !== "დამალვა"}>
                <img src={envelope}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  მეილი არ არის დამატებული
                </p>
              </Match>
              <Match when={props.user().privacy.email === "დამალვა"}>
                <img src={envelope}></img>
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  მეილი დამალულია
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex pb-1 border-b px-2 items-center gap-x-1">
          <Switch>
              <Match when={props.user().date && props.user().privacy.birthDate !== "დამალვა"}>
                <div class="flex justify-between w-full items-center">
                  <div class="flex items-end pr-1 gap-x-2">
                    <img src={cake} />
                    <p class="text-gr text-xs font-[thin-font] font-bold">
                      {props.user().displayBirthDate}
                    </p>
                  </div>
                  <Show when={props.user().status === 200}>
                    <button onClick={() => props.setModal("ასაკი")}>
                      <img src={pen} id="age" width={14} />
                    </button>
                  </Show>
                </div>
              </Match>
              <Match when={props.user().status === 200 && !props.user().date && props.user().privacy.birthDate !== "დამალვა"}>
                <A
                  href="/setup/xelosani/step/age"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე დაბ. თარიღი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.birthDate !== "დამალვა"}>
              <div class="flex items-center">
              <div class="flex items-end gap-x-2">
                    <img src={cake} />
                    <p class="text-gr text-xs font-[thin-font] font-bold">
                      {props.user().displayBirthDate}
                    </p>
                  </div>
                <p class="text-gr text-xs text-center font-[thin-font] font-bold">
                  ასაკი არ არის დამატებული  
                </p>
                </div>
              </Match>
              <Match when={props.user().privacy.birthDate === "დამალვა"}>
              <div class="flex items-center">
              <div class="flex items-end gap-x-2">
                    <img src={cake} />
                    <p class="text-gr text-xs font-[thin-font] font-bold">
                      {props.user().displayBirthDate}
                    </p>
                  </div>
                <p class="text-gr text-xs text-center font-[thin-font] font-bold">
                  ასაკი დამალულია
                </p>
                </div>
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
      <div class="border-2 px-2 py-2">
        <div class="flex items-center border-b justify-between">
          <h2 class="text-lg font-[bolder-font]">სამუშაო განრიგი</h2>
          <Show when={props.user().status === 200 && props.user().schedules}>
            <button onClick={() => props.setModal("განრიგი")}>
              <img src={pen} id="schedule" />
            </button>
          </Show>
        </div>
        <Switch>
          <Match when={props.user().schedules}>
            <ul class="mt-1">
              <For each={props.user().schedules}>
                {(s, i) => (
                  <li class="font-[thin-font] w-full items-center justify-between text-sm font-bold flex gap-x-2">
                    <p>{s.day_of_week}</p>
                    <div class="flex items-center">
                      <p>{s.available_from}</p>-<p>{s.available_to}</p>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Match>
          <Match when={props.user().status === 401}>
            <div class="flex items-center justify-center pt-2 border-t">
              <p class="font-[thin-font] text-gr text-sm font-bold">
                განრიგი ცარიელია
              </p>
            </div>
          </Match>
          <Match when={props.user().status === 200}>
            <div class="flex items-center justify-center pt-2 border-t">
              <A
                href="/setup/xelosani/step/schedule"
                class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე განრიგი
              </A>
            </div>
          </Match>
        </Switch>
      </div>
      <div class="border-2 px-2 py-2">
        <h2 class="text-lg font-[bolder-font] border-b">საშუალო შეფასება</h2>

        <Switch>
          <Match when={false}>
            <div class="block mt-2">
              <div class="flex items-center mb-2">
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-dark-green-hover rounded-full"
                    style="width: 70%"
                  ></div>
                </div>
                <span class="text-sm font-[thin-font] font-bold text-gr ">
                  4%
                </span>
              </div>
              <div class="flex items-center mb-2">
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-dark-green-hover rounded-full"
                    style="width: 9%"
                  ></div>
                </div>
                <span class="text-sm font-[thin-font] font-bold text-gr ">
                  4%
                </span>
              </div>
              <div class="flex items-center mb-2">
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-dark-green-hover rounded-full"
                    style="width: 4%"
                  ></div>
                </div>
                <span class="text-sm font-[thin-font] font-bold text-gr ">
                  4%
                </span>
              </div>
              <div class="flex items-center mb-2">
                <img src={fullStar} width={15} height={15}></img>
                <img src={fullStar} width={15} height={15}></img>
                <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-dark-green-hover rounded-full"
                    style="width: 2%"
                  ></div>
                </div>
                <span class="text-sm font-[thin-font] font-bold text-gr ">
                  4%
                </span>
              </div>
              <div class="flex items-center mb-2">
                <img src={fullStar} width={15} height={15}></img>
                <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-dark-green-hover rounded-full"
                    style="width: 1%"
                  ></div>
                </div>
                <span class="text-sm font-[thin-font] font-bold text-gr ">
                  4%
                </span>
              </div>
            </div>
          </Match>
          <Match when={true}>
            <p class="text-xs text-gr mt-2 text-center font-[thin-font] font-bold">
              მომხმარებელი არ არის შეფასებული.
            </p>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
