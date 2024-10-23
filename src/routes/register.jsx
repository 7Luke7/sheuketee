import { A } from "@solidjs/router"
import { SmallFooter } from "~/Components/SmallFooter"

const Register = (props) => {
    return <div class="h-screen overflow-y-hidden mx-12 pt-6">
    <header class="flex items-center justify-between">
            <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
            <div class="flex items-center gap-x-2">
                <p class="font-[normal-font] text-sm font-bold">გაქვთ ექაუნთი?</p>
                <A href="/login" class="text-dark-green font-[thin-font] underline text-sm font-bold">შესვლა</A>
            </div>
        </header>
    <section class="flex min-h-[65vh] justify-center w-[70%] m-auto flex-col items-center">
    {props.children}
    </section>
    <div class="mt-32">
            <SmallFooter></SmallFooter>
        </div>
    </div>
}

export default Register