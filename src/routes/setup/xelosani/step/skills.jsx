import jobs from "../../../../Components/header-comps/jobs_list.json";
import { For, Match, Show, Switch, batch, createSignal } from "solid-js";
import {
  check_selected_jobs,
  handle_selected_skills,
} from "~/routes/api/xelosani/setup/setup";
import { createAsync, useNavigate } from "@solidjs/router";
import dropdownSVG from "../../../../svg-images/svgexport-8.svg";

const Skills = () => {
  const check_jobs = createAsync(check_selected_jobs);
  const [submitted, setSubmitted] = createSignal(false);
  const [activeParentIndex, setActiveParentIndex] = createSignal(null);
  const [activeChildIndex, setActiveChildIndex] = createSignal(null);
  const [childChecked, setChildChecked] = createSignal([])
  const [parentChecked, setParentChecked] = createSignal([])
  const [mainChecked, setMainChecked] = createSignal([])

  const navigate = useNavigate();

  const handleAddSkill = async () => {
    const displayableSkills = parentChecked().map((parent) => ({
      displaySkills: parent,
      completedJobs: 0,
      reviews: 0,
    }));
    const skills = {
      parent: parentChecked(),
      child: childChecked(),
      main: mainChecked(),
      displayableSkills: displayableSkills
    }
    try {
      const response = await handle_selected_skills(skills);
      if (response.status !== 200) throw new Error("error");
      if (response.stepPercent === 100) {
        return navigate(`/xelosani/${response.profId}`);
      }
      setSubmitted(true);
    } catch (error) {
      if (error.message === "401") {
        return alert("მომხმარებელი არ არის შესული სისტემაში.");
      }
      return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.");
    }
  };

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

  const handleParentChange = (isChecked, currentCategory, childCategories) => {
    if (isChecked) {
      batch(() => {
        setChildChecked((prev) => {
          return [...prev, ...childCategories]
        })
        setParentChecked((prev) => {
          return [...prev, currentCategory]
        })
      })
    } else {
      batch(() => {
        setChildChecked((prev) => {
          const filt = prev.filter((p) => !childCategories.includes(p))
          return filt
        })
        setParentChecked((prev) => {
          const filt = prev.filter((p) => p !== currentCategory)
          return filt
        })
      })
    }
  }

  const handleGrandChange = (j, isChecked, parentCategory, allChild) => {
    if (isChecked) {
      setChildChecked((prev) => {
        return [...prev, j]
      })
      if (!parentChecked().includes(parentCategory)) {
        setParentChecked((prev) => {
          return [...prev, parentCategory]
        })
      }
    } else {
      setChildChecked((prev) => {
        const filt = prev.filter((p) => p !== j)
        return filt
      })
      if (allChild.some((a) => childChecked().includes(a))) {
        return  
      } else {
        setParentChecked((prev) => {
          const filt = prev.filter((p) => p !== parentCategory)
          return filt
        })
      }
    }
  }

  const handleMainChange = (isChecked, currentCategory, currentCategoryList) => {
    if (isChecked) {
      batch(() => {
        setMainChecked((prev) => {
          return [...prev, currentCategory]
        })
        setParentChecked((prev) => {
          return [...prev, ...currentCategoryList.map((a) => a['კატეგორია'])];
        })
        setChildChecked((prev) => {
          return [
            ...prev, 
            ...currentCategoryList.flatMap((a) => a['სამუშაოები'])
          ]
        })
      })
    } else {
      batch(() => {
        setMainChecked((prev) => {
          return prev.filter((item) => item !== currentCategory);
        });
      
        setParentChecked((prev) => {
          const filteredCategories = currentCategoryList.map((a) => a['კატეგორია']);
          return prev.filter((category) => !filteredCategories.includes(category));
        });
      
        setChildChecked((prev) => {
          const childCategories = currentCategoryList.flatMap((a) => a['სამუშაოები']);
          return prev.filter((child) => !childCategories.includes(child));
        });
      })    
    }
  }

  return (
    <div class="flex flex-col p-10 justify-between w-full items-center h-full mb-4">
      <Switch>
        <Match when={check_jobs() !== 200 && !submitted()}>
          <Show when={jobs}>
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
                          onChange={(e) => handleMainChange(e.target.checked, m, jobs[0][m])}
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
                                    onChange={(e) => handleParentChange(e.target.checked, child["კატეგორია"], child["სამუშაოები"])}
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
                                        onChange={(e) => handleGrandChange(j, e.target.checked, child["კატეგორია"], child["სამუშაოები"])}
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
              onClick={handleAddSkill}
              class="py-2 w-full mt-3 px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
            >
              გაგრძელება
            </button>
          </div>
        </Match>
        <Match when={check_jobs() === 200 || submitted()}>
          <div class="flex items-center h-full">
            <p class="text-sm font-[normal-font] font-bold text-gray-700">
              თქვენ უნარები დამატებული გაქვთ გთხოვთ განაგრძოთ.
            </p>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default Skills;
