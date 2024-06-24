import checkIcon from "../../../../../public/svg-images/svgexport-23.svg"
import {A} from "@solidjs/router"

const Success = () => {
    return  <div className="flex flex-col items-center justify-center w-[600px] mx-auto text-center h-screen">
                <img src={checkIcon} width={200} height={200} />
                <h1 className="text-gray-800 font-[normal-font] font-bold text-2xl">თქვენი პროფილი შედგენილია</h1>
                <p className="text-gray-700 font-[thin-font] font-bold break-word mt-3">გილოცავთ თქვენ გაიარეთ პროფილის სეთაფი რაც თქვენს პროფილს პროფესინალურ შეხედულებას მისცემს ამით თქვენ შეძლებთ მოიზიდოთ მეტი მომხმარებელი</p>
                <A href="/profile/xelosani" class="font-[thin-font] font-bold mt-3 bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-5 py-1 rounded-[16px]">პროფილზე გადასვლა</A>
        </div>
}

export default Success