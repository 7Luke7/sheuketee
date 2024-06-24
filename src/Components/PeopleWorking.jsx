import { For, Index, onMount, createSignal } from "solid-js";
import emptyStar from "../../public/svg-images/svgexport-24.svg";
import fullStar from "../../public/svg-images/svgexport-19.svg";
import { A } from "@solidjs/router";
import ChevronLeftBlack from "../../public/svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../public/svg-images/ChevronRightBlack.svg";
import createEmblaCarousel from "embla-carousel-solid";

const recently_complete_jobs = [
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/default_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანა",
        timestamp: "14:12",
        review_given: 5,
    },
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/default_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანა დწაჯდწად აწდპაწ ჯდპაწჯ დწაჯდ წაპდწადიპ აწჯ დპაწჯდპ აწჯდპწაჯ დპაჯდპა ჯდწა ა ჯ აწდად დაწჯდ წადჯ აპდჯაწჯ პ",
        timestamp: "14:12",
        review_given: 3,
    },
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/defasult_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანა დაწ წადწადაწ დაწ დწადაწ დ",
        timestamp: "14:12",
        review_given: 5,
    },
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/default_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანა დწად ა დწა დ",
        timestamp: "14:12",
        review_given: 4,
    },
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/default_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანასე ჰსჯ ეჰაე4ჰ ეზჰ ",
        timestamp: "14:12",
        review_given: 1,
    },
    {
        firstname: "ლუკა",
        lastName: "ჩიკვაიძე",
        profile_image: "../../public/default_profile.png",
        job_description: "შეაკეთა კარი და სარეცხი მანქანა",
        timestamp: "14:12",
        review_given: 2,
    },
];

export const PeopleWorking = () => {
    const [currentIndex, setCurrentIndex] = createSignal(0);
    const [emblaRef, embla] = createEmblaCarousel(
    () => ({ loop: true }),
  )

    let emblaDotsContainer;

    onMount(() => {
        if (embla()) {
            const emblaApi = embla();

            const dots = [];
            for (let i = 0; i < emblaApi.scrollSnapList().length; i++) {
                const button = document.createElement("button");
                button.className = "border-[rgb(55,65,81)] rounded-full border-2 w-[14px] h-[14px]";
                button.addEventListener("click", () => {
                    emblaApi.scrollTo(i, false);
                });
                emblaDotsContainer.appendChild(button);
                dots.push(button);
            }

            emblaApi.on("select", () => {
                const previousIndex = currentIndex();
                if (dots[previousIndex]) {
                    dots[previousIndex].style.borderColor = "rgb(55,65,81)";
                }
                const newIndex = emblaApi.selectedScrollSnap();
                setCurrentIndex(newIndex);
                if (dots[newIndex]) {
                    dots[newIndex].style.borderColor = "#14a800";
                }
            });

            if (dots[0]) {
                dots[0].style.borderColor = "#14a800";
            }
        }
    });

    const nextSlide = () => {
        embla().scrollNext();
    };

    const prevSlide = () => {
        embla().scrollPrev();
    };

    return (
        <section class="embla overflow-x-hidden" ref={emblaRef}>
            <div class="embla__container flex">
                {recently_complete_jobs.map((user) => (
                    <div class="flex-100">
                        <div class="pt-4">
                            <div class="flex items-center h-full justify-between">
                                <div class="gap-x-2 flex items-center">
                                    <img class="rounded-[50%] w-[28px] h-[28px]" src={user.profile_image}></img>
                                    <p class="text-gr font-[boldest-font]">{user.firstname + " " + user.lastName}</p>
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
                                <A class="text-gr px-3 flex items-center underline font-[thin-font] text-sm font-bold" href={`/job/${1}`}>
                                    იხილე მეტი
                                </A>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div class="flex items-center justify-between mt-2">
                <div class="flex items-center">
                    <button onClick={prevSlide} type="button">
                        <img src={ChevronLeftBlack} />
                    </button>
                    <button onClick={nextSlide} type="button">
                        <img src={ChevronRightBlack} />
                    </button>
                </div>
                <div ref={(el) => (emblaDotsContainer = el)} class="flex items-center gap-x-2"></div>
            </div>
        </section>
    );
};
