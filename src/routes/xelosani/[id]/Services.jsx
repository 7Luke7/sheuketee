import { A } from "@solidjs/router";
import { batch, For, Index, Match, onMount, Switch, Show } from "solid-js";
import EditSVG from "../../../svg-images/edit_icon.svg";
import ExternalLinkSVG from "../../../svg-images/external_link.svg";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import ChevronLeftBlack from "../../../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../svg-images/ChevronRightBlack.svg";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";
import avialabilityIcon from "../../../svg-images/accessibility-availability-custom-svgrepo-com.svg"

export const Services = (props) => {
  let swiperServiceEl;
  let navigateRightService;
  let navigateLeftService;

  onMount(() => {
    new Swiper(swiperServiceEl, {
      modules: [Navigation, Pagination],
      spaceBetween: 10,
      slidesPerView: 4,
      navigation: {
        nextEl: navigateRightService,
        prevEl: navigateLeftService,
      },
    });
    const banners = document.querySelectorAll('.banner');

    banners.forEach((banner) => {
      const bannerWidth = banner.offsetWidth;
      const wrapperWidth = banner.parentElement.offsetWidth;
      
      const duration = (bannerWidth + wrapperWidth) / 75;
      
      banner.style.animationDuration = `${duration}s`;
    });
  });

  return (
    <div class="relative w-full max-w-[1440px] mx-auto">
      <div ref={swiperServiceEl} class="swiper w-full">
        <div class="swiper-wrapper">
          <For each={props.services}>
            {(a) => (
              <div class="swiper-slide h-[630px]">
                <div class="flex border h-[630px] w-[351px] rounded-t-[16px] overflow-hidden flex-col">
                  <div class="relative">
                    <img src={a.service_thumbnail} loading="lazy" class="w-[351px] h-[351px]" />
                    <span class="absolute z-10 bg-dark-green text-white py-2 px-2 text-xs font-[thin-font] font-bold rounded-tl-[16px] top-0 left-0">
                      {a.mainCategory}
                    </span>
                      <img title="სერვისი ხელმისაწვდომია" class="absolute z-20 bg-dark-green text-white py-2 px-4 text-xs font-[thin-font] font-bold rounded-bl-[16px] top-0 right-0" src={avialabilityIcon}></img>
                    <span class="absolute z-10 bg-dark-green text-white py-2 px-2 text-xs font-[thin-font] font-bold rounded-l-[16px] bottom-4 right-0">
                      თქვენთან ახლოს
                    </span>
                    <div class="banner-wrapper absolute bottom-0 right-0 left-0 z-10 bg-dark-green-hover h-[18px] flex items-center overflow-hidden w-full">
                      <div class="banner flex">
                        <For each={a.categories}>
                          {(cc) => (
                            <span class="text-xs text-white font-[thin-font] font-bold mr-4">
                              {cc}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  </div>
                  <div class="p-2 h-full justify-between gap-y-2 flex flex-col">
                    <div>
                    <h2 class="border-b min-h-[55px] pb-1 font-[normal-font] text-gray-900 break-all text-md font-bold">
                      {a.mainTitle}
                    </h2>
                    <p class="font-[thin-font] text-gr break-all text-xs font-bold">
                      {a.mainDescription}
                    </p>
                    </div>
                    <div>
                    <div class="flex items-center justify-between">
                      <p class="my-1 font-[normal-font] font-bold text-dark-green text-sm">
                        ფასი: {a.mainPrice}₾
                      </p>
                      <Show when={a.ratings}>
                        <div class="flex">
                          <Index each={new Array(a.ratings)}>
                            {() => (
                              <img src={fullStar} width={18} height={18}></img>
                            )}
                          </Index>
                          <Index each={new Array(5 - a.ratings)}>
                            {() => (
                              <img src={emptyStar} width={18} height={18}></img>
                            )}
                          </Index>
                        </div>
                      </Show>
                    </div>
                    <div class="flex justify-between gap-x-2 font-[thin-font] text-sm font-bold">
                      <A
                        href={`/service/${a.publicId}`}
                        class="border flex items-center gap-x-1 text-gray-700 justify-center border-dark-green py-1 w-1/2 rounded-[16px] text-center"
                      >
                        იხილე მეტი
                        <img src={ExternalLinkSVG} />
                      </A>
                      <Switch>
                        <Match when={props.status === 401}>
                          <A 
                          href="#"
                            class="bg-dark-green w-1/2 py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                          >
                            შეუკვეთე
                          </A>
                        </Match>
                        <Match when={props.status === 200}>
                          <button
                            id="service_btn"
                            onClick={() => {
                              batch(() => {
                                props.setModal("სერვისები")
                                props.setEditingServiceTarget(a)
                              })
                            }}
                            class="bg-dark-green flex items-center gap-x-1 justify-center w-1/2 py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                          >
                            <img src={EditSVG} />
                            შეასწორე
                          </button>
                        </Match>
                      </Switch>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="absolute top-1/2 left-2 -translate-y-1/2 z-[10] flex items-center">
        <button
          ref={(el) => (navigateLeftService = el)}
          class="cursor-pointer bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
        >
          <img src={ChevronLeftBlack} width={36} />
        </button>
      </div>
      <div class="absolute top-1/2 right-2 -translate-y-1/2 z-[10] flex items-center">
        <button
          ref={(el) => (navigateRightService = el)}
          class="cursor-pointer bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
        >
          <img src={ChevronRightBlack} width={36} />
        </button>
      </div>
    </div>
  );
};
