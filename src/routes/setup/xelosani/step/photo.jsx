import { A, createAsync, useNavigate } from "@solidjs/router";
import defaultProfileSVG from "../../../../../public/default_profile.png"
import CameraSVG from "../../../../../public/svg-images/camera.svg"
import spinnerSVG from "../../../../../public/svg-images/spinner.svg"
import { Match, Suspense, Switch, batch, createSignal } from "solid-js";
import { profile_image_no_id } from "~/routes/api/xelosani/setup/setup";
import { handle_profile_image } from "~/routes/api/prof_image";
import { Buffer } from 'buffer';
import {upload_profile_picture_setup} from "~/routes/api/xelosani/setup/step"

const ProfilePictureStep = () => {
    const [file, setFile] = createSignal()
    const profile_image = createAsync(profile_image_no_id)
    const [error, setError] = createSignal()
    const [imageLoading, setImageLoading] = createSignal(false)
    const [uploadingImage, setUploadingImage] = createSignal(false)
    const navigate = useNavigate()

    const approveUpload = async () => {
        try {
            if (!file()) {
                return setError(true)
            }
            setUploadingImage(true)
            const response = await handle_profile_image(file())
            console.log(response)
            if (response === 200) {
                setUploadingImage(false)
                navigate("/setup/xelosani/step/contact")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handle_file_preview = async (e) => {
        setImageLoading(true)
        const file = e.target.files[0]
        try {
            const response = await upload_profile_picture_setup(file)
            if (response !== 200) throw new Error("Problem")
            alert("Picture set")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Switch>
            <Match when={!profile_image()}>
                <div class="flex p-10 flex-col items-center mb-4">
                    <Switch>
                        <Match when={!imageLoading()}>
                            <label for="profilePic" class="hover:opacity-[0.7] cursor-pointer">
                                <div class="relative">
                                    <Suspense fallback={<div class="w-[200px] h-[200px] rounded-full mb-4 bg-[#E5E7EB]"></div>}>
                                        <img id="setup_image" src={defaultProfileSVG} alt="Profile" class={`object-cover ${error() && "border-red-500"} w-[140px] border-2 h-[140px] rounded-full mb-4`} />
                                    </Suspense>
                                    <img src={CameraSVG} alt="camera" class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]" />
                                </div>
                            </label>
                            <input type="file" onChange={handle_file_preview} class="hidden" accept="image/webp, image/png, image/gif, image/jpeg, image/avif, image/jpg" id="profilePic" />
                        </Match>
                        <Match when={imageLoading()}>
                            <div class="w-[140px] flex flex-col justify-center mb-4 items-center h-[140px] rounded-[50%] bg-[#E5E7EB]">
                                <img class="animate-spin" src={spinnerSVG} />
                                <p class="text-dark-green font-[thin-font] text-xs font-bold">იტვირთება...</p>
                            </div>
                        </Match>
                    </Switch>
                    <button onClick={approveUpload} disabled={imageLoading()} class={`cursor-pointer font-[thin-font] font-bold text-sm tracking-wider bg-[#108a00] duration-300 hover:bg-[#14a800] text-white py-2 px-3 ${imageLoading() && "bg-[#E5E7EB]" } rounded-md`}>
                        პროფილზე დაყენება
                    </button>
                </div>
            </Match>
            <Match when={profile_image()}>
                <div class="p-10 flex flex-col items-center">
                    <p class="text-sm font-[normal-font] font-bold text-gray-700">პროფილის ფოტო უკვე დამატებულია გთხოვთ განაგრძოთ.</p>
                    <A className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover" href="/setup/xelosani/step/contact">გაგრძელება</A>
                </div>
            </Match>
        </Switch>
    );
};

export default ProfilePictureStep;
