import { A } from "@solidjs/router"
import NewPostSVG from "../../../public/svg-images/new_post.svg"

export const InterviewWorker = () => {
    return <section class="w-full mt-24 bg-pink-100 rounded-[16px] py-8 px-12">
    <div class="flex justify-center gap-x-5">
        <img src={NewPostSVG}></img>
        <div class="w-[600px]">
            <h2 class="text-xl border-b border-slate-300 pb-2 font-[normal-font] font-bold w-full mb-5">
                განათავსე პოსტი
            </h2>
            <div class="flex flex-col items-start gap-y-2">
            <div>
                <p class="text-gr font-[boldest-font]">ზუსტი ადგილმდებარეობა</p>
                <span class="py-3 text-gr font-[normal-font]">ყურადღება მიაქციეთ ადგილმდებარეობის განსაზღვრას, გეხმარებათ იპოვოთ ახლოს მყოფი ხელოსნები.</span>
            </div>
            <div>
                <p class="text-gr font-[boldest-font]">აირჩიე კატეგორია</p>
                <span class="py-3 text-gr font-[normal-font]">სწორად შერჩეული კატეგორია შესაბამის ხელოსანს გაპოვნინებთ.</span>
            </div>
            <div>
                <p class="text-gr font-[boldest-font]">განათავსე ფოტოები</p>
                <span class="py-3 text-gr font-[normal-font]">უმთავრესი ნაწილი პოსტის შექმნისას ფოტოებია.</span>
            </div>
            <div>
                <p class="text-gr font-[boldest-font]">აღწერე სამუშაო</p>
                <span class="py-3 text-gr font-[normal-font]">თქვენს მიერ სწორი აღწერა დაეხმარება ხელოსანს სამუშაოს აღქმაში.</span>
            </div>
            <A href="/post" class="font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-8 py-2 rounded-[16px]">შექმენი პოსტი</A>
            </div>
        </div>
    </div>
</section>
}