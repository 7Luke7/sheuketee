import { createSignal, createEffect } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import ChevronRightBlackSVG from "../../../public/svg-images/ChevronRightBlack.svg";
import ChevronLeftBlackSVG from "../../../public/svg-images/ChevronLeftBlack.svg";

const Step = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const steps = {
        photo: {
            step: 1,
            title: "ატვირთე ფოტო",
            description: "ჩვენი რჩევაა ფოტო აუცილებლად შეარჩიოთ, დაგეხმარებათ რეპუტაციის მომატებაში."
        },
        contact: {
            step: 2,
            title: "დაამატე საკონტაქტო",
            description: "პროფილზე მეილისა და ტელეფონის ნომრის დამატება ეხმარება პოტენციურ კლიენტს დაგიკავშირდეთ მარტივად."
        },
        about: {
            step: 3,
            title: "თქვენს შესახებ",
            description: "მოგვიყევი თქვენს შესახებ, იდეალური ასოების რაოდენობა 150-250 იქნება, თუმცა შეგიძლიათ 600 მდე ასო გამოიყენოთ."
        },
        age: {
            step: 4,
            title: "დაბადების თარიღი",
            description: "მიუთითეთ თქვენი ასაკი მინიმუმ 16 წლის უნდა იყოს."
        },
        gender: {
            step: 5,
            title: "თქვენი სქესი",
            description: "დაამატეთ თქვენი სქესი."
        },
        skills: {
            step: 6,
            title: "დაამატე უნარი/ხელობა",
            description: "პროფილის ერთ-ერთი უმთავრესი ნაწილია უნარები, გთხოვთ სწორად შეარჩიოთ ის."
        },
        location: {
            step: 7,
            title: "დაამატე ლოკაცია",
            description: "დაამატეთ ლოკაცია წინააღმდეგ შემთხვევაში შეკვეთებს ვერ მიიღებთ."
        },
        service: {
            step: 8,
            title: "სერვისები.",
            description: "სერვისები."
        },
    };

    const stepKeys = Object.keys(steps);
    const [currentStepKey, setCurrentStepKey] = createSignal(location.pathname.split("/")[3]);

    createEffect(() => {
        const pathName = location.pathname.split("/")[3];
        setCurrentStepKey(pathName);
    });

    const handleNextStep = () => {
        const currentIndex = stepKeys.indexOf(currentStepKey());
        const nextIndex = currentIndex + 1;
        if (nextIndex < stepKeys.length) {
            const nextStepKey = stepKeys[nextIndex];
            navigate(`/setup/step/${nextStepKey}`);
        }
    };

    const handlePrevStep = () => {
        const currentIndex = stepKeys.indexOf(currentStepKey());
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            const prevStepKey = stepKeys[prevIndex];
            navigate(`/setup/step/${prevStepKey}`);
        }
    };

    return (
        <div class="h-[90vh] w-[90%] mx-auto">
            <div class="flex mt-12 h-full justify-start items-start">
                <A href="/" class="text-dark-green font-[thin-font] font-bold text-xl">შეუკეთე</A>
                <div class="w-full items-center h-full flex flex-col justify-between">
                    <div class="w-[600px]">
                        <h1 class="text-2xl font-[boldest-font] flex gap-x-1 items-center text-green-600 mb-4">
                            საფეხური {steps[currentStepKey()].step}: <p class="underline">{steps[currentStepKey()].title}</p>
                        </h1>
                        <p class="text-sm font-[thin-font] font-bold text-gr">{
                            steps[currentStepKey()].description}
                        </p>
                    </div>
                    <div class="w-[600px] border p-10">
                        {props.children}
                    </div>
                    <div class="w-full bg-indigo-100 border-2 border-[#14a800] rounded-md">
                        <div class="flex items-center justify-between gap-3 p-3 bg-white rounded">
                            <button
                                onClick={handlePrevStep}
                                class="flex hover:bg-gray-100 rounded-[16px] px-4 justify-center items-center border-none text-base gap-x-1 font-bold font-[thin-font] py-2.5 text-gray-700"
                            >
                                <img src={ChevronLeftBlackSVG} alt="Previous" />
                                წინა
                            </button>
                            <div class="w-full flex items-center justify-center">
                                <div class="w-[60%] flex bg-gray-100 rounded-3xl h-2">
                                    <div class="bg-[#108a00] h-2 rounded-3xl" style={{ width: `${(stepKeys.indexOf(currentStepKey()) * 12.5)}%` }}></div>
                                </div>
                                <div class="font-[thin-font] text-xs text-green-800 font-bold pl-2">
                                    {(stepKeys.indexOf(currentStepKey()) * 12.5)}%
                                </div>
                            </div>
                            <button
                                onClick={handleNextStep}
                                class="flex hover:bg-gray-100 rounded-[16px] px-4 justify-center items-center border-none text-base gap-x-1 font-bold font-[thin-font] py-2.5 text-gray-700"
                            >
                                გამოტოვება
                                <img src={ChevronRightBlackSVG} alt="Next" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step;
