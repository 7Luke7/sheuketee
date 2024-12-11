import { createSignal, batch, Show, onMount } from "solid-js";
import closeIcon from "../../../svg-images/svgexport-12.svg";
import jobs from "../../../Components/header-comps/jobs_list.json";
import dropdownSVG from "../../../svg-images/svgexport-8.svg";
import { makeAbortable } from "@solid-primitives/resource";
// import { CreateJobMap } from "~/routes/new/[id]/CreateJobMap";
import CameraSVG from "../../../svg-images/camera.svg";
import spinnerSVG from "../../../svg-images/spinner.svg";

const ModifyServiceFront = (props) => {
  const [markedLocation, setMarkedLocation] = createSignal();
  const [error, setError] = createSignal(null);
  const [input, setInput] = createSignal(
    props.editingService().mainDescription
  );
  const [title, setTitle] = createSignal(props.editingService().mainTitle);
  const [activeParentIndex, setActiveParentIndex] = createSignal();
  const [activeChildIndex, setActiveChildIndex] = createSignal(null);
  const [childChecked, setChildChecked] = createSignal([]);
  const [parentChecked, setParentChecked] = createSignal();
  const [mainChecked, setMainChecked] = createSignal(
    props.editingService().mainCategory
  );
  const [showCategoryModal, setShowCategoryModal] = createSignal(false);
  const [isSendingRequest, setIsSendngRequest] = createSignal(false);
  const [signal, abort, filterErrors] = makeAbortable({
    timeout: 0,
    noAutoAbort: true,
  });
  const [imageLoading, setImageLoading] = createSignal(false);
  const [previewImage, setPreviewImage] = createSignal();

  const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;

  onMount(() => {
    const currentCategories = jobs[0][mainChecked()].find((a) =>
      props.editingService().tags.includes(a["კატეგორია"])
    );
    setParentChecked(currentCategories["კატეგორია"]);
    const childCheckedArray = currentCategories["სამუშაოები"].map((s) => {
      if (props.editingService().tags.includes(s)) {
        return s;
      }
    });
    setChildChecked(childCheckedArray);
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SINGLE_FILE_SIZE) {
      setImageLoading(false);
      return props.setToast({
        type: false,
        message: `${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`,
      });
    } else {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        const response = await fetch(`/api/preview_image/preview_service/${props.profileId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: signal(),
        });

        if (!response.ok) {
          return props.setToast({
            message: "ფოტო ვერ აიტვირთა, სცადეთ თავიდან.",
            type: false,
          });
        }

        const data = await response.text();

        if (data) {
          batch(() => {
            setPreviewImage(data);
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          filterErrors(error);
        }
      } finally {
        setImageLoading(false);
      }
    }
  };
  const createPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData(e.target);

      if (!childChecked().length) {
        props.setToast({ type: false, message: "გთხოვთ აირჩიოთ კატეგორია." });
        return;
      }

      const title = fd.get("title");
      if (title.length < 5) {
        props.setToast({
          type: false,
          message: "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.",
        });
        setError([
          { field: "title", message: "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს." },
        ]);
        return;
      }
      if (title.length > 60) {
        props.setToast({
          type: false,
          message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
        });
        setError([
          {
            field: "title",
            message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
          },
        ]);
        return;
      }

      const description = fd.get("description");
      if (description.length < 20) {
        props.setToast({
          type: false,
          message: "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს.",
        });
        setError([
          {
            field: "description",
            message: "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს.",
          },
        ]);
        return;
      }
      if (description.length > 300) {
        props.setToast({
          type: false,
          message: "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.",
        });
        setError([
          {
            field: "description",
            message: "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.",
          },
        ]);
        return;
      }

      if (!fd.get("price")) {
        props.setToast({ type: false, message: "ფასი სავალდებულოა." });
        setError([{ field: "price", message: "ფასი სავალდებულოა." }]);
        return;
      }

      if (!fd.get("thumbnail")) {
        props.setToast({ type: false, message: "თამბნეილი სავალდებულოა." });
        return;
      }

      fd.append(
        "location",
        JSON.stringify(markedLocation()) || JSON.stringify(props.editingService().location)
      );
      fd.append("mainCategory", mainChecked());
      fd.append("parentCategory", parentChecked());
      fd.append("childCategory", JSON.stringify(childChecked()));

      setIsSendngRequest(true);
      const response = await fetch(`/api/xelosani/modify/serviceMain/${props.editingService().publicId}`, {
        method: "POST",
        body: fd,
        credentials: "include",
        signal: signal(),
      });
      setIsSendngRequest(false);

      if (!response.ok) {
        return props.setToast({
          message: "სერვისი ვერ განახლდა, სცადეთ თავიდან.",
          type: false,
        });
      }

      if (response.status === 400) {
        const data = await response.json();
        props.setToast({ typle: false, message: data.errors[0].message });
        setError(data.errors);
      } else {
        batch(() => {
          props.setToast({
            type: true,
            message: "სერვისი წარმატებით განახლდა.",
          });
          props.setModal(null)
        });
      }
    } catch (error) {
      filterErrors(error);
      console.log(error);
    } finally {
      setIsSendngRequest(false);
    }
  };

  const toggleParentAccordion = (index) => {
    if (activeParentIndex() === index) {
      batch(() => {
        setActiveParentIndex(null);
        setActiveChildIndex(null);
      });
    } else {
      batch(() => {
        setActiveParentIndex(index);
        setActiveChildIndex(null);
      });
    }
  };

  const toggleChildAccordion = (index) => {
    if (activeChildIndex() === index) {
      setActiveChildIndex(null);
    } else {
      setActiveChildIndex(index);
    }
  };

  const handleParentChange = (
    isChecked,
    currentCategory,
    childCategories,
    index,
    m
  ) => {
    if (isChecked) {
      toggleChildAccordion(index);
      batch(() => {
        setMainChecked(m);
        setChildChecked(childCategories);
        setParentChecked(currentCategory);
      });

      props.setEditingServiceTarget((prev) => {
        if (!prev.tags.includes(currentCategory)) {
          return { ...prev, tags: [m, currentCategory, ...childCategories] };
        }
      });
    } else {
      batch(() => {
        setChildChecked((prev) => {
          return prev.filter((p) => !childCategories.includes(p));
        });
        props.setEditingServiceTarget((prev) => {
          return { ...prev, tags: [] };
        });
        setMainChecked(null);
        setParentChecked(null);
      });
    }
  };

  const handleGrandChange = (j, isChecked, parentCategory, allChild, m) => {
    if (isChecked) {
      if (parentChecked() !== parentCategory) {
        setParentChecked(parentCategory);
        setChildChecked([]);
        setMainChecked(m);
      }
      setChildChecked((prev) => {
        if (parentChecked() && parentChecked() !== parentCategory) {
          return [prev];
        }
        return [...prev, j];
      });
      props.setEditingServiceTarget((prev) => {
        if (!prev.tags.includes(parentCategory)) {
          return { ...prev, tags: [parentCategory, j, m] };
        }
        if (childChecked().length === allChild.length) {
          return { ...prev, tags: [...prev.tags, parentCategory, m] };
        }
        return { ...prev, tags: [...prev.tags, j] };
      });
    } else {
      setChildChecked((prev) => {
        return prev.filter((p) => p !== j);
      });
      props.setEditingServiceTarget((prev) => {
        if (!childChecked().length) {
          return { ...prev, tags: [] };
        }
        return { ...prev, tags: prev.tags.filter((t) => t !== j) };
      });
      if (!allChild.some((a) => childChecked().includes(a))) {
        setParentChecked(null);
        setMainChecked(null);
      }
    }
  };

  return (
    <div class="h-[650px]">
      <section>
        <div
          class={`${
            showCategoryModal() && "blur-[1.4px]"
          } flex w-full justify-between items-center mb-2`}
        >
          <h2 class="font-bold text-2xl text-gray-800">შეცვალე სერვისი</h2>
          <button
            onClick={() => {
              props.setModal(null);
              props.setEditingServiceTarget(null);
            }}
          >
            <img src={closeIcon} />
          </button>
        </div>
        <div class="flex w-full justify-center">
          <div class="flex w-full mt-2">
            <Show when={jobs && showCategoryModal()}>
              <div class="fixed top-1/2 -translate-y-1/2 border bg-white z-[500] py-4 px-12 min-h-[480px] w-[700px] left-1/2 -translate-x-1/2">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold font-[bolder-font] text-xl">
                    აირჩიე სპეციალობა
                  </h3>
                  <img
                    id="modal"
                    src={closeIcon}
                    onClick={() => setShowCategoryModal(false)}
                  />
                </div>
                <div class="grid grid-cols-2 justify-items-stretch border-t gap-x-5 mt-8">
                  <For each={jobs.flatMap((obj) => Object.keys(obj))}>
                    {(m, Parentindex) => (
                      <div class="border-b border-slate-200">
                        <div
                          onClick={() => toggleParentAccordion(Parentindex())}
                          class="w-full flex justify-between items-center py-5 text-slate-800"
                        >
                          <span class="text-md font-bold font-[normal-font]">
                            {m}
                          </span>
                          <div class="flex items-center gap-x-2">
                            <span
                              class={`text-slate-800 transition-transform duration-300 ${
                                activeParentIndex() === Parentindex()
                                  ? "rotate-[180deg]"
                                  : ""
                              }`}
                            >
                              <img
                                class="transform transition-transform duration-300"
                                src={dropdownSVG}
                                alt="dropdown icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div
                          class={`overflow-hidden transition-all duration-300 ease-in-out ${
                            activeParentIndex() === Parentindex()
                              ? "max-h-screen"
                              : "max-h-0"
                          }`}
                        >
                          <Show when={activeParentIndex() === Parentindex()}>
                            <For each={jobs[0][m]}>
                              {(child, index) => (
                                <div>
                                  <div class="w-full flex justify-between items-center py-1 px-2 text-slate-800">
                                    <span class="text-sm font-bold font-[normal-font]">
                                      {child["კატეგორია"]}
                                    </span>
                                    <div class="flex items-center gap-x-2">
                                      <input
                                        type="checkbox"
                                        checked={
                                          parentChecked() === child["კატეგორია"]
                                        }
                                        onChange={(e) =>
                                          handleParentChange(
                                            e.target.checked,
                                            child["კატეგორია"],
                                            child["სამუშაოები"],
                                            index(),
                                            m
                                          )
                                        }
                                        name="rules-confirmation"
                                        class="accent-dark-green-hover"
                                      ></input>
                                      <span
                                        class={`text-slate-800 transition-transform duration-300 ${
                                          activeChildIndex() === index()
                                            ? "rotate-[180deg]"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          toggleChildAccordion(index())
                                        }
                                      >
                                        <img
                                          class="transform transition-transform duration-300"
                                          src={dropdownSVG}
                                          alt="dropdown icon"
                                        />
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    class={`overflow-hidden px-4 transition-all duration-300 ease-in-out ${
                                      activeChildIndex() === index()
                                        ? "max-h-screen"
                                        : "max-h-0"
                                    }`}
                                  >
                                    <For each={child["სამუშაოები"]}>
                                      {(j, i) => (
                                        <div class="flex w-full items-center justify-between text-xs text-slate-800">
                                          <p class="text-xs pb-2 font-[normal-font] font-bold">
                                            {j}
                                          </p>
                                          <input
                                            type="checkbox"
                                            checked={childChecked().includes(j)}
                                            name="rules-confirmation"
                                            class="accent-dark-green-hover"
                                            onChange={(e) =>
                                              handleGrandChange(
                                                j,
                                                e.target.checked,
                                                child["კატეგორია"],
                                                child["სამუშაოები"],
                                                m
                                              )
                                            }
                                          ></input>
                                        </div>
                                      )}
                                    </For>
                                  </div>
                                </div>
                              )}
                            </For>
                          </Show>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <button
                  id="approve-modify"
                  onClick={() => {
                    setShowCategoryModal(false);
                  }}
                  class="border mt-4 border-gray-300 rounded-[16px] p-1 px-4 w-full text-center font-semibold cursor-pointer text-gray-200 bg-dark-green"
                >
                  დადასტურება
                </button>
              </div>
            </Show>
            <form
              onSubmit={createPost}
              class={`${
                showCategoryModal() && "blur-[1.4px]"
              } editor w-full flex flex-col text-gray-800 p-4`}
            >
              <div class="flex gap-x-4">
                <div class="w-1/2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(true);
                      if (!mainChecked()) {
                        return
                      }
                      const parent = jobs[0][mainChecked()].find((m) => {
                        return props
                          .editingService()
                          .tags.includes(m["კატეგორია"]);
                      });

                      setParentChecked(parent["კატეგორია"]);
                      const childIndex = jobs[0][mainChecked()].findIndex(
                        (j) => j["კატეგორია"] === parent["კატეგორია"]
                      );
                      const parentIndex = Object.keys(jobs[0]).findIndex(
                        (a) => a === mainChecked()
                      );

                      const child = parent["სამუშაოები"].filter((a) => props.editingService().tags.includes(a))

                      setActiveParentIndex(parentIndex);
                      setActiveChildIndex(childIndex);
                      setChildChecked(child);
                    }}
                    class="bg-gray-800 px-4 py-2 mb-4 w-full font-[thin-font] text-md font-bold hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]"
                  >
                    შეცვალე სპეციალობა
                  </button>
                  <input
                    class="bg-gray-100 w-full font-[bolder-font] border border-gray-300 p-2 mb-2 outline-none"
                    spellcheck="false"
                    placeholder="სათაური"
                    value={title()}
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
                    class="font-[bolder-font] text-sm w-full bg-gray-100 p-3 h-60 border border-gray-300 outline-none"
                    spellcheck="false"
                    name="description"
                    value={input()}
                    onInput={(e) => setInput(e.target.value)}
                    maxlength={300}
                    id="desc"
                    placeholder="თქვენი სერვისის მიმოხილვა"
                  ></textarea>
                  <div class="icons flex items-center text-gray-500 justify-between m-2">
                    <Show
                      when={error()?.some((a) => a.field === "description")}
                    >
                      <p class="text-xs text-red-500 font-[thin-font] font-bold">
                        {error().find((a) => a.field === "description").message}
                      </p>
                    </Show>
                    <div class="count ml-auto text-gray-400 text-xs font-[thin-font]">
                      {input().trim().length}/300
                    </div>
                  </div>
                  <div class="mt-2 flex gap-x-4 items-center justify-between">
                    <button class="bg-gray-800 px-4 py-2 mb-4 w-full font-[thin-font] text-md font-bold hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]">შეცვალე განრიგი</button>
                    <button class="bg-gray-800 px-4 py-2 mb-4 w-full font-[thin-font] text-md font-bold hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]">შეცვალე ლოკაცია</button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-end gap-x-1">
                      <input
                        class="bg-gray-100 font-[boldest-font] w-3/4 font-bold border border-gray-300 p-2 outline-none"
                        placeholder="ფასი"
                        min={1}
                        value={props.editingService().mainPrice}
                        id="price"
                        name="price"
                        type="number"
                      />
                      <span class="text-2xl font-[bolder-font]">₾</span>
                    </div>
                  </div>
                  <Show when={error()?.some((a) => a.field === "price")}>
                    <p class="text-xs text-red-500 font-[thin-font] font-bold mt-1">
                      {error().find((a) => a.field === "price").message}
                    </p>
                  </Show>
                </div>
                <div class="w-[351px] flex flex-col justify-between">
                  <div>
                    <button
                      type="button"
                      class="bg-gray-100 border border-dark-green-hover grow md:grow-0 pt-3 w-full rounded-[16px] p-2 pb-5 text-left"
                    >
                      <span class="block text-sm font-bold font-[font-medium] text-gray-800">
                        თამბნეილი
                      </span>
                      <p class="text-sm text-gray-500 font-bold font-[thin-font]">
                        სურათი გამოჩნდება წინა გვერდზე.
                      </p>
                    </button>
                  </div>
                  <div class="flex relative mt-3 mb-2 items-center justify-center w-full">
                    <label
                      for="dropzone-file"
                      class="flex flex-col items-center justify-center w-full border-2 h-[355px] border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                    >
                      <div>
                        {imageLoading() ? (
                          <div class="flex justify-center items-center bg-gray-50 w-[345px] h-[350px] rounded-lg">
                            <div class="flex items-center flex-col gap-y-1">
                            <img
                              src={spinnerSVG}
                              class="animate-spin"
                              width={40}
                              alt="იტვითება..."
                            ></img>
                            <button
                              id="cancel-service-file-preview"
                              onClick={(e) => {
                                e.preventDefault()
                                abort()
                              }}
                              class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 rounded-[16px] text-sm font-bold transition-all duration-300"
                            >
                              გაუქმება
                            </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <img
                              class="w-[351px] h-[351px] rounded-lg"
                              src={
                                previewImage() ||
                                props.editingService().service_thumbnail
                              }
                            ></img>
                            <img
                              src={CameraSVG}
                              class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-50"
                            ></img>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) => handleFileChange(e)}
                        name="thumbnail"
                        disabled={imageLoading()}
                        accept="image/jpeg, image/png, image/webp, image/avif"
                        id="dropzone-file"
                        type="file"
                        class="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              {isSendingRequest() ? (
                <button
                  type="button"
                  id="abort-service-update"
                  onClick={(e) => {
                    e.preventDefault()
                    abort()
                  }}
                  class="border mt-8 border-gray-300 rounded-[16px] p-1 px-4 w-full cursor-pointer ml-2 bg-gray-600"
                >
                  <div class="flex items-center justify-center">
                    <img
                      src={spinnerSVG}
                      class="animate-spin mr-2"
                      alt="იტვირთება..."
                    />
                    <p class="font-[normal-font] font-bold text-base text-gray-200">
                      გაუქმება
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  class="border mt-8 border-gray-300 rounded-[16px] p-1 px-4 w-full text-center text-base font-bold font-[normal-font] cursor-pointer text-gray-200 ml-2 bg-dark-green"
                >
                  სერვისის შეცვლა
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModifyServiceFront