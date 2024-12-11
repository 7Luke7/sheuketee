import closeIcon from "../../../svg-images/svgexport-12.svg";
import { modify_user_skills } from "~/routes/api/xelosani/modify/skills";
import dropdownSVG from "../../../svg-images/svgexport-8.svg";
import jobs from "../../../Components/header-comps/jobs_list.json";
import { For, Show, batch, createSignal } from "solid-js";
import { revalidate } from "@solidjs/router";

const ModifySkill = (props) => {
  const [activeParentIndex, setActiveParentIndex] = createSignal(null);
  const [activeChildIndex, setActiveChildIndex] = createSignal(null);
  const [childChecked, setChildChecked] = createSignal(props.child)
  const [parentChecked, setParentChecked] = createSignal(props.parent)
  const [mainChecked, setMainChecked] = createSignal(props.main)

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
          if (!parentChecked().length) {
            setMainChecked((prev) => {
              const filt = prev.filter((p) => p !== m);
              return filt;
            });
            setMainChecked([]);
          }
        }
      });
    }
  };

  const handleGrandChange = (j, isChecked, parentCategory, allChild, m) => {
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

  const handle_user_skills = async (e) => {
    e.preventDefault();
    if (mainChecked() === props.main && parentChecked() === props.parent && childChecked() === props.child) {
      return props.setModal(null)
    }
    const displayableSkills = parentChecked().map((parent, i) => {
        if (props.skills.some(a => a.displaySkills === parent)) {
          return {
            displaySkills: parent,
            completedJobs: props.skills[i].completedJobs,
            reviews: props.skills[i].reviews
          }
        } else {
          return {
            displaySkills: parent,
            completedJobs: 0,
            reviews: 0
          }
        }
      });
      const skills = {
        parent: parentChecked(),
        child: childChecked(),
        main: mainChecked(),
        displayableSkills
      }
    try {
      const response = await modify_user_skills(skills);
      revalidate()
      if (response !== 200) throw new Error(response);
      batch(() => {
        props.setToast({
          message: "სპეციალობა წარმატებით განახლდა.",
          type: true,
        });
        props.setModal(null);
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div class="w-[1000px]">
        <div class="flex w-full justify-between items-center mb-2">
        <h1 class="font-[boldest-font] text-lg">სპეციალობის შეცვლა</h1>
        <button onClick={() => props.setModal(null)}>
          <img src={closeIcon} />
        </button>
      </div>
      <div class="flex flex-col p-10 justify-between w-full items-center h-full mb-4">
          <Show when={props.skills && jobs}>
            <div class="grid grid-cols-2 justify-items-stretch gap-x-5 w-full">
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
                          onChange={(e) => handleMainChange(e.target.checked, m, jobs[0], Parentindex)}
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
                          onClick={() => toggleParentAccordion(Parentindex())}
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
                                    checked={parentChecked().includes(child["კატეგორია"])}
                                    onChange={(e) => handleParentChange(e.target.checked, child["კატეგორია"], child["სამუშაოები"], index, jobs[0][m], m)}
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
                                        checked={childChecked().includes(j)}
                                        name="rules-confirmation"
                                        class="accent-dark-green-hover"
                                        id="must"
                                        onChange={(e) => handleGrandChange(j, e.target.checked, child["კატეგორია"], child["სამუშაოები"], m)}
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
          </Show>
          <div class="h-full w-full relative">
            <button
              onClick={handle_user_skills}
              class="py-2 w-full mt-3 px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
            >
              დადასტურება
            </button>
          </div>
        </div>
    </div>
  );
};

export default ModifySkill