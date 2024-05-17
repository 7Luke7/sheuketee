import newPost from "../../public/svg-images/new_post.svg"
import findWorker from "../../public/svg-images/findWorker.svg"
import jobComplete from "../../public/svg-images/jobComplete.svg"
import payment from "../../public/svg-images/payment.svg"
import jobDone from "../../public/svg-images/job_done.svg"
import interview from "../../public/svg-images/interview.svg"
import job_hunt from "../../public/svg-images/job_hunt.svg"
import { A } from "@solidjs/router"

export const ThirdHero = () => {
    return <div class="mt-24 w-full flex flex-col items-center shadow-2xl rounded-3xl bg-white p-8">
    <h2 class="font-[font-boldest] font-bold mt-3 text-2xl">როგორ მუშაობს</h2>
    <div class="mt-12 flex flex-col w-full">
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={newPost} alt="Post a job" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დამკვეთი განათავსებს შეკვეთას</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>გაიარე რეგისტრაცია</li>
                    <li>შექმენი პოსტი</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={findWorker} alt="Find a worker" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">იპოვე ხელოსანი</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>შეარჩიე გამოცდილი ხელოსანი</li>
                    <li>დაათვალიერე შეფასებები და შეფასებები</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={jobComplete} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={job_hunt} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={interview} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={payment} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={jobDone} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gray mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col mt-12 gap-y-2">
        <p class="font-[normal-font] font-bold">შეცვალე მუშაობის პროცესი</p>
        <A href="/register" class="font-[thin-font] text-center font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შემოგვიერთდი</A>
    </div>
</div>
}