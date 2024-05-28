import { For, Index, createSignal, onMount } from "solid-js"
import { register } from 'swiper/element/bundle';
import emptyStar from "../../public/svg-images/svgexport-24.svg"
import fullStar from "../../public/svg-images/svgexport-19.svg"
import { A } from "@solidjs/router";

register()

export const PeopleWorking = () => {
    const [current, setCurrent] = createSignal(0)

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

    let swiperEl;
    onMount(() => {
        const swiperParams = {
            slidesPerView: 1,
            pagination: true,
            loop: true,
            breakpoints: {
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 1,
              },
            },
            on: {
              init() {
                // ...
              },
            },
          };
        
        Object.assign(swiperEl, swiperParams);
    })
    
    return <swiper-container style={{
            "--swiper-pagination-color": "#108a00",
            "--swiper-pagination-bullet-inactive-color": "#6e6967",
            "--swiper-pagination-top": "85%",
        }}
        pagination-clickable="true"
        autoplay-delay="2500" loop="true" autoplay-disable-on-interaction="false"
        ref={swiperEl}>
    <For each={recently_complete_jobs}>{(user) => {
        return <swiper-slide>
            <div class="pt-4">
            <div class="flex items-center h-full justify-between">
                <div class="gap-x-2 flex items-center">
                    <img class="rounded-[50%] w-[28px] h-[28px]" src={user.profile_image}></img>
                    <p class="text-gr font-[boldest-font]">{user.firstname + " " + user.lastName}</p>
                </div>
                <p class="text-gr font-[normal-font]">{user.timestamp}</p>
            </div>
            <p class="py-3 text-gr font-[normal-font]">{user.job_description.length > 120 ? user.job_description.substring(0, 120) + "..." : user.job_description}</p>
            <div class="flex">
                <Index each={new Array(user.review_given)}>
                    {() => {
                        return <div>
                            <img src={fullStar}></img>
                        </div>
                    }}
                </Index>
                <Index each={new Array(5 - user.review_given)}>
                    {() => {
                        return <div>
                            <img src={emptyStar}></img>
                        </div>
                    }}
                </Index>
                <A class="text-gr px-3 flex items-center underline font-[thin-font] text-sm font-bold" href={`/job/${1}`}>იხილე მეტი</A>
            </div>
            </div>
        </swiper-slide>
    }}</For>
    </swiper-container>
}