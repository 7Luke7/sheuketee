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
import uploadIcon from "../../../../public/svg-images/uploadIcon.svg";

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
  const [mileStone, setMileStone] = createSignal([]);
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
          price: null,
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
  let toastTimeout;
  let exitTimeout;

  const createPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData(e.target);

      for (let i in image()) {
        fd.append(`image${i}`, image()[i]);
      }
      if (!fd.get("title").length) {
        return setError([
          {
            field: "title",
            message: "სათაური სავალდებულოა."
          }
        ])
      }
      if (fd.get("title").length > 60) {
        return setError([
          {
            field: "title",
            message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
          }
        ])
      }

      if (!fd.get("description").length) {
        return setError([
          {
            field: "description",
            message: "აღწერა სავალდებულოა."
          }
        ])
      }
      if (fd.get("description").length > 600) {
        return setError([
          {
            field: "description",
            message: "აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს."
          }
        ])
      }
      if (!mileStoneModal() && !fd.get("price")) {
        return setError([
          {
            field: "price",
            message: "ფასი სავალდებულოა თუ ეტაპები არ გაქვთ."
          }
        ])
      }
      if (mileStone()) {
        return mileStone().find((milestone, index) => {
          if (!milestone.title.length) {
            setToastError(`${index + 1} ეტაპის სათაური სავალდებულოა.`)
            return setError([
              {
                field: `mileStones.${index}.title`,
                message: "ეტაპის სათაური სავალდებულოა."
              }
            ])
          }
          if (milestone.title.length > 60) {
            setToastError(`${index + 1} ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.`)
            return setError([
              {
                field: `mileStones.${index}.title`,
                message: "ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
              }
            ])
          }
    
          if (!milestone.description.length) {
            setToastError(`${index + 1} ეტაპის აღწერა სავალდებულოა.`)
            return setError([
              {
                field: `mileStones.${index}.description`,
                message: "ეტაპის აღწერა სავალდებულოა."
              }
            ])
          }
          if (milestone.description.length > 600) {
            setToastError(`${index + 1} ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.`)
            return setError([
              {
                field: `mileStones.${index}.description`,
                message: "ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს."
              }
            ])
          }
          if (!milestone.price) {
            setToastError(`${index + 1} ეტაპის ფასი სავალდებულოა.`)
            return setError([
              {
                field: `mileStones.${index}.description`,
                message: "ეტაპის ფასი სავალდებულოა."
              }
            ])
          }
        })
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
      document.getElementById("price").value = null;
      const func = async () => {
        batch(() => {
          setPostUp(true);
          setImage([]);
          setMileStone(null)
          setMileStoneModal(false)
        });
      };
      await func();
     
      toastTimeout = setTimeout(() => {
        setIsExiting(true);
        exitTimeout = setTimeout(() => {
          setIsExiting(false);
          setPostUp(null);
        }, 500);
      }, 5000);

      onCleanup(() => {
        if (toastTimeout) clearTimeout(toastTimeout);
        if (exitTimeout) clearTimeout(exitTimeout);
      });
    } catch (error) {
      alert(error);
    }
  };
  
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
                    {title().trim().length}/60
                  </div>
                </div>
                <textarea
                  class="font-[bolder-font] text-sm bg-gray-100 p-3 h-60 border border-gray-300 outline-none"
                  spellcheck="false"
                  name="description"
                  onInput={(e) => setInput(e.target.value)}
                  maxlength={600}
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
                    {input().trim().length}/600
                  </div>
                </div>
                <div class="flex items-center mb-4">
                  <input
                    class={`bg-gray-100 font-[bolder-font] ${mileStoneModal() ? "w-7/12" : "w-3/12"} border border-gray-300 p-2 outline-none`}
                    placeholder={mileStoneModal() ? "ფასი ან ეტაპების ფასი შეიკრიბება." : "ფასი"}
                    min={1}
                    id="price"
                    name="price"
                    type="number"
                  />
                  <span class="text-2xl font-[bolder-font]">₾</span>
                  <span class="text-lg font-[bolder-font] mx-3 text-gr">
                    ან
                  </span>
                  <a
                    href="#milestoneWrapper"
                    onClick={() => {
                      setMileStoneModal((prev) => {
                        const newState = !prev;
                    
                        // If the modal is being closed, reset the milestone array to empty
                        if (!newState) {
                          document.location.href = "#";
                          setMileStone([]);
                        } else {
                          // If the modal is being opened, initialize the milestone
                          setMileStone([
                            {
                              title: "",
                              description: "",
                              price: null,
                            },
                          ]);
                        }
                    
                        return newState; // Return the new state for mileStoneModal
                      });
                    
                    }}
                    class={`bg-gray-800 px-4 py-2 ${mileStoneModal() ? "w-[200px]" : "w-full"} font-[thin-font] text-sm hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]`}
                  >
                    {mileStoneModal() == false ? (
                      "დაყოფა ეტაპებად"
                    ) : (
                      <div class="flex gap-x-1 items-center justify-center">
                        <img src={spinner} class="animate-spin" />
                        ეტაპების გაუქმება
                      </div>
                    )}
                  </a>
                </div>
                <Show when={error()?.some((a) => a.field === "price")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold mb-4">
                      {error().find((a) => a.field === "price").message}
                    </p>
                  </Show>
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <img src={uploadIcon}></img> 
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
                              <img src={closeIcon} width={18} height={18}></img>
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
