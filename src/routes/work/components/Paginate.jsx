import PaginateLeftSVG from "../../../../public/svg-images/svgexport-6.svg"
import PaginateRightSVG from "../../../../public/svg-images/svgexport-14.svg"
import DoubleArrowLeftSVG from "../../../../public/svg-images/double-arrow-left-icon.svg"
import CheckSVG from "../../../../public/svg-images/check.svg"
import DoubleArrowRightSVG from "../../../../public/svg-images/double-arrow-right-icon.svg"
import { A } from "@solidjs/router"

export const Paginate = () => {
    return <div class="flex sticky h-[35px] bottom-0 items-center justify-center bg-gray-100">
        <img src={DoubleArrowLeftSVG} alt="პირველი"></img>
        <img src={PaginateLeftSVG} alt="უკან"></img>
        <div class="flex items-center gap-x-1">
            <A class="font-[thin-font] text-gray-900 font-bold" href="#">1</A>
            <A class="font-[thin-font] text-gray-900 font-bold" href="#">2</A>
            <A class="font-[thin-font] text-gray-900 font-bold" href="#">3</A>
            <A class="font-[thin-font] text-gray-900 font-bold" href="#">4</A>
            <A class="font-[thin-font] text-gray-900 font-bold" href="#">5</A>
        </div>
        <img src={PaginateRightSVG} alt="წინ"></img>
        <img src={DoubleArrowRightSVG} alt="ბოლო"></img>
        <p class="px-2 flex items-center font-[thin-font] text-xs text-gray-900 font-bold">
            გაჩვენებთ <input value={5} class="text-center border outline-none w-[24px] h-[24px]" type="text">
            5</input> 2000-დან <A class="bg-dark-green" href="#ids">
                <img src={CheckSVG}></img>
            </A>
        </p>
    </div>
}