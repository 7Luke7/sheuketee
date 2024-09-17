import { Header } from "~/Components/Header";
import {
  createSignal,
  Switch,
  Match,
  batch,
  onCleanup,
} from "solid-js";
import { createAsync } from "@solidjs/router";
import { create_job, get_location } from "../../api/damkveti/job";
import { NotAuthorized } from "~/Components/NotAuthorized";
import { CreateJobMap } from "./CreateJobMap";
import { Show } from "solid-js";
import { MileStoneModal } from "./MileStoneModal";
import spinner from "../../../../public/svg-images/spinner.svg";
import exclamationWhite from "../../../../public/svg-images/exclamationWhite.svg";
import closeIcon from "../../../../public/svg-images/svgexport-12.svg";
import airplane from "../../../../public/svg-images/airplane.svg";

const CreateJob = () => {
  const location = createAsync(get_location);
  const [mileStoneModal, setMileStoneModal] = createSignal(false);
  const [image, setImage] = createSignal([]);
  const [markedLocation, setMarkedLocation] = createSignal();
  const [error, setError] = createSignal(null);
  const [postUp, setPostUp] = createSignal(false);
  const [isExiting, setIsExiting] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [totalSize, setTotalSize] = createSignal(0);
  const [mileStone, setMileStone] = createSignal();
  const [toastError, setToastError] = createSignal();

  const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

  const removeMileStone = (index) => {
    setMileStone((a) => {
      const leftover = a.filter((c, i) => i !== index);
      return leftover;
    });
    if (!mileStone().length) {
      return setMileStoneModal(false)
    }
  };

  const addMileStone = () => {
    if (mileStone().length === 25)
      return setToastError("მაქსიმალური 25 ეტაპის რაოდენობა მიღწეულია.");
    setMileStone((a) => {
      return [
        ...a,
        {
          title: "",
          description: "",
          price: "",
        },
      ];
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return alert(`${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`);
      } else {
        setTotalSize((a) => (a += file.size));
      }
    }

    if (totalSize() > MAX_TOTAL_SIZE) {
      return alert("ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.");
    }

    setImage([...image(), ...files]);
  };

  const createPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData(e.target);

      for (let i in image()) {
        fd.append(`image${i}`, image()[i]);
      }
      const response = await create_job(
        fd,
        markedLocation() || location(),
        image().length,
        mileStone()
      );
      if (response.status === 500) {
        setToastError("დაფიქსირდა სერვერული შეცდომა, სცადეთ მოგვიანებით.")
      }
      if (response.status === 400) {
        setToastError(response.errors[0].message)
        return setError(response.errors);
      }

      document.getElementById("title").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("price").value = 1;
      const func = async () => {
        batch(() => {
          setPostUp(true);
          setImage([]);
          setMileStone(null)
          setMileStoneModal(false)
        });
      };
      await func();
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setPostUp(false);
          setIsExiting(false);
        }, 500);
      }, 5000);
    } catch (error) {
      alert(error);
    }
  };
  onCleanup(() => clearTimeout());

  return (
    <section>
      <Header></Header>
      <Switch>
        <Match when={location() && location() === 401}>
          <NotAuthorized></NotAuthorized>
        </Match>
        <Match when={location() && location() !== 401}>
          <h1 class="heading text-center font-bold text-2xl m-5 text-gray-800">
            დაამატე განცხადება
          </h1>
          <div class="flex w-full justify-center">
            <div class="flex w-[1200px] mt-2 border border-gray-300">
              <form
                onSubmit={createPost}
                class="editor mx-auto flex-1 flex flex-col text-gray-800 p-4 shadow-lg "
              >
                <input
                  class="bg-gray-100 font-[bolder-font] border border-gray-300 p-2 mb-2 outline-none"
                  spellcheck="false"
                  placeholder="სათაური"
                  onInput={(e) => setTitle(e.target.value)}
                  id="title"
                  maxLength={60}
                  name="title"
                  type="text"
                />
                <div class="flex mb-2 items-center text-gray-500 justify-between">
                  <Show when={error()?.some((a) => a.field === "title")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold">
                      {error().find((a) => a.field === "title").message}
                    </p>
                  </Show>
                  <div class="ml-auto text-gray-400 text-xs font-[thin-font]">
                    {title().length}/60
                  </div>
                </div>
                <textarea
                  class="font-[bolder-font] text-sm bg-gray-100 p-3 h-60 border border-gray-300 outline-none"
                  spellcheck="false"
                  name="description"
                  onInput={(e) => setInput(e.target.value)}
                  maxlength="600"
                  id="desc"
                  placeholder="აღწერეთ თქვენი განცხადების დეტალები"
                ></textarea>
                <div class="icons flex items-center text-gray-500 justify-between m-2">
                  <Show when={error()?.some((a) => a.field === "description")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold">
                      {error().find((a) => a.field === "description").message}
                    </p>
                  </Show>
                  <div class="count ml-auto text-gray-400 text-xs font-[thin-font]">
                    {input().length}/600
                  </div>
                </div>
                <div class="flex items-center mb-4">
                  <input
                    class="bg-gray-100 font-[bolder-font] w-3/12 border border-gray-300 p-2 outline-none"
                    placeholder="ფასი"
                    min={1}
                    id="price"
                    name="price"
                    value={1}
                    type="number"
                  />
                  <Show when={error()?.some((a) => a.field === "price")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold mb-2">
                      {error().find((a) => a.field === "price").message}
                    </p>
                  </Show>
                  <span class="text-2xl font-[bolder-font]">₾</span>
                  <span class="text-lg font-[bolder-font] mx-3 text-gr">
                    ან
                  </span>
                  <a
                    href="#milestoneWrapper"
                    onClick={() => {
                      if (mileStoneModal() == false) {
                        document.location.href = "#";
                        if (!mileStone()) {
                          setMileStone([
                            {
                              title: "",
                              description: "",
                              price: "",
                            },
                          ]);
                        }
                      }
                      setMileStoneModal((m) => !m);
                    }}
                    class="bg-gray-800 px-4 py-2 w-full font-[thin-font] text-sm hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]"
                  >
                    {mileStoneModal() == false ? (
                      "დაყოფა ეტაპებად"
                    ) : (
                      <div class="flex gap-x-1 items-center justify-center">
                        <img src={spinner} class="animate-spin" />
                        გაუქმება
                      </div>
                    )}
                  </a>
                </div>
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-[bolder-font]">
                          ასატვირთად დააჭირე
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG. (მაქს. 5MB)
                      </p>
                    </div>
                    <input
                      onChange={(e) => handleFileChange(e)}
                      name="files[]"
                      multiple
                      accept="image/jpeg, image/png, image/gif, image/webp, image/avif, image/svg+xml"
                      id="dropzone-file"
                      type="file"
                      class="hidden"
                    />
                  </label>
                </div>
                <Show when={image()}>
                  <div class="flex flex-col gap-y-5 mt-4 w-full">
                    <For each={image()}>
                      {(l, index) => (
                        <div class="bg-[#F5F7FB] h-[70px] rounded-[16px] w-full py-2 px-8">
                          <div class="flex items-center justify-between">
                            <span class="truncate pr-3 text-base font-[normal-font] text-[#07074D]">
                              {l.name}
                            </span>
                            <button
                              onClick={() => {
                                setImage(
                                  image().filter((_, i) => i !== index())
                                );
                              }}
                              class="text-[#07074D]"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                                  fill="currentColor"
                                />
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                          <div class="flex flex-col relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                            <div class="w-full z-10 absolute h-full flex-1 rounded-lg bg-dark-green"></div>
                            <span class="mt-2">
                              {(l.size / (1024 * 1024)).toFixed(2)}MB
                            </span>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                <div class="buttons flex items-center w-full mt-3">
                  <button
                    type="submit"
                    class="border border-gray-300 rounded-[16px] p-1 px-4 w-full text-center font-semibold cursor-pointer text-gray-200 ml-2 bg-dark-green"
                  >
                    პოსტის გამოქვეყნება
                  </button>
                </div>
              </form>
              <CreateJobMap
                location={location}
                markedLocation={markedLocation}
                setMarkedLocation={setMarkedLocation}
              ></CreateJobMap>
            </div>
          </div>
        </Match>
      </Switch>
      <Show when={postUp()}>
        <div
          id="toast-simple"
          class={`${
            isExiting() ? "toast-exit" : "toast-enter"
          } fixed bottom-5 right-1/2 transform translate-x-1/2 z-[200]`}
          role="alert"
        >
          <div class="flex space-x-4 relative rtl:space-x-reverse text-gray-500 border-dark-green-hover border rounded-lg p-4 shadow items-center">
            <button
              class="absolute top-1 right-3"
              onClick={() => setPostUp(false)}
            >
              <img width={14} height={14} src={closeIcon}></img>
            </button>
            <img class="rotate-[40deg]" src={airplane} />
            <div class="ps-4 text-sm font-[normal-font]">
              განცხადება წარმატებით აიტვირთა.
            </div>
          </div>
        </div>
      </Show>
      <Show when={toastError()}>
        <div
          class={`${
            isExiting() ? "toast-exit" : "toast-enter"
          } fixed bottom-5 right-1/2 transform translate-x-1/2 z-[200]`}
          role="alert"
        >
          <div class="flex relative bg-white space-x-4 rtl:space-x-reverse text-gray-500 border-red-400 border rounded-lg p-4 shadow items-center">
            <button
              class="absolute top-1 right-3"
              onClick={() => setToastError(null)}
            >
              <img width={14} height={14} src={closeIcon}></img>
            </button>
            <div class="bg-red-500 rounded-full">
              <img src={exclamationWhite} />
            </div>
            <div class="ps-4 text-sm border-l text-red-600 font-[normal-font]">
              {toastError()}
            </div>
          </div>
        </div>
      </Show>
      <Show when={mileStoneModal()}>
        <MileStoneModal
          addMileStone={addMileStone}
          error={error}
          removeMileStone={removeMileStone}
          mileStone={mileStone}
          setMileStone={setMileStone}
        ></MileStoneModal>
      </Show>
    </section>
  );
};

export default CreateJob;
