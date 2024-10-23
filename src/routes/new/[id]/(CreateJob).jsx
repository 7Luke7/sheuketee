import { Header } from "~/Components/Header"
import {
  createSignal,
  Switch,
  Match,
  batch,
  onCleanup,
  createEffect,
} from "solid-js";
import { createAsync } from "@solidjs/router";
import { get_location } from "../../api/damkveti/job";
import { NotAuthorized } from "~/Components/NotAuthorized";
import { CreateJobMap } from "./CreateJobMap";
import { Show } from "solid-js";
import { MileStoneModal } from "./MileStoneModal";
import spinner from "../../../svg-images/spinner.svg";
import closeIcon from "../../../svg-images/svgexport-12.svg";
import uploadIcon from "../../../svg-images/uploadIcon.svg";
import jobs from "../../../Components/header-comps/jobs_list.json";
import dropdownSVG from "../../../svg-images/svgexport-8.svg";
import gallery from "../../../svg-images/images.svg";
import thumnail from "../../../svg-images/thumbnails-svgrepo-com.svg";
import { makeAbortable } from "@solid-primitives/resource";
import { Toast } from "~/Components/ToastComponent";
import {ManualLocation} from "./manual_location"

const CreateJob = () => {
  const location = createAsync(get_location);
  const [mileStoneModal, setMileStoneModal] = createSignal(false);
  const [image, setImage] = createSignal([]);
  const [markedLocation, setMarkedLocation] = createSignal();
  const [error, setError] = createSignal(null);
  const [isExiting, setIsExiting] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [totalSize, setTotalSize] = createSignal(0);
  const [mileStone, setMileStone] = createSignal([]);
  const [activeParentIndex, setActiveParentIndex] = createSignal(null);
  const [activeChildIndex, setActiveChildIndex] = createSignal(null);
  const [childChecked, setChildChecked] = createSignal([]);
  const [parentChecked, setParentChecked] = createSignal([]);
  const [mainChecked, setMainChecked] = createSignal([]);
  const [showCategoryModal, setShowCategoryModal] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal("thumbnail");
  const [thumbNail, setThumbnail] = createSignal();
  const [toast, setToast] = createSignal(null);
  const [signal, abort, filterErrors] = makeAbortable({
    timeout: 0,
    noAutoAbort: true,
  });
  const [isSendingRequest, setIsSendngRequest] = createSignal(false);
  const [state, setState] = createSignal("თბილისი")
  const [coordinates, setCoordinates] = createSignal({
      city: "თბილისი",
      cords: { "lat": 41.6938, "lng": 44.8015 }
  })
  const [streetAddress, setStreetAdress] = createSignal("")

  const MAX_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

  const removeMileStone = (index) => {
    setMileStone((a) => {
      const leftover = a.filter((c, i) => i !== index);
      return leftover;
    });
    if (!mileStone().length) {
      return setMileStoneModal(false);
    }
  };

  const addMileStone = () => {
    if (mileStone().length === 25) {
      return setToast({
        type: false,
        message: "მაქსიმალური 25 ეტაპის რაოდენობა მიღწეულია.",
      });
    }

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
      if (!file.type.startsWith("image/")) {
        return setToast({
          type: false,
          message: "გთხოვთ აირჩიოთ ფაილი ფოტო ფორმატით."
        }) 
      }
    
      const file_existence = image().some((a) => a.name === file.name)
      if (file_existence) {
        return setToast({
          type: false,
          message: `${file.name} უკვე დამატებული გაქვთ.`
        })
      }
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return setToast({
          type: false,
          message: `${file.name}, ფაილის ზომა აჭარბებს 5მბ ლიმიტს.`,
        });
      } else {
        setTotalSize((a) => (a += file.size));
      }
    }

    if (totalSize() > MAX_TOTAL_SIZE) {
      return setToast({
        type: false,
        message: "ფაილების ჯამური ზომა აჭარბებს 25მბ ერთობლივ ლიმიტს.",
      });
    }

    if (currentStep() === "thumbnail") {
      if (!image().length) {
        setThumbnail(files[0]);
        return setCurrentStep("gallery");
      } else {
        setThumbnail(files[0]);
      }
    } else {
      setImage([...image(), ...files]);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fd = new FormData(e.target);
      if (!childChecked().length) {
        return setToast({
          type: false,
          message: "გთხოვთ აირჩიოთ კატეგორია.",
        });
      }

      const title = fd.get("title");
      if (!title.length) {
        setToast({
          type: false,
          message: "სათაური სავალდებულოა.",
        });
        return setError([
          {
            field: "title",
            message: "სათაური სავალდებულოა.",
          },
        ]);
      }
      if (title.length > 60) {
        setToast({
          type: false,
          message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
        });
        return setError([
          {
            field: "title",
            message: "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
          },
        ]);
      }

      const description = fd.get("description");
      if (!description.length) {
        setToast({
          type: false,
          message: "აღწერა სავალდებულოა.",
        });
        return setError([
          {
            field: "description",
            message: "აღწერა სავალდებულოა.",
          },
        ]);
      }
      if (description.length > 600) {
        setToast({
          type: false,
          message: "აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.",
        });
        return setError([
          {
            field: "description",
            message: "აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.",
          },
        ]);
      }

      if (!mileStoneModal() && !fd.get("price")) {
        setToast({
          type: false,
          message: "ფასი სავალდებულოა თუ ეტაპები არ გაქვთ.",
        });
        return setError([
          {
            field: "price",
            message: "ფასი სავალდებულოა თუ ეტაპები არ გაქვთ.",
          },
        ]);
      }

      if (mileStone() && mileStone().length) {
        const errorFound = mileStone().find((milestone, index) => {
          if (!milestone.title.length) {
            setToast({
              type: false,
              message: `${index + 1} ეტაპის სათაური სავალდებულოა.`,
            });
            setError([
              {
                field: `mileStones.${index}.title`,
                message: "ეტაპის სათაური სავალდებულოა.",
              },
            ]);
            return true;
          }
          if (milestone.title.length > 60) {
            setToast({
              type: false,
              message: `${
                index + 1
              } ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.`,
            });
            setError([
              {
                field: `mileStones.${index}.title`,
                message: "ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.",
              },
            ]);
            return true;
          }

          if (!milestone.description.length) {
            setToast({
              type: false,
              message: `${index + 1} ეტაპის აღწერა სავალდებულოა.`,
            });
            setError([
              {
                field: `mileStones.${index}.description`,
                message: "ეტაპის აღწერა სავალდებულოა.",
              },
            ]);
            return true;
          }
          if (milestone.description.length > 600) {
            setToast({
              type: false,
              message: `${
                index + 1
              } ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.`,
            });
            setError([
              {
                field: `mileStones.${index}.description`,
                message: "ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.",
              },
            ]);
            return true;
          }

          if (!milestone.price) {
            setToast({
              type: false,
              message: `${index + 1} ეტაპის ფასი სავალდებულოა.`,
            });
            setError([
              {
                field: `mileStones.${index}.price`,
                message: "ეტაპის ფასი სავალდებულოა.",
              },
            ]);
            return true;
          }
        });

        if (errorFound) return;
      }

      if (!thumbNail()) {
        return setToast({
          type: false,
          message: "თამბნეილი სავალდებულოა.",
        });
      }

      if (!image().length) {
        return setToast({
          type: false,
          message: "გალერეა სავალდებულოა.",
        });
      }

      if (location() || markedLocation()) {
        fd.append(
          "location",
          JSON.stringify(markedLocation()) || JSON.stringify(location())
        );
      }
      fd.append("thumbnail", thumbNail());
      fd.append(
        "categories",
        JSON.stringify([
          ...mainChecked(),
          ...parentChecked(),
          ...childChecked(),
        ])
      );
      fd.append("mileStone", JSON.stringify(mileStone()));
      fd.append("galleryLength", image().length);

      for (let i = 0; i < image().length; i++) {
        fd.append(`job-${i}-gallery-image`, image()[i]);
      }

      if (!streetAddress().length) {
        return setToast({
          type: false,
          message: "ქუჩის მისამართი სავალდებულოა.",
        }); 
      }

      fd.append("streetAddress", streetAddress)
      fd.append("city", coordinates())
      fd.append("state", state())

      setIsSendngRequest(true);
      const response = await fetch("/api/damkveti/create_job", {
        method: "POST",
        body: fd,
        credentials: "include",
        signal: signal(),
      });

      if (response.status === 500) {
        setToast({
          type: false,
          message: "დაფიქსირდა სერვერული შეცდომა, სცადეთ მოგვიანებით.",
        });
      }
      if (response.status === 400) {
        setToast({
          type: false,
          message: response.errors[0].message,
        });
        return setError(response.errors);
      }

      document.getElementById("title").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("price").value = null;
      const func = async () => {
        batch(() => {
          setToast({
            type: true,
            message: "განცხადება წარმატებით აიტვირთა.",
          });
          setImage([]);
          setMileStone(null);
          setMileStoneModal(false);
          setMainChecked([]);
          setThumbnail(null);
          setParentChecked([]);
          setChildChecked([]);
          setActiveChildIndex(null)
          setActiveParentIndex(null)
          setCurrentStep("thumbnail");
        });
      };
      await func();
    } catch (error) {
      filterErrors(error);
    } finally {
      setIsSendngRequest(false);
    }
  };

  createEffect(() => {
    if (!toast()) return;
    let toastErrorTimeout;
    let toastExitTimeout;
    toastErrorTimeout = setTimeout(() => {
      setIsExiting(true);
      toastExitTimeout = setTimeout(() => {
        setIsExiting(false);
        setToast(null);
      }, 500);
    }, 5000);

    onCleanup(() => {
      if (toastErrorTimeout) clearTimeout(toastErrorTimeout);
      if (toastExitTimeout) clearTimeout(toastExitTimeout);
    });
  });

  const toggleParentAccordion = (index) => {
    if (activeParentIndex() === index) {
      setActiveParentIndex(null);
      setActiveChildIndex(null);
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
    allParents,
    m
  ) => {
    if (isChecked) {
      batch(() => {
        setMainChecked((prev) => {
          return [...prev, m];
        });
        setChildChecked((prev) => {
          return [...prev, ...childCategories];
        });
        setActiveChildIndex(index);
        setParentChecked((prev) => {
          return [...prev, currentCategory];
        });
      });
    } else {
      batch(() => {
        setChildChecked((prev) => {
          const filt = prev.filter((p) => !childCategories.includes(p));
          return filt;
        });
        setActiveChildIndex(null);
        setParentChecked((prev) => {
          const filt = prev.filter((p) => p !== currentCategory);
          return filt;
        });
        if (allParents.some((a) => parentChecked().includes(a["კატეგორია"]))) {
          return;
        } else {
          setMainChecked((prev) => {
            const filt = prev.filter((p) => p !== m);
            return filt;
          });
        }
      });
    }
  };

  const handleGrandChange = (j, isChecked, parentCategory, allChild, m, allParents) => {
    if (isChecked) {
      setMainChecked((prev) => {
        return [...prev, m];
      });
      setChildChecked((prev) => {
        return [...prev, j];
      });
      if (!parentChecked().includes(parentCategory)) {
        setParentChecked((prev) => {
          return [...prev, parentCategory];
        });
      }
    } else {
      setChildChecked((prev) => {
        const filt = prev.filter((p) => p !== j);
        return filt;
      });
      if (allChild.some((a) => childChecked().includes(a))) {
        return;
      } else {
        setParentChecked((prev) => {
          const filt = prev.filter((p) => p !== parentCategory);
          return filt;
        });
        if (!parentChecked().length) {
          setMainChecked([]);
        }
      }
    }
  };

  const handleMainChange = (
    isChecked,
    currentCategory,
    currentCategoryList,
    index
  ) => {
    if (isChecked) {
      batch(() => {
        setMainChecked((prev) => {
          return [...prev, currentCategory];
        });
        setParentChecked((prev) => {
          return [
            ...prev,
            ...currentCategoryList[currentCategory].map((a) => a["კატეგორია"]),
          ];
        });
        setActiveParentIndex(index());
        setChildChecked((prev) => {
          return [
            ...prev,
            ...currentCategoryList[currentCategory].flatMap(
              (a) => a["სამუშაოები"]
            ),
          ];
        });
      });
    } else {
      batch(() => {
        setMainChecked((prev) => {
          return prev.filter((item) => item !== currentCategory);
        });
        setActiveParentIndex(null);

        setParentChecked((prev) => {
          const filteredCategories = currentCategoryList[currentCategory].map(
            (a) => a["კატეგორია"]
          );
          return prev.filter(
            (category) => !filteredCategories.includes(category)
          );
        });

        setChildChecked((prev) => {
          const childCategories = currentCategoryList[currentCategory].flatMap(
            (a) => a["სამუშაოები"]
          );
          return prev.filter((child) => !childCategories.includes(child));
        });
      });
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
          <div class="flex flex-col w-[80%] mx-auto justify-center">
            <div class="flex mt-2 border border-gray-300">
              <Show when={jobs && showCategoryModal()}>
                <div class="fixed top-1/2 -translate-y-1/2 border bg-white z-[500] py-4 px-12 min-h-[480px] w-[950px] left-1/2 -translate-x-1/2">
                  <div class="flex items-center justify-between">
                    <h3 class="font-bold font-[bolder-font] text-xl">
                      აირჩიე კატეგორია
                    </h3>
                    <img
                      src={closeIcon}
                      onClick={() => setShowCategoryModal(false)}
                    />
                  </div>
                  <div class="grid grid-cols-2 justify-items-stretch border-t gap-x-5 mt-8">
                    <For each={jobs.flatMap((obj) => Object.keys(obj))}>
                      {(m, Parentindex) => (
                        <div class="border-b border-slate-200">
                          <div class="w-full flex justify-between items-center py-5 text-slate-800">
                            <span class="text-md font-bold font-[normal-font]">
                              {m}
                            </span>
                            <div class="flex items-center gap-x-2">
                              <input
                                type="checkbox"
                                checked={mainChecked().includes(m)}
                                onChange={(e) =>
                                  handleMainChange(
                                    e.target.checked,
                                    m,
                                    jobs[0],
                                    Parentindex
                                  )
                                }
                                name="rules-confirmation"
                                class="accent-dark-green-hover"
                                id="must"
                              ></input>
                              <span
                                class={`text-slate-800 transition-transform duration-300 ${
                                  activeParentIndex() === Parentindex()
                                    ? "rotate-[180deg]"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleParentAccordion(Parentindex())
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
                                          checked={parentChecked().includes(
                                            child["კატეგორია"]
                                          )}
                                          onChange={(e) =>
                                            handleParentChange(
                                              e.target.checked,
                                              child["კატეგორია"],
                                              child["სამუშაოები"],
                                              index,
                                              jobs[0][m],
                                              m
                                            )
                                          }
                                          name="rules-confirmation"
                                          class="accent-dark-green-hover"
                                          id="must"
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
                                              checked={childChecked().includes(
                                                j
                                              )}
                                              name="rules-confirmation"
                                              class="accent-dark-green-hover"
                                              id="must"
                                              onChange={(e) =>
                                                handleGrandChange(
                                                  j,
                                                  e.target.checked,
                                                  child["კატეგორია"],
                                                  child["სამუშაოები"],
                                                  m,
                                                  jobs[0][m],
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
                    onClick={() => setShowCategoryModal(false)}
                    class="border mt-4 border-gray-300 rounded-[16px] p-1 px-4 w-full text-center font-semibold cursor-pointer text-gray-200 bg-dark-green"
                  >
                    დადასტურება
                  </button>
                </div>
              </Show>
              <form
                onSubmit={createPost}
                class="editor mx-auto flex-1 flex flex-col text-gray-800 p-4 shadow-lg "
              >
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  class="bg-gray-800 px-4 py-2 mb-4 font-[thin-font] text-md font-bold hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  აირჩიე კატეგორიები
                </button>
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
                    class={`bg-gray-100 font-[bolder-font] ${
                      mileStoneModal() ? "w-7/12" : "w-3/12"
                    } border border-gray-300 p-2 outline-none`}
                    placeholder={
                      mileStoneModal()
                        ? "ფასი ან ეტაპების ფასი შეიკრიბება."
                        : "ფასი"
                    }
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
                        if (!newState) {
                          document.location.href = "#";
                          setMileStone([]);
                        } else {
                          setMileStone([
                            {
                              title: "",
                              description: "",
                              price: null,
                            },
                          ]);
                        }

                        return newState;
                      });
                    }}
                    class={`bg-gray-800 px-4 py-2 ${
                      mileStoneModal() ? "w-[200px]" : "w-full"
                    } font-[thin-font] font-bold text-sm hover:bg-gray-700 transition ease-in delay-20 text-white text-center rounded-[16px]`}
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

                <ul class="relative flex flex-col md:flex-row gap-2">
                  <li class="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div class="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <div
                        class={`${
                          currentStep() === "thumbnail" &&
                          "bg-green-100 rounded-full"
                        } p-2`}
                      >
                        <img
                          src={thumnail}
                          onClick={() => setCurrentStep("thumbnail")}
                        ></img>
                      </div>
                      <div
                        class={`${
                          currentStep() === "thumbnail"
                            ? "bg-dark-green-hover"
                            : "bg-gray-200"
                        } mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 group-last:hidden`}
                      ></div>
                    </div>
                    <button
                      onClick={() => setCurrentStep("thumbnail")}
                      type="button"
                      class={`${
                        currentStep() === "thumbnail" &&
                        "bg-gray-100 border border-dark-green-hover"
                      } grow md:grow-0 pt-3 mt-1 w-full rounded-[16px] p-2 pb-5 text-left`}
                    >
                      <span class="block text-sm font-bold font-[font-medium] text-gray-800">
                        თამბნეილი
                      </span>
                      <p class="text-sm text-gray-500 font-bold font-[thin-font]">
                        სურათი გამოჩნდება წინა გვერდზე.
                      </p>
                    </button>
                  </li>

                  <li class="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
                    <div class="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                      <div
                        class={`${
                          currentStep() === "gallery" &&
                          "bg-green-100 rounded-full"
                        } p-2`}
                      >
                        <img
                          src={gallery}
                          onClick={() => setCurrentStep("gallery")}
                        ></img>
                      </div>
                      <div
                        class={`${
                          currentStep() === "gallery"
                            ? "bg-dark-green-hover"
                            : "bg-gray-200"
                        } mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1`}
                      ></div>
                    </div>
                    <button
                      onClick={() => setCurrentStep("gallery")}
                      type="button"
                      class={`${
                        currentStep() === "gallery" &&
                        "bg-gray-100 border border-dark-green-hover"
                      } grow md:grow-0 pt-3 w-full mt-1 rounded-[16px] p-2 pb-5 text-left`}
                    >
                      <span class="block text-sm font-bold font-[font-medium] text-gray-800">
                        გალერეა
                      </span>
                      <p class="text-sm font-[thin-font] font-bold text-gray-500">
                        სხვადასხვა ფოტოები.
                      </p>
                    </button>
                  </li>
                </ul>
                <div class="flex mt-3 mb-2 items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <img src={uploadIcon}></img>
                      <p class="mb-2 text-sm text-gray-500">
                        <span class="font-[bolder-font]">
                          ასატვირთად დააჭირე
                        </span>
                      </p>
                      <p class="text-xs text-gray-500">
                        SVG, PNG, JPG. (მაქს. 5MB)
                      </p>
                    </div>
                    <input
                      onChange={(e) => handleFileChange(e)}
                      name="files[]"
                      multiple={currentStep() === "thumbnail" ? false : true}
                      accept="image/jpeg, image/png, image/webp, image/avif"
                      id="dropzone-file"
                      type="file"
                      class="hidden"
                    />
                  </label>
                </div>
                <Show when={thumbNail()}>
                  <p class="text-md font-[normal-font] font-bold">თამბნეილი</p>
                  <div class="bg-[#F5F7FB] h-[70px] rounded-[16px] w-full py-2 px-8">
                    <div class="flex items-center justify-between">
                      <span class="truncate pr-3 text-base font-[normal-font] text-[#07074D]">
                        {thumbNail().name}
                      </span>
                      <button
                        onClick={() => {
                          setThumbnail(null);
                        }}
                        class="text-[#07074D]"
                      >
                        <img src={closeIcon} width={18} height={18}></img>
                      </button>
                    </div>
                    <div class="flex flex-col relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                      <div class="w-full z-10 absolute h-full flex-1 rounded-lg bg-dark-green"></div>
                      <span class="mt-2">
                        {(thumbNail().size / (1024 * 1024)).toFixed(2)}MB
                      </span>
                    </div>
                  </div>
                </Show>
                <Show when={image().length}>
                  <div class="flex flex-col gap-y-2 mt-4 w-full">
                    <p class="text-md font-[normal-font] font-bold">გალერეა ({image().length})</p>
                    <For each={image()}>
                      {(l, index) => (
                        <>
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
                                <img
                                  src={closeIcon}
                                  width={18}
                                  height={18}
                                ></img>
                              </button>
                            </div>
                            <div class="flex flex-col relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                              <div class="w-full z-10 absolute h-full flex-1 rounded-lg bg-dark-green"></div>
                              <span class="mt-2">
                                {(l.size / (1024 * 1024)).toFixed(2)}MB
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </For>
                  </div>
                </Show>
                <div class="buttons flex items-center w-full mt-3">
                  {isSendingRequest() ? (
                    <button
                      type="button"
                      onClick={() => abort()}
                      class="border border-gray-300 rounded-[16px] p-1 px-4 w-full cursor-pointer ml-2 bg-gray-600"
                    >
                      <div class="flex items-center justify-center">
                        <img
                          src={spinner}
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
                      class="border border-gray-300 rounded-[16px] p-1 px-4 w-full text-center text-base font-bold font-[normal-font] cursor-pointer text-gray-200 ml-2 bg-dark-green"
                    >
                      განცხადების გამოქვეყნება
                    </button>
                  )}
                </div>
              </form>
              <Switch>
                <Match when={location()}>
                  <ManualLocation location={location} setStreetAdress={setStreetAdress} streetAddress={streetAddress} state={state} setState={setState} coordinates={coordinates} setCoordinates={setCoordinates}></ManualLocation>
                </Match>
                <Match when={!location()}>
                  {/* <CreateJobMap
                  location={location}
                  markedLocation={markedLocation}
                  setMarkedLocation={setMarkedLocation}
                  ></CreateJobMap> */}
                </Match>
              </Switch>
            </div>
            <Show when={mileStoneModal()}>
              <MileStoneModal
                addMileStone={addMileStone}
                error={error}
                removeMileStone={removeMileStone}
                mileStone={mileStone}
                setMileStone={setMileStone}
              ></MileStoneModal>
            </Show>
          </div>
        </Match>
      </Switch>
      <Show when={toast()}>
          <Toast toast={toast} setToast={setToast} isExiting={isExiting} setIsExiting={setIsExiting}></Toast>
      </Show>
    </section>
  );
};

export default CreateJob;
