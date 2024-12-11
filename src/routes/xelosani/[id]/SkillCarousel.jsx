import { For, Index, lazy, onMount } from "solid-js";
import ChevronLeftBlack from "../../../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../svg-images/ChevronRightBlack.svg";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";
import Swiper from "swiper"

export const SkillCarousel = (props) => {
  let swiperContainer;
  let navigateRightSkill;
  let navigateLeftSkill;

  onMount(async () => {
    new Swiper(swiperContainer, {
      spaceBetween: 10,
      slidesPerView: 4,
      grid: {
        fill: "row",
        rows: 2,
      },
      navigation: {
        nextEl: navigateRightSkill,
        prevEl: navigateLeftSkill,
      },
    });
  });

  return (
    <section class="relative max-w-[1440px] mx-auto">
      <div ref={(el) => (swiperContainer = el)} class="swiper" style={{ minHeight: "800px" }}>
        <div class="swiper-wrapper" style={{ display: "flex", flexWrap: "wrap" }}>
          <For each={props.skills}>
            {(skill) => (
              <div class="swiper-slide" style={{ width: "calc(25% - 10px)", height: "auto" }}>
                <div class="bg-slate-200 border-2 rounded-[16px] border-slate-300 flex flex-col p-5 h-full">
                  <h2 class="font-[medium-font] text-md text-gray-800 font-bold">
                    {skill.displaySkills}
                  </h2>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <Index each={new Array(skill.reviews)}>
                        {() => <img loading="lazy" src={fullStar} width={28} height={28} alt="Full star" />}
                      </Index>
                      <Index each={new Array(5 - skill.reviews)}>
                        {() => <img loading="lazy" src={emptyStar} width={28} height={28} alt="Empty star" />}
                      </Index>
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
          </For>
        </div>
      </div>

      {/* Navigation buttons */}
      <div class="absolute top-1/2 left-2 -translate-y-1/2 z-[10] flex items-center">
        <button
          ref={(el) => (navigateLeftSkill = el)}
          class="cursor-pointer bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
        >
          <img loading="lazy" src={ChevronLeftBlack} width={36} alt="Previous slide" />
        </button>
      </div>
      <div class="absolute top-1/2 right-2 -translate-y-1/2 z-[10] flex items-center">
        <button
          ref={(el) => (navigateRightSkill = el)}
          class="cursor-pointer bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
        >
          <img loading="lazy" src={ChevronRightBlack} width={36} alt="Next slide" />
        </button>
      </div>
    </section>
  );
};
