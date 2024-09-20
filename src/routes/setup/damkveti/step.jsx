import { createSignal, createEffect, batch } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import ChevronRightBlackSVG from "../../../../public/svg-images/ChevronRightBlack.svg";
import ChevronLeftBlackSVG from "../../../../public/svg-images/ChevronLeftBlack.svg";
import steps from "./steps.json"
import { get_damkveti_step } from "~/routes/api/damkveti/setup";

const Step = (props) => {
    const location = props.location
    const navigate = useNavigate();

    const stepKeys = Object.keys(steps);
    const [currentStepKey, setCurrentStepKey] = createSignal(location.pathname.split("/")[4]);
    const [damkvetiStep, setDamkvetiStep] = createSignal({
        stepPercent: 0,
        setupDone: false
    })

    createEffect(async () => {
        const pathName = location.pathname.split("/")[4];
        const damkveti_step = await get_damkveti_step()
        batch(() => {
            setCurrentStepKey(pathName);
            setDamkvetiStep(damkveti_step)
        })
    });

    const handleNextStep = () => {
        const currentIndex = stepKeys.indexOf(currentStepKey());
        const nextIndex = currentIndex + 1;
        if (nextIndex < stepKeys.length) {
            const nextStepKey = stepKeys[nextIndex];
            navigate(`/setup/damkveti/step/${nextStepKey}`);
        }
    };

    const handlePrevStep = () => {
        const currentIndex = stepKeys.indexOf(currentStepKey());
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            const prevStepKey = stepKeys[prevIndex];
            navigate(`/setup/damkveti/step/${prevStepKey}`);
        }
    };

    return (
        <div class="h-[90vh] w-[90%] mx-auto">
            <div class="flex mt-12 h-full justify-start items-start">
                <A href="/" class="text-dark-green font-bold font-[thin-font] text-xl">შეუკეთე</A>
                <div class="mx-auto w-[50%] items-center h-full flex flex-col justify-between">
                    <div class="w-full">
                        <h1 class="text-2xl font-[boldest-font] flex gap-x-1 items-center text-green-600 mb-4">
                            საფეხური {steps[currentStepKey()].step}: <p class="underline">{steps[currentStepKey()].title}</p>
                        </h1>
                        <p class="text-sm font-[thin-font] font-bold text-gr">
                            {steps[currentStepKey()].description}
                        </p>
                    </div>
                    <div class="w-full min-h-[400px] flex items-center justify-center border">
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
                                <div class="w-[60%] flex bg-[#E5E7EB] rounded-3xl h-2">
                                    <div class="bg-[#108a00] h-2 rounded-3xl" style={{ width: `${damkvetiStep()?.stepPercent}%` }}></div>
                                </div>
                                <div class="font-[thin-font] text-xs text-green-800 font-bold pl-2">
                                    {damkvetiStep()?.stepPercent}%
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
