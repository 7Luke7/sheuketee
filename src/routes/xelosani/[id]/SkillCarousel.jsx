import { For, createSignal, onMount } from "solid-js";
import ChevronLeftBlack from "../../../../public/svg-images/ChevronLeftBlack.svg";
import ChevronRightBlack from "../../../../public/svg-images/ChevronRightBlack.svg";
import createEmblaCarousel from "embla-carousel-solid";
import emptyStar from "../../../../public/svg-images/svgexport-24.svg";
import fullStar from "../../../../public/svg-images/svgexport-19.svg";

export const SkillCarousel = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [emblaRef, embla] = createEmblaCarousel(() => ({ loop: true, speed: 10 }));
  let emblaDotsContainer;

  onMount(() => {
    if (embla()) {
      const emblaApi = embla();

      emblaApi.on("select", () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });

      const dots = [];
      for (let i = 0; i < emblaApi.scrollSnapList().length; i++) {
          const button = document.createElement("button");
          button.className = "border-[rgb(209,213,219)] rounded-full border-2 w-[14px] h-[14px]";
          button.addEventListener("click", () => {
              emblaApi.scrollTo(i, false);
          });
          emblaDotsContainer.appendChild(button);
          dots.push(button);
      }

      emblaApi.on("select", () => {
          const previousIndex = currentIndex();
          if (dots[previousIndex]) {
              dots[previousIndex].style.borderColor = "rgb(209,213,219)";
          }
          const newIndex = emblaApi.selectedScrollSnap();
          setCurrentIndex(newIndex);
          if (dots[newIndex]) {
              dots[newIndex].style.borderColor = "rgb(55,65,81)";
          }
      });

      if (dots[0]) {
          dots[0].style.borderColor = "rgb(55,65,81)";
      }
    }
  });

  const nextSlide = () => {
    embla().scrollNext()
};

const prevSlide = () => {
    embla().scrollPrev()
};

  return (
    <section class="embla overflow-x-hidden" ref={emblaRef}>
      <div class="embla__container flex">
        {/* Each slide contains two rows with five items each */}
        <For each={Array(Math.ceil(props.skills.length / 10))} children={(_, index) => (
          <div class="flex-100 flex flex-col">
            {/* First row with items 0–5 */}
            <div class="grid grid-cols-5 gap-x-4">
              {props.skills.slice(index() * 10, index() * 10 + 5).map(skill => (
                <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                  <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">
                    {skill.skillName}
                  </h2>
                  <div class="flex mt-2 justify-between items-center">
                    <div class="flex items-center">
                      <For each={new Array(skill.reviews)}>
                        {() => (
                          <img src={fullStar} width={28} height={28}></img>
                        )}
                      </For>
                      <For each={new Array(5 - skill.reviews)}>
                        {() => (
                          <img src={emptyStar} width={28} height={28}></img>
                        )}
                      </For>
                    </div>
                    <div class="flex items-center">
                      <p class="text-dark-green font-bold font-[normal-font]">
                        {skill.completedJobs} სამუშაო
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Second row with items 5–10 */}
            <div class="grid grid-cols-5 gap-x-4 mt-4">
              {props.skills.slice(index() * 10 + 5, index() * 10 + 10).map(skill => (
                <div class="flex bg-slate-200 flex-col border-2 rounded-[16px] p-5 border-slate-300">
                  <h2 class="font-[medium-font] text-lg text-gray-800 font-bold">
                    {skill.skillName}
                  </h2>
                  <div class="flex mt-2 justify-between items-center">
                    <div class="flex items-center">
                      <For each={new Array(skill.reviews)}>
                        {() => (
                          <img src={fullStar} width={28} height={28}></img>
                        )}
                      </For>
                      <For each={new Array(5 - skill.reviews)}>
                        {() => (
                          <img src={emptyStar} width={28} height={28}></img>
                        )}
                      </For>
                    </div>
                    <div class="flex items-center">
                      <p class="text-dark-green font-bold font-[normal-font]">
                        {skill.completedJobs} სამუშაო
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} />
      </div>

      {/* Navigation buttons */}
      <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-x-1">
                    <button onClick={prevSlide} class="border-2 rounded-full p-1 border-gray-300" type="button">
                        <img src={ChevronLeftBlack} />
                    </button>
                    <button onClick={nextSlide} class="border-2 rounded-full p-1 border-gray-300" type="button">
                        <img src={ChevronRightBlack} />
                    </button>
                </div>
                <div ref={(el) => (emblaDotsContainer = el)} class="flex items-center gap-x-2"></div>
            </div>
    </section>
  );
};
