import { For, Index, onMount } from "solid-js";
import ChevronLeftBlack from "../svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../svg-images/ChevronRightBlack.svg";
import emptyStar from "../svg-images/svgexport-24.svg";
import fullStar from "../svg-images/svgexport-19.svg";
import { Navigation, Pagination } from "swiper/modules";
import Swiper from "swiper";
import profileImage from "../default_profile.png"
import { A } from "@solidjs/router";

const recently_complete_jobs = [
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description: "შეაკეთა კარი და სარეცხი მანქანა",
    timestamp: "14:12",
    review_given: 5,
  },
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description:
      "შეაკეთა კარი და სარეცხი მანქანა დწაჯდწად აწდპაწ ჯდპაწჯ დწაჯდ წაპდწადიპ აწჯ დპაწჯდპ აწჯდპწაჯ დპაჯდპა ჯდწა ა ჯ აწდად დაწჯდ წადჯ აპდჯაწჯ პ",
    timestamp: "14:12",
    review_given: 3,
  },
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description:
      "შეაკეთა კარი და სარეცხი მანქანა დაწ წადწადაწ დაწ დწადაწ დ",
    timestamp: "14:12",
    review_given: 5,
  },
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description: "შეაკეთა კარი და სარეცხი მანქანა დწად ა დწა დ",
    timestamp: "14:12",
    review_given: 4,
  },
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description: "შეაკეთა კარი და სარეცხი მანქანასე ჰსჯ ეჰაე4ჰ ეზჰ ",
    timestamp: "14:12",
    review_given: 1,
  },
  {
    firstname: "ლუკა",
    lastName: "ჩიკვაიძე",
    profile_image: profileImage,
    job_description: "შეაკეთა კარი და სარეცხი მანქანა",
    timestamp: "14:12",
    review_given: 2,
  },
];

export const PeopleWorking = () => {
  let navigateRight;
  let navigateLeft;

  onMount(() => {
    new Swiper(".swiper", {
      modules: [Navigation, Pagination],
      spaceBetween: 10,
      slidesPerView: 1,
      navigation: {
        nextEl: navigateRight,
        prevEl: navigateLeft,
      },
    });
  });

  return (
    <section class="swiper">
      <div class="swiper-wrapper">
        <For
          each={recently_complete_jobs}
          children={(user, index) => (
            <div class="pt-4 swiper-slide">
              <div class="flex items-center h-full justify-between">
                <div class="gap-x-2 flex items-center">
                  <img
                    class="rounded-[50%] w-[28px] h-[28px]"
                    src={user.profile_image}
                  ></img>
                  <p class="text-gr font-[boldest-font]">
                    {user.firstname + " " + user.lastName}
                  </p>
                </div>
                <p class="text-gr font-[normal-font]">{user.timestamp}</p>
              </div>
              <p class="py-3 text-gr font-[normal-font]">
                {user.job_description.length > 120
                  ? user.job_description.substring(0, 120) + "..."
                  : user.job_description}
              </p>
              <div class="flex">
                <Index each={new Array(user.review_given)}>
                  {() => (
                    <div>
                      <img src={fullStar}></img>
                    </div>
                  )}
                </Index>
                <Index each={new Array(5 - user.review_given)}>
                  {() => (
                    <div>
                      <img src={emptyStar}></img>
                    </div>
                  )}
                </Index>
                <A
                  class="text-gr px-3 flex items-center underline font-[thin-font] text-sm font-bold"
                  href={`/job/${1}`}
                >
                  იხილე მეტი
                </A>
              </div>
            </div>
          )}
        />
      </div>
      <button
        ref={navigateLeft}
        class="absolute -translate-y-1/2 top-1/2 z-[50] left-0 cursor-pointer"
      >
        <img src={ChevronLeftBlack} width={36} />
      </button>
      <button
        ref={navigateRight}
        class="absolute z-[50] -translate-y-1/2 top-1/2 right-0 cursor-pointer"
      >
        <img src={ChevronRightBlack} width={36} />
      </button>
    </section>
  );
};
