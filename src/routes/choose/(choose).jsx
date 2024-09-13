import { A } from "@solidjs/router"
import { createSignal } from "solid-js"
import { Stepone } from "./Stepone"
import { Steptwo } from "./Steptwo"
import { SmallFooter } from "~/Components/SmallFooter"

const Choose = () => {
    const [step, setStep] = createSignal(0)
    const [current, setCurrent] = createSignal("ხელოსანი")

    return <div class="mx-12 mt-6">
        <header class="flex items-center justify-between">
            <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
            <div class="flex items-center gap-x-2">
                <p class="font-[normal-font] text-sm font-bold">გაქვთ ექაუნთი?</p>
                <A href="/login" class="text-dark-green font-[thin-font] underline text-sm font-bold">შესვლა</A>
            </div>
        </header>

        <section class="flex min-h-[65vh] justify-center w-[70%] m-auto flex-col items-center">
            <Switch fallback={<div>Not Found</div>}>
                <Match when={step() === 0}>
                    <Stepone setStep={setStep} current={current} setCurrent={setCurrent} />
                </Match>
                <Match when={step() === 1}>
                    <Steptwo setStep={setStep} current={current} />
                </Match>
            </Switch>
        </section>
        <div class="mt-32">
            <SmallFooter></SmallFooter>
        </div>
    </div>
}

export default Choose
