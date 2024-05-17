import { A } from "@solidjs/router"
import { Footer } from "~/Components/Footer"

const Login = () => {
    return <section class="mx-12 mt-6">
        <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
        <div class="justify-center min-h-[60vh] flex items-center">
            <div class="border py-5 w-[40%] flex flex-col items-center min-h-[300px] rounded-2xl border-slate-300">
                <h1 class="text-center font-bold font-[bolder-font] text-xl">შემოგვიერთდი</h1>
                <div class="border-b justify-center border-gray pb-2 flex font-[font-normal] text-lg mt-2 items-center gap-x-2">
                    <A href="/login" class="text-dark-green">შესვლა</A>
                    <div class="w-[1px] h-6 bg-slate-300"></div>
                    <A href="/register">რეგისტრაცია</A>
                </div>
                <form class="flex flex-col gap-y-2 font-[normal-font] text-lg mt-2 items-center gap-x-5">
                    <input type="email" class="rounded-[16px] border border-gray outline-none text-sm px-4 py-2" placeholder="მეილი"></input>
                    <input type="password" class="rounded-[16px] border border-gray outline-none text-sm px-4 py-2" placeholder="პაროლი"></input>
                    <button type="submit" class="w-full bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white py-2 rounded-[16px]">შესვლა</button>
                </form>
                <div class="flex mt-6 items-center w-[40%]">
                    <hr class="flex-grow border-slate-300"/>
                    <span class="mx-4 font-[font-normal] text-gray-500">ან</span>
                    <hr class="flex-grow border-slate-300"/>
                </div>
                <A href="/register" class="mt-3 font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">რეგისტრაცია</A>
            </div>
        </div>
        <Footer></Footer>
    </section>
}

export default Login