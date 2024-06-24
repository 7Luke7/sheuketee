import clear from "../../../../../public/svg-images/svgexport-12.svg"
import jobs from "../../../work/components/filter-comps/all_jobs.json"
import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import "../../../work/components/scrollbar.css"
import { check_selected_jobs, handle_selected_skills } from "~/routes/api/xelosani/setup/setup";
import { createAsync, useNavigate } from "@solidjs/router";

const Skills = () => {
    const check_jobs = createAsync(check_selected_jobs)
    const [allJobs, setAllJobs] = createSignal()
    const [selectedJobs, setSelectedJobs] = createSignal([])
    const navigate = useNavigate()

    const job_search = (searchTerm) => {
        setAllJobs(() => {
            return jobs.filter((job) => {
                const isNotSelected = !selectedJobs().includes(job);
                const matchesSearch = job.toLowerCase().includes(searchTerm);
                return isNotSelected && matchesSearch;
            });
        });
        if (document.getElementById("job_scroll")) {
            document.getElementById("job_scroll").style.display = "block"
        }
    }

    const handleBodyClick = (event) => {
        if (event.target.id === "job_scroll" || event.target.id === "job-btn") {
            return
        } else {
            if (document.getElementById("job_scroll") && event.target.id !== "input") {
                document.getElementById("job_scroll").style.display = "none"
            }
        }
    }

    createEffect(() => {
        document.body.addEventListener("click", handleBodyClick);
        onCleanup(() => {
            document.body.removeEventListener("click", handleBodyClick);
        });
    });

    const handleAddSkill = async () => {
        try {
            const response = await handle_selected_skills(selectedJobs())
            if (response !== 200) throw new Error(response)
            navigate("/setup/xelosani/success")
        } catch (error) {
            if (error.message === "401") {
                return alert("მომხმარებელი არ არის შესული სისტემაში.")
            }
            return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.")
        }
    }

    return (
        <div class="flex flex-col p-10 justify-between w-full items-center h-full mb-4">
            <Switch>
                <Match when={check_jobs() === 200}>
                    <div class="h-[180px] overflow-y-auto mb-3 curstom-scrollbar w-full">
                        <Show when={selectedJobs().length > 0}>
                            <div class="flex mb-3 items-center gap-2 flex-wrap">
                                <For each={selectedJobs()}>
                                    {(sj) => <button onClick={() => setSelectedJobs(prev => prev.filter((a) => a !== sj))} class="flex px-2 py-1 gap-x-1 items-center bg-gray-100 rounded-[16px]">
                                        <img width={16} class="border-2 border-gr rounded-full" height={16} src={clear}></img>
                                        <p class="font-[thin-font] font-bold text-gray-700">{sj}</p>
                                    </button>}
                                </For>
                            </div>
                        </Show>
                    </div>
                    <div class="h-full w-full relative">
                        <input onInput={(e) => job_search(e.target.value.trim())} autocomplete="off" id="input" onClick={() => {
                                job_search(document.getElementById("input").value)
                                document.getElementById("job_scroll").style.display = "block"
                            }} class="bg-gray-200 border border-gray-200 rounded appearance-none w-full bg-transparent outline-none block text-gray-700 font-bold font-[thin-font] leading-tight py-3 px-4" type="text" name="skill" placeholder="მოძებნე უნარი" />
                        <Show when={allJobs()}>
                            <div id="job_scroll" class="border custom-scrollbar absolute bg-white h-[200px] overflow-y-scroll border-t-0 border-gray-200 w-full">
                                <Switch>
                                    <Match when={allJobs()}>
                                        <For each={allJobs()}>
                                            {(j, i) => {
                                                return <button type="button" onClick={() => {
                                                        setAllJobs((prevJobs) => {
                                                            const newJobs = [...prevJobs];

                                                            const startIndex = i();
                                                            const deleteCount = 1;

                                                            newJobs.splice(startIndex, deleteCount);
                                                            return newJobs;
                                                        })
                                                        setSelectedJobs((prev) => [...prev, j])
                                                    }} id="job-btn" class="w-full text-left cursor-pointer text-lg px-3 py-2 hover:bg-gray-100 duration-200 font-[thin-font] font-bold my-1">{j}</button>
                                            }}
                                        </For>
                                    </Match>
                                </Switch>
                            </div>
                        </Show>

                        <button onClick={handleAddSkill} className="py-2 w-full mt-3 px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
                            გაგრძელება
                        </button>
                    </div>
                </Match>
                <Match when={check_jobs() === 400}>
                    <div class="flex items-center h-full"><p class="text-sm font-[normal-font] font-bold text-gray-700">თქვენ უნარები დამატებული გაქვთ გთხოვთ განაგრძოთ.</p></div>
                </Match>
            </Switch>
        </div>
    );
};

export default Skills;
