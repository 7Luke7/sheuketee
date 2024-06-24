import {onMount} from "solid-js"
import { MetaProvider } from "@solidjs/meta";
import ChevronLeftBlack from "../../../public/svg-images/ChevronLeftBlack.svg"
import ChevronRightBlack from "../../../public/svg-images/ChevronRightBlack.svg"

const Carousel = ({data}) => {
    let carousel

    onMount(() => {
        const OPTIONS = { slidesToScroll: 'auto' }
        const viewportNode = carousel.querySelector('#embla__viewport')
        const emblaDotsContainer = carousel.querySelector('#embla__dots')

        carousel = EmblaCarousel(viewportNode, OPTIONS)

        for (let i = 0; i < carousel.scrollSnapList().length; i++) {
            const button = document.createElement("button")
            button.className = "border-[rgb(55,65,81)] rounded-full border-2 w-[16px] h-[16px]"
            button.addEventListener("click", () => {
                carousel.scrollTo(i, false)
                if (i === carousel.selectedScrollSnap()) {
                    button.style.borderColor = "#14a800"
                }
                carousel.on("select", () => {
                    button.style.borderColor = "rgb(55,65,81)"
                })
            })
            emblaDotsContainer.appendChild(button)            
        }
    })

    const nextSlide = () => {
        carousel.scrollNext()
    }

    const prevSlide = () => {
        carousel.scrollPrev()
    }

    return <MetaProvider>
        <script defer src="https://unpkg.com/embla-carousel/embla-carousel.umd.js"></script>
        <section class="embla" ref={carousel}>
            <div id="embla__viewport">
                <div>
                    {[1, 2, 3, 4, 5].map(num => (
                        <div>
                            <div>{num}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div class="flex items-center justify-between mt-2">
                <div class="flex">
                    <button onClick={prevSlide} type="button">
                        <img src={ChevronLeftBlack} />
                    </button>
                    <button onClick={nextSlide} type="button">
                        <img src={ChevronRightBlack} />
                    </button>
                </div>
                <div id="embla__dots" class="flex items-center gap-x-2"></div>
            </div>
            
        </section>
    </MetaProvider>
}

export default Carousel