import { A } from "@solidjs/router"
import arrowLeft from "../../public/svg-images/arrow-left.svg"
import bell from "../../public/svg-images/bell.svg"
import person from "../../public/svg-images/person.svg"

const Account = (props) => {
    return <div class="m-5">
        <div class="ml-3">
            <button onClick={() => history.back()} class="inline-block">
                <img src={arrowLeft} class="duration-200 ease-in-out hover:bg-gray-100" />
            </button>
        </div>
        <div class="flex h-[80vh]">
            <div class="h-full border-r">
                <ul class="flex flex-col mr-4 gap-y-4">
                    <A href="/account" class={`text-left text-xl py-2 px-4 flex items-center gap-x-2 rounded-[16px] font-[thin-font] font-bold ease-in duration-100 ${props.location.pathname  === "/account" ? "bg-gray-200 hover-none" : "hover:bg-gray-100"}`}>
                        <img src={person}></img>
                        <p>
                            ჩემი ექაუნთი
                        </p>
                    </A>
                    <A href="/account/notifications" class={`text-left flex items-center gap-x-2 text-xl py-2 px-4 rounded-[16px] font-[thin-font] font-bold ease-in duration-100 ${props.location.pathname  === "/account/notifications" ? "bg-gray-200 hover-none" : "hover:bg-gray-100"}`}>
                        <img src={bell}></img>
                        <p>
                            შეტყობინებები
                        </p>
                    </A>
                </ul>
            </div>
            <div class="flex-[10] flex flex-col gap-y-5">
                {props.children}
            </div>
        </div>
    </div>
}

export default Account