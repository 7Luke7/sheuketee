import { Header } from "~/Components/Header"
import uploadIcon from "../../../../public/svg-images/uploadIcon.svg"
import closeIcon from "../../../../public/svg-images/svgexport-12.svg";
import {
    createSignal,
    Show
  } from "solid-js";

const Services = () => {
    const [mileStoneModal, setMileStoneModal] = createSignal(false);
    const [image, setImage] = createSignal([]);
    const [error, setError] = createSignal(null);
    const [postUp, setPostUp] = createSignal(false);
    const [isExiting, setIsExiting] = createSignal(false);
    const [input, setInput] = createSignal("");
    const [title, setTitle] = createSignal("");
    const [totalSize, setTotalSize] = createSignal(0);
    const [mileStone, setMileStone] = createSignal();
    const [toastError, setToastError] = createSignal();

    const createServices = async () => {

    }

    return <div>
        <Header></Header>
        <h1>სერვისები</h1>
            <form
                onSubmit={createServices}
                class="editor mx-auto flex-1 flex flex-col text-gray-800 p-4 shadow-lg "
              >
                <input
                  class="bg-gray-100 font-[bolder-font] border border-gray-300 p-2 mb-2 outline-none"
                  placeholder="სათაური"
                  onInput={(e) => setTitle(e.target.value)}
                  id="title"
                  maxLength={100}
                  minLength={5}
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
                    {title().trim().length}/100
                  </div>
                </div>
                <textarea
                  class="font-[bolder-font] text-sm bg-gray-100 p-3 h-60 border border-gray-300 outline-none"
                  name="description"
                  onInput={(e) => setInput(e.target.value)}
                  maxlength={1000}
                  id="desc"
                  minLength={20}
                  placeholder="აღწერეთ თქვენი სერვისის დეტალები"
                ></textarea>
                <div class="icons flex items-center text-gray-500 justify-between m-2">
                  <Show when={error()?.some((a) => a.field === "description")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold">
                      {error().find((a) => a.field === "description").message}
                    </p>
                  </Show>
                  <div class="count ml-auto text-gray-400 text-xs font-[thin-font]">
                    {input().trim().length}/1000
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
                </div>
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
            </div>
}

export default Services