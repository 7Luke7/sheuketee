import { Index, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import emptyStar from "../svg-images/svgexport-24.svg";
import fullStar from "../svg-images/svgexport-19.svg";
import ChevronLeftBlack from "../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../svg-images/ChevronRightBlack.svg";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

export const SwiperComponent = (props) => {
  let navigateRight;
  let navigateLeft;

  onMount(() => {
    // Initialize Swiper
    const swiper = new Swiper(".swiper", {
      modules: [Navigation, Pagination],
      spaceBetween: 50,
      slidesPerView: 3,
      loop: true,
      navigation: {
        nextEl: navigateRight,
        prevEl: navigateLeft,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  });

  return (
    <section class="w-[1430px]">
      <div class="swiper">
        <div class="swiper-wrapper">
          <For each={props.jobs}>
            {(user) => (
              <div class="swiper-slide">
                <div class="flex-100">
                  <A href="javascript:void(0)">
                    <div class="relative border h-[250px] border-dark-green flex flex-col rounded-lg w-full">
                      <div class="px-2.5 py-1">
                        <div class="flex">
                          <Index each={new Array(user.review_given)}>
                            {() => <img src={fullStar}></img>}
                          </Index>
                          <Index each={new Array(5 - user.review_given)}>
                            {() => <img src={emptyStar}></img>}
                          </Index>
                        </div>
                        <h6 class="mb-1 text-slate-800 font-[normal-font] font-bold text-xl">
                          {user.firstname}
                        </h6>
                        <p class="text-gr font-[thin-font] text-sm font-bold">
                          {user.job_description}
                        </p>
                      </div>

                      <div class="flex items-center justify-between p-4">
                        <div class="flex items-center">
                          <img
                            alt="User"
                            src={user.profile_image}
                            class="relative inline-block h-8 w-8 rounded-full"
                          />
                          <div class="flex flex-col ml-3 text-sm">
                            <span class="text-slate-800 font-semibold">
                              {user.firstname} {user.lastName}
                            </span>
                            <span class="text-slate-600">{user.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </A>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Navigation buttons */}
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
      </div>
    </section>
  );
};
