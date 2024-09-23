import newPost from "../svg-images/new_post.svg"
import findWorker from "../svg-images/findWorker.svg"
import jobComplete from "../svg-images/jobComplete.svg"
import payment from "../svg-images/payment.svg"
import jobDone from "../svg-images/job_done.svg"
import interview from "../svg-images/interview.svg"
import job_hunt from "../svg-images/job_hunt.svg"
import { A } from "@solidjs/router"

export const HowItWorks = () => {
    return <div class="mt-24 w-full flex flex-col items-center shadow-2xl rounded-3xl bg-white p-8">
    <h2 class="font-[font-boldest] font-bold mt-3 text-2xl">როგორ მუშაობს</h2>
    <div class="mt-12 flex flex-col w-full gap-y-5">
        <div class="flex justify-center w-[80%] gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={newPost} alt="Post a job" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დამკვეთი განათავსებს შეკვეთას</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>გაიარე რეგისტრაცია</li>
                    <li>შექმენი პოსტი</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center py-2 px-4 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold border border-dark-green transition ease-in delay-20 px-4 py-2 text-center rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="h-[40px] w-[5px] bg-slate-300"></div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
              <div>
                <h2 class="font-[font-bolder] text-xl font-bold">იპოვე ხელოსანი</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>შეარჩიე გამოცდილი ხელოსანი</li>
                    <li>დაათვალიერე შეფასებები</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
            <img src={findWorker} alt="Find a worker" />
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={jobComplete} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
            <img src={job_hunt} alt="Job complete" />
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={interview} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
                </div>
            </div>
            <img src={payment} alt="Job complete" />
        </div>
        <div class="flex justify-center gap-x-12 border-l-4 border-slate-300 pl-8">
            <img src={jobDone} alt="Job complete" />
            <div>
                <h2 class="font-[font-bolder] text-xl font-bold">დასრულება</h2>
                <ul class="font-[font-normal] text-lg text-gr mt-3 list-disc ml-5">
                    <li>პროექტის დასრულება</li>
                    <li>მიღება და შეფასება</li>
                </ul>
                <div class="flex mt-8 gap-y-2 flex-col">
                    <A href="/register" class="font-[thin-font] font-bold text-center bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
                    <A href="/register" class="font-[thin-font] font-bold text-center border border-dark-green transition ease-in delay-20 px-8 py-2 rounded-[16px]">გაიგე მეტი</A>
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