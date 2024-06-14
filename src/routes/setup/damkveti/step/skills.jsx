import clear from "../../../../../public/svg-images/svgexport-12.svg"
import jobs from "../../../work/components/filter-comps/all_jobs.json"
import { Match, Switch, createEffect, createSignal, onCleanup } from "solid-js";
import "../../../work/components/scrollbar.css"

const Skills = () => {
  const [allJobs, setAllJobs] = createSignal()
  const [selectedJobs, setSelectedJobs] = createSignal([])

  let job_srcoll;

  const job_search = (e) => {
    const searchTerm = e.target.value.toLowerCase();
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

  return (
    <div class="flex flex-col items-center h-full mb-4">
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
      <form autocomplete="off" class="w-full relative">
        <input onInput={job_search} id="input" onClick={() => {
          setAllJobs(jobs)
          document.getElementById("job_scroll").style.display = "block"
          }} class="bg-gray-200 border border-gray-200 rounded appearance-none w-full bg-transparent outline-none block text-gray-700 font-bold font-[thin-font] leading-tight py-3 px-4" type="text" name="skill" placeholder="მოძებნე უნარი/ხელობა" />
        <Show when={allJobs()}>
          <div id="job_scroll" ref={el => job_srcoll = el} class="border custom-scrollbar absolute bg-white z-[10] h-[200px] overflow-y-scroll border-t-0 border-gray-200 w-full">
            <Switch>
              <Match when={allJobs()}>
                <For each={allJobs()}>
                  {(j) => {
                    return <button type="button" onClick={() => {
                      if (selectedJobs().some(sj => sj === j)) {
                        return
                      }
                      setSelectedJobs((prev) => [...prev, j])
                    }} id="job-btn" class="w-full text-left cursor-pointer text-lg px-3 py-2 hover:bg-gray-100 duration-200 font-[thin-font] font-bold my-1">{j}</button>
                  }}
                </For>
              </Match>
            </Switch>
          </div>
        </Show>
        <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
          გაგრძელება
        </button>
      </form>
    </div>
  );
};

export default Skills;
