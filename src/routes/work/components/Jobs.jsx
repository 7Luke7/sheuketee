import { A } from "@solidjs/router";
import { For, Switch, createSignal } from "solid-js";
import "./scrollbar.css";
import dropdownSVG from "../../../svg-images/svgexport-8.svg";
import { JobType } from "./filter-comps/JobType";
import { Pay } from "./filter-comps/Pay";
import { Sort } from "./filter-comps/Sort";
import { Paginate } from "./Paginate";

export const Jobs = (props) => {
  const [isOpen, setIsOpen] = createSignal({
    jobType: false,
    location: false,
    pay: false,
    sort: false,
  });

  return (
    <div class="flex-[6] relative overflow-y-scroll custom-scrollbar">
      <div class="flex border-b sticky z-[10] top-0 bg-white px-4 pb-2 items-center justify-between">
        <div class="flex items-center mt-2">
          <button
            onClick={() =>
              setIsOpen((prev) => {
                return {
                  location: false,
                  pay: false,
                  date: false,
                  jobType: !prev.jobType,
                };
              })
            }
            class="flex items-center"
          >
            <p class="font-[thin-font] text-md font-bold">სამუშაოს ტიპი</p>
            <img src={dropdownSVG}></img>
          </button>
        </div>
        <div class="flex items-center mt-2">
          <button
            onClick={() =>
              setIsOpen((prev) => {
                return {
                  jobType: false,
                  pay: false,
                  date: false,
                  location: !prev.location,
                };
              })
            }
            class="flex items-center"
          >
            <p class="font-[thin-font] text-md font-bold">მდებარეობა</p>
            <img src={dropdownSVG}></img>
          </button>
        </div>
        <div class="flex items-center mt-2">
          <button
            onClick={() =>
              setIsOpen((prev) => {
                return {
                  jobType: false,
                  location: false,
                  date: false,
                  pay: !prev.pay,
                };
              })
            }
            class="flex items-center"
          >
            <p class="font-[thin-font] text-md font-bold">ანაზღაურება</p>
            <img src={dropdownSVG}></img>
          </button>
        </div>
        <div class="flex items-center mt-2">
          <button
            onClick={() =>
              setIsOpen((prev) => {
                return {
                  jobType: false,
                  location: false,
                  pay: false,
                  sort: !prev.sort,
                };
              })
            }
            class="flex items-center"
          >
            <p class="font-[thin-font] text-md font-bold">დალაგება</p>
            <img src={dropdownSVG}></img>
          </button>
        </div>
      </div>
      <div class="relative">
        <div class="sticky top-[41px] z-[10]">
          <Switch>
            <Match when={isOpen().jobType}>
              {/* <JobType></JobType> */}
            </Match>
            <Match when={isOpen().location}>
              {/* <Location findLocation={props.findLocation} marker={props.marker} map={props.map}></Location> */}
            </Match>
            <Match when={isOpen().sort}>
              <Sort></Sort>
            </Match>
            <Match when={isOpen().pay}>
              <Pay></Pay>
            </Match>
          </Switch>
        </div>
        <For each={props.jobs().jobs}>
          {(job) => {
            return (
              <A href={``}>
                <div class="pt-4 px-4 hover:bg-gray-100 border-b">
                  <div class="flex items-start h-full justify-between">
                    <h2 class="text-gray-900 max-w-[600px] text-lg font-[bolder-font]">
                      {job.title}
                    </h2>
                    <div class="gap-x-2 flex my-1 items-center">
                      <p class="text-gr border-r px-2 font-[normal-font]">
                        {job.createdAt}
                      </p>
                      <img
                        class="rounded-[50%] w-[28px] h-[28px]"
                        src={job.profPic}
                      ></img>
                      <p class="text-slate-900 font-bold text-sm font-[thin-font]">
                        {job._creator.firstname + " " + job._creator.lastname}
                      </p>
                    </div>
                  </div>
                  <p class="py-3 text-gr text-sm font-bold font-[thin-font]">
                    {job.description.length > 120
                      ? job.description.substring(0, 120) + "..."
                      : job.description}
                  </p>
                  <div class="flex items-center gap-x-2">
                    <p class="text-dark-green font-bold font-[normal-font]">
                      {job.price}₾
                    </p>
                    <p class="text-gray-500 font-bold text-sm font-[thin-font]">
                      მის: {job._creator.location.display_name.substring(0, 45)}
                    </p>
                  </div>
                </div>
              </A>
            );
          }}
        </For>
      </div>
      <Paginate></Paginate>
    </div>
  );
};
