import { For } from "solid-js";

export const ServicesModal = (props) => {
  return (
    <div
      id="serviceWrapper"
      class="p-4 min-h-[460px] relative mb-5 bg-white border-t-0 border mx-auto w-[80%]"
    >
      <h2 class="text-lg font-[normal-font] text-center text-gray-800 font-bold">
        ქვე-სერვისები
      </h2>
      <div class="grid gap-x-2 mt-5 grid-cols-3">
        <For each={props.service()}>
          {(m, index) => (
            <div class="">
              <h2 class="mb-2 font-[normal-font] text-sm font-bold">{m.category}</h2>
              <input
                class="bg-gray-100 font-[bolder-font] w-full border border-gray-300 p-2 mb-2 outline-none"
                spellcheck="false"
                placeholder="სერვისის სათაური"
                id="title"
                onInput={(e) => props.setService((cm) => {
                    cm[index()].title = e.target.value
                    return cm
                })}
                maxLength={60}
                name="title"
                type="text"
              />
              <div class="flex mb-2 items-center text-gray-500 justify-between">
                <Show when={props.error()?.some((a) => a.field === `service.${index()}.title`)}>
                  <p class="text-xs text-red-500 font-[thin-font] font-bold">
                    {props.error().find((a) => a.field === `service.${index()}.title`).message}
                  </p>
                </Show>
              </div>
              <textarea
                class="font-[bolder-font] text-sm bg-gray-100 p-3 h-60 w-full border border-gray-300 outline-none"
                spellcheck="false"
                name="description"
                onInput={(e) => props.setService((cm) => {
                    cm[index()].description = e.target.value
                    return cm
                })}
                maxlength={300}
                id="desc"
                placeholder="აღწერეთ სერვისის დეტალები"
              ></textarea>
              <div class="icons flex items-center text-gray-500 justify-between my-2">
                <Show when={props.error()?.some((a) => a.field === `service.${index()}.description`)}>
                  <p class="text-xs text-red-500 font-[thin-font] font-bold">
                    {props.error().find((a) => a.field === `service.${index()}.description`).message}
                  </p>
                </Show>
              </div>
              <div class="flex items-start justify-between mb-4">
                <div class="flex flex-col gap-y-1">
                <div class="flex items-center">
                  <input
                    class="bg-gray-100 font-[bolder-font] w-[100px] border border-gray-300 p-2 outline-none"
                    placeholder="ფასი"
                    min={1}
                    onInput={(e) => props.setService((cm) => {
                        cm[index()].price = Number(e.target.value)
                        return cm
                    })}
                    id="price"
                    name="price"
                    type="number"
                  />
                  <span class="text-2xl font-[bolder-font]">₾</span>
                </div>
                <Show when={props.error()?.some((a) => a.field === `service.${index()}.price`)}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold mb-2">
                      {props.error().find((a) => a.field === `service.${index()}.price`).message}
                    </p>
                  </Show>
                </div>
                <button
                onClick={() => props.removeService(index())}
                  type="button"
                  class="bg-red-600 px-4 text-sm py-2 font-[normal-font] font-bold hover:bg-red-500 transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  სერვისის წაშლა
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
