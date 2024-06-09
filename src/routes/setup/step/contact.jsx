import { createAsync } from "@solidjs/router"
import { get_account } from "../../api/user";
import { Match, Show, Switch } from "solid-js";

const Contact = () => {
    const account = createAsync(get_account)

    return <Show when={account()}>
        <form class="w-full">
            <Switch>
                <Match when={!account().email}>
                    <div class="flex items-center justify-between">
                        <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                            მეილი
                        </label>
                    </div>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="text" name="email" placeholder="example@gmail.com" />
                </Match>
                <Match when={!account().phone}>
                    <div class="flex items-center justify-between">
                        <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-mobile">
                            ტელეფონის ნომერი
                        </label>
                    </div>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-mobile" type="text" name="phone" placeholder="555555555    " />
                </Match>
            </Switch>
            <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
          გაგრძელება
        </button>        </form>
    </Show>
}

export default Contact