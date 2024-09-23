import { For, onMount } from "solid-js";
import ChevronLeftBlack from "../../../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../svg-images/ChevronRightBlack.svg";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";
import { Navigation, Pagination } from "swiper/modules";
import Swiper from "swiper";

export const SkillCarousel = (props) => {
  let navigateRight;
  let navigateLeft;

  onMount(() => {
    new Swiper(".swiper", {
      modules: [Navigation, Pagination],
      spaceBetween: 10,
      slidesPerView: 4,
      grid: {
        fill: "row",
        rows: 2
      },
      navigation: {
        nextEl: navigateRight,
        prevEl: navigateLeft,
      },
    });
  });

  return (
    <section class="swiper w-[1440px]">
      <div class="swiper-wrapper">
        <For
          each={props.skills.displayableSkills}
          children={(skill, index) => (
            <div class="swiper-slide">
                <div class="bg-slate-200 border-2 rounded-[16px] border-slate-300 flex flex-col p-5">
                <h2 class="font-[medium-font] text-md text-gray-800 font-bold">
                  {skill.displaySkills}
                </h2>
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <For each={new Array(skill.reviews)}>
                      {() => <img src={fullStar} width={28} height={28}></img>}
                    </For>
                    <For each={new Array(5 - skill.reviews)}>
                      {() => <img src={emptyStar} width={28} height={28}></img>}
                    </For>
                  </div>
                  <div class="flex items-center">
                    <p class="text-dark-green font-bold font-[normal-font]">
                      {skill.completedJobs} სამუშაო
                    </p>
                  </div>
                </div>
                </div>
            </div>
          )}
        />
      </div>
      <button
          ref={navigateLeft}
          class="absolute -translate-y-1/2 top-1/2 z-[50] left-0 cursor-pointer"
        >
          <img src={ChevronLeftBlack} width={86} />
        </button>
        <button
          ref={navigateRight}
          class="absolute z-[50] -translate-y-1/2 top-1/2 right-0 cursor-pointer"
        >
          <img src={ChevronRightBlack} width={86} />
        </button>
    </section>
  );
};
