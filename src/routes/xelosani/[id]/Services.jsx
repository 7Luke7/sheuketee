import { A } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import EditSVG from "../../../../public/svg-images/edit_icon.svg"
import ExternalLinkSVG from "../../../../public/svg-images/external_link.svg"

export const Services = ({status}) => {
    return <div class="mt-2 grid grid-cols-4 gap-x-2">
        <div class="flex border flex-col">
            <img src="https://picsum.photos/273/230" />
            <div class="p-2 flex flex-col">
                <h2 class="border-b font-[normal-font] break-all text-md font-bold">
                    ხელთნაკეთი საათები და ბევრი რამ ასე რომ
                </h2>
                <p class="font-[thin-font] text-gray-600 break-all text-sm font-bold">
                    საათები კეთდება ძირითადად უჟანგავი მეტალისგან
                    საათები კეთდება ძირითადად უჟანგავი მეტალისგან
                </p>
                <p class="my-1 font-[normal-font] font-bold text-dark-green text-sm">ფასი: 60₾</p>
                <div class="flex justify-between gap-x-2 font-[thin-font] text-sm font-bold">
                    <A href="/login" class="border flex items-center gap-x-1 text-gray-700 justify-center border-dark-green py-1 w-1/2 rounded-[16px] text-center">
                        იხილე მეტი
                        <img src={ExternalLinkSVG} />
                    </A>
                    <Switch>
                        <Match when={status === 401}>
                            <A href="/choose" class="bg-dark-green w-1/2 py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">შეუკვეთე</A>
                        </Match>
                        <Match when={status === 200}>
                            <A href="/choose" class="bg-dark-green flex items-center gap-x-1 justify-center w-1/2 py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">
                                <img src={EditSVG} />
                                შეასწორე
                            </A>
                        </Match>
                    </Switch>
                </div>
            </div>
        </div>
    </div>
}