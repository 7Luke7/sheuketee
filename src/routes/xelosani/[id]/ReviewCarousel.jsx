import { For, Index, onMount } from "solid-js";
import emptyStar from "../../../../public/svg-images/svgexport-24.svg"
import fullStar from "../../../../public/svg-images/svgexport-19.svg"
import { register } from 'swiper/element/bundle';
import { A } from "@solidjs/router";
import 'swiper/css/bundle';

register()

export const ReviewCarousel = () => {
    const recently_complete_jobs = [
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
            review_given: 5
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დწაჯდწად აწდპაწ ჯდპაწჯ დწაჯდ წაპდწადიპ აწჯ დპაწჯდპ აწჯდპწაჯ დპაჯდპა ჯდწა ა ჯ აწდად დაწჯდ წადჯ აპდჯაწჯ პ",
            timestamp: "14:12",
            review_given: 3
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დაწ წადწადაწ დაწ დწადაწ დ",
            timestamp: "14:12",
            review_given: 5
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა დწად ა დწა დ",
            timestamp: "14:12",
            review_given: 4
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანასე ჰსჯ ეჰაე4ჰ ეზჰ ",
            timestamp: "14:12",
            review_given: 1
        },
        {
            firstname: "ლუკა",
            lastName: "ჩიკვაიძე",
            profile_image: "../../public/default_profile.png",
            job_description: "შეაკეთა კარი და სარეცხი მანქანა",
            timestamp: "14:12",
            review_given: 2
        },

    ]
    let swiperEl
    onMount(() => {
        const swiperParams = {
            autoHeight: true,
            pagination: true,
            loop: true,
            direction: "horizontal",
              loop: true,
              breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2,
                },
            },
        };

        if (swiperEl) {
            Object.assign(swiperEl, swiperParams)
            swiperEl.initialize();
        }
    })
    return <div class="mt-2 w-full max-w-[1150px] border border-gray-300 overflow-hidden">
        <swiper-container
            style={{
                "--swiper-pagination-color": "#108a00",
                "--swiper-pagination-bullet-inactive-color": "#6e6967",
            }}
            pagination-clickable="true"
            init="false"
            ref={swiperEl}

        >
            <For each={recently_complete_jobs}>{(user) => (
                <swiper-slide>
                    <div class="px-4 py-2 h-[150px] flex flex-col border-r">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-x-1">
                                <A href="/profile" class="font-[thin-font] underline font-bold text-blue-500 text-sm">ლუკა ჩიკვაიძე</A>
                                <p class="font-[thin-font] font-bold text-gr text-sm">შეაფასა</p>
                                <A href="/service" class="text-blue-500 text-sm font-[normal-font] underline">
                                    სერვისი
                                </A>
                            </div>
                            <p class="text-gray-600 text-sm">{user.timestamp}</p>
                        </div>
                        <p class="py-2 text-gray-700 text-sm break-words">{user.job_description.length > 120 ? `${user.job_description.substring(0, 120)}...` : user.job_description}</p>
                        <div class="flex items-center">
                            <Index each={new Array(user.review_given)}>{() => (
                                <img src={fullStar} alt="Full star" class="w-4 h-4 mr-1" />
                            )}</Index>
                            <Index each={new Array(5 - user.review_given)}>{() => (
                                <img src={emptyStar} alt="Empty star" class="w-4 h-4 mr-1" />
                            )}</Index>
                            <A class="text-green-700 px-3 underline text-sm font-medium ml-auto" href={`/job/${user.id}`}>იხილე მეტი</A>
                        </div>
                    </div>
                </swiper-slide>
            )}</For>
        </swiper-container>
    </div>
}