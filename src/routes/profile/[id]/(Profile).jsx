import { Header } from "~/Components/Header"
import defaultProfileSVG from "../../../../public/default_profile.png"
import CameraSVG from "../../../../public/svg-images/camera.svg"
import { handle_profile_image } from "../../api/prof_image"
import { get_user, get_user_profile_image } from "../../api/user"
import { A, createAsync, useNavigate } from "@solidjs/router"
import { Footer } from "~/Components/Footer"
import { Index, Show } from "solid-js"
import emptyStar from "../../../../public/svg-images/svgexport-24.svg"
import fullStar from "../../../../public/svg-images/svgexport-19.svg"
import location from "../../../../public/svg-images/location.svg"
import telephone from "../../../../public/svg-images/telephone.svg"
import envelope from "../../../../public/svg-images/envelope.svg"
import { Services } from "./Services"

const fetchUser = async (navigate) => {
    try {
        const response = await get_user();
        const data = JSON.parse(response);
        if (data === 401) {
            return 401
        }
        return data;
    } catch (error) {
        alert(error)
    }
};

// If user is not authenticated show profile differently

const Profile = (props) => {
    const navigate = useNavigate()
    const user = createAsync(() => fetchUser(navigate))
    const profile_image = createAsync(get_user_profile_image)

    const processFile = (file) => {
        const worker = new Worker(new URL('./fileWorker.js', import.meta.url));

        worker.onmessage = async (e) => {
            const buffer = e.data;
            try {
                const response = await handle_profile_image(buffer)
                if (response.status === 200) {
                    const uint8Array = new Uint8Array(response.image);
                    const blob = new Blob([uint8Array], { type: "image/webp" });
                    const urlCreator = window.URL || window.webkitURL;
                    const imageUrl = urlCreator.createObjectURL(blob);
                    document.getElementById("prof_pic").src = imageUrl
                }
            } catch (error) {
                alert(error)
            }
        };
        worker.postMessage(file);
    }

    const HandleFileupload = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    description: 'Images',
                    accept: {
                        'image/*': ['.png', '.webp', '.avif', '.jpeg', '.jpg']
                    }
                }]
            });

            const file = await fileHandle.getFile();
            processFile(file)
        } catch (error) {
            alert(error)
        }
    }

    return <>
        <Header />
        <div class="w-[90%] mx-auto">
            <div class="flex mt-14">
                <div class="flex gap-y-3 flex-col">
                    <div class="border-2 py-2 flex flex-col items-center flex-[2]">
                        <button onClick={HandleFileupload} class="hover:opacity-[0.7] duration-150 relative">
                            <img id="prof_pic" class="w-[200px] rounded-[50%] h-[200px]" src={profile_image() || defaultProfileSVG}></img>
                            <img src={CameraSVG} class="transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]"></img>
                            <span class="bg-[#00FF00] absolute w-[16px] h-[16px] rounded-[50%] bottom-4 right-7"></span>
                        </button>
                        <Show when={user()}>
                            <h1 class="text-xl font-[boldest-font] text-gray-900">{user().firstname + " " + user().lastname}</h1>
                        </Show>
                        <div class="flex px-4 flex-col justify-start mt-2 gap-y-2">
                            {user()?.location ? <div class="flex pb-1 border-b items-center gap-x-1">
                                <img src={location}></img>
                                <p class="text-gr text-xs font-[thin-font] font-bold">{user().location}</p>
                            </div> : <div class="flex pb-1 border-b items-center gap-x-1">
                                <A href="/profile/complete" class="bg-dark-green px-2 w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ლოკაცია</A>
                            </div>}
                            {user()?.phone ? <div class="flex pb-1 border-b items-center gap-x-1">
                                <img src={telephone}></img>
                                <p class="text-gr text-xs font-[thin-font] font-bold">{user().phone}</p>
                            </div> : <div class="flex pb-1 border-b items-center gap-x-1">
                                <A href="/profile/complete" class="bg-dark-green px-2 w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ტელ. ნომერი</A>
                            </div>}
                            {user()?.email ? <div class="flex pb-1 border-b items-center gap-x-1">
                                <img src={envelope}></img>
                                <p class="text-gr text-xs font-[thin-font] font-bold">{user().email}</p>
                            </div> : <div class="flex pb-1 border-b items-center gap-x-1">
                                <A href="/profile/complete" class="bg-dark-green px-2 w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე მეილი</A>
                            </div>}
                            {
                                user()?.avgrating && <div class="flex">
                                    <Index each={new Array(3)}>
                                        {() => {
                                            return <div>
                                                <img src={fullStar}></img>
                                            </div>
                                        }}
                                    </Index>
                                    <Index each={new Array(5 - 3)}>
                                        {() => {
                                            return <div>
                                                <img src={emptyStar}></img>
                                            </div>
                                        }}
                                    </Index>
                                </div>
                            }
                        </div>
                    </div>
                    <div class="border-2 px-2 py-2">
                        <h2 class="text-lg font-[bolder-font] border-b">სამუშაო განრიგი</h2>

                        <div class="mb-4">
                            <div class="gap-x-2 flex items-center">
                                <h3 class="text-md font-bold font-[thin-font]">სტატუსი</h3>
                                <p class="text-green-600 flex text-sm font-[thin-font] font-bold items-center">
                                    <span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                    ხელმისაწვდომი
                                </p>
                            </div>
                            <ul class="mt-3 border-t">
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>ორშაბათი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>სამშაბათი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>ოთხშაბათი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>ხუთშაბათი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>პარასკევი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>შაბათი:</p>
                                    <p>19:00-22:00</p>
                                </li>
                                <li class="font-[thin-font] justify-between text-sm font-bold flex gap-x-2">
                                    <p>კვირა:</p>
                                    <p>19:00-22:00</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="flex flex-[8] flex-col border-r px-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-[bolder-font] text-lg">ჩემს შესახებ</h2>
                        <p class="text-xs text-right font-[thin-font] font-bold">შემოუერთდა 5 დღის წინ</p>
                    </div>
                    {
                        user()?.about ? <div>
                            <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">გამარჯობა ჩემი სახელია ჯონ დოე მე ვარ ხელოსანი მაცივრის სარეცხ მანქანისა და კარებების, გამარჯობა ჩემი სახელია ჯონ დოე მე ვარ ხელოსანი მაცივრის სარეცხ მანქანისა და კარებების. გამარჯობა ჩემი სახელია ჯონ დოე მე ვარ ხელოსანი მაცივრის სარეცხ მანქანისა და კარებების გამარჯობა ჩემი სახელია ჯონ დოე მე ვარ ხელოსანი მაცივრის სარეცხ მანქანისა და კარებების</p>
                        </div> : <A href="/modify" class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">
                            დაამატე აღწერა
                        </A>
                    }
                    <h2 class="text-lg font-[bolder-font] mt-5">სერვისები</h2>
                    {
                        user()?.services ? <Services></Services> : <A href="/profile/services" class="w-[150px] mt-2 bg-dark-green py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">
                            დაამატე სერვისები
                        </A>
                    }
                    <h2 class="text-lg font-[bolder-font] mt-5">შესრულებული სამუშაოები</h2>
                    <div class="mt-2">
                        ბლაბლაბლა
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </>
}

export default Profile