import { Index, Match, batch, createSignal, Show, Switch } from "solid-js"
import location from "../../../../public/svg-images/location.svg"
import telephone from "../../../../public/svg-images/telephone.svg"
import envelope from "../../../../public/svg-images/envelope.svg"
import defaultProfileSVG from "../../../../public/default_profile.png"
import CameraSVG from "../../../../public/svg-images/camera.svg"
import pen from "../../../../public/svg-images/pen.svg"
import cake from "../../../../public/svg-images/cake.svg"
import spinnerSVG from "../../../../public/svg-images/spinner.svg"
import { A, action} from "@solidjs/router"
import { handle_profile_image } from "../../api/prof_image"

/*

    Best approach would be 
    // client
    1. When user chooses the image we render that image ----------------- WE SHOULD VALIDATE TYPE OF FILE AS WELL ON *SERVER*
    2. Would be cool if I could compress the image so users wouldn't get confused
    3.
    // server
    3. Send file to server and make buffer out of it compress and save
*/

// maybe add the button and form back again and send it to mutler and actually then return base64string from server

export const ProfileLeft = ({ setModal, user }) => {
    const [imageLoading, setImageLoading] = createSignal(false);
    const [imageUrl, setImageUrl] = createSignal(user().profile_image || defaultProfileSVG);

    const handleFormSubmission = async (e) => {
        e.preventDefault()
        setImageLoading(true);
        try {
            const formData = new FormData(e.target)
            const url = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            if (url) {
                batch(() => {
                    setImageUrl(url)
                    setImageLoading(false);
                })}
        } catch (error) {
            alert(error.message || "Failed to process image");
            setImageLoading(false);
        }
    }
    return <div class="flex sticky top-[50px] gap-y-3 flex-col">
        <div class="border-2 py-2 flex flex-col px-2 items-center flex-[2]">
            <Switch>
                <Match when={user().status !== 401}>
                    <Switch>
                        <Match when={!imageLoading()}>
                            <div>
                                <form id="uploadForm" onSubmit={handleFormSubmission} enctype="multipart/form-data">
                                    <input type="file" name="profilePic" class="hidden" id="profilePic" accept="image/webp, image/png, image/gif, image/jpeg, image/avif, image/jpg" />
                                </form>

                                <label for="profilePic" class="hover:opacity-[0.7] cursor-pointer">
                                    <div class="relative">
                                        <img id="prof_pic" src={imageUrl()} alt="Profile" class="border-2 w-[130px] h-[130px] rounded-[50%] border-solid border-[#14a800] mb-4" />
                                        <img src={CameraSVG} alt="camera" class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]" />
                                        <span class="bottom-1 right-4 absolute w-5 h-5 bg-[#14a800] border-2 border-indigo-100 rounded-full"></span>
                                    </div>
                                </label></div>
                        </Match>
                        <Match when={imageLoading()}>
                            <div class="w-[190px] flex flex-col justify-center mb-4 items-center h-[180px] rounded-[50%] bg-[#E5E7EB]">
                                <img class="animate-spin" src={spinnerSVG} />
                                <p class="text-dark-green font-[thin-font] text-xs font-bold">იტვირთება...</p>
                            </div>
                        </Match>
                    </Switch>
                </Match>
                <Match when={user().status === 401}>
                    <div class="relative">
                        <img id="prof_pic" class="w-[130px] border-2 border-solid border-[#108a00] rounded-[50%] h-[130px]" src={user().profile_image || defaultProfileSVG}></img>
                        <span class='bottom-1 right-4 absolute w-5 h-5 bg-[#108a00] border-2 border-white rounded-full'></span>
                    </div>
                </Match>
            </Switch>
            <h1 class="text-xl font-[boldest-font] text-gray-900">{user().firstname + " " + user().lastname}</h1>

            <div class="flex flex-col w-full justify-start mt-2 gap-y-2">
                <div class="flex pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().location}>
                            <div class="flex justify-between w-full px-2 items-center">
                                <div class="flex items-center gap-x-2">
                                    <img src={location}></img>
                                    <p class="text-gr text-xs font-[thin-font] break-word font-bold">{user().location.display_name.substr(0, 20)}.</p>
                                </div>
                                <Show when={user().status === 200}>
                                    <button onClick={() => setModal("ლოკაცია")}>
                                        <img id="locationButton" src={pen} />
                                    </button>
                                </Show>
                            </div>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/setup/xelosani/step/location" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ლოკაცია</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={location}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex pb-1 px-2 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().phone}>
                            <img src={telephone}></img>
                            <p class="text-gr text-xs ml-1 font-[thin-font] font-bold">{user().phone}</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/setup/xelosani/step/contact" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ტელ. ნომერი</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={telephone}></img>
                            <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex px-2 pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().email}>
                            <img src={envelope}></img>
                            <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">{user().email}</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/setup/xelosani/step/contact" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე მეილი</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={envelope}></img>
                            <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex pb-1 border-b px-2 items-center gap-x-1">
                    <Switch>
                        <Match when={user().date}>
                            <div class="flex justify-between w-full items-center">
                                <div class="flex items-center gap-x-2">
                                    <img src={cake} />
                                    <p class="text-gr text-xs font-[thin-font] font-bold">{new Date(user().date).toLocaleDateString("en-US", {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}</p>
                                </div>
                                <Show when={user().status === 200}>
                                    <button onClick={() => setModal("ასაკი")}>
                                        <img src={pen} id="age" />
                                    </button>
                                </Show>
                            </div>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/setup/xelosani/step/age" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე დაბ. თარიღი</A>    
                        </Match>
                        <Match when={user().status === 401}>
                            <p class="text-gr text-xs text-center font-[thin-font] font-bold">ასაკი არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                {
                    user().avgrating && <div class="flex">
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
            <Switch>
                <Match when={user().schedule}>
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
                </Match>
                <Match when={user().status === 401}>
                    <div class="flex items-center justify-center pt-2 border-t">
                        <p class="font-[thin-font] text-gr text-sm font-bold">
                            განრიგი ცარიელია
                        </p>
                    </div>
                </Match>
                <Match when={user().status === 200}>
                    <div class="flex items-center justify-center pt-2 border-t">

                        <A href="/setup/xelosani/step/schedule" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე განრიგი</A>
                    </div>
                </Match>
            </Switch>
        </div>
        <div class="border-2 px-2 py-2">
            <h2 class="text-lg font-[bolder-font] border-b">საშუალო შეფასება</h2>

            <Switch>
                <Match when={false}>
                    <div class="block mt-2">
                        <div class="flex items-center mb-2">
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                                <div class="h-2 bg-dark-green-hover rounded-full" style="width: 70%"></div>
                            </div>
                            <span class="text-sm font-[thin-font] font-bold text-gr ">4%</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                                <div class="h-2 bg-dark-green-hover rounded-full" style="width: 9%"></div>
                            </div>
                            <span class="text-sm font-[thin-font] font-bold text-gr ">4%</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                                <div class="h-2 bg-dark-green-hover rounded-full" style="width: 4%"></div>
                            </div>
                            <span class="text-sm font-[thin-font] font-bold text-gr ">4%</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <img src={fullStar} width={15} height={15}></img>
                            <img src={fullStar} width={15} height={15}></img>
                            <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                                <div class="h-2 bg-dark-green-hover rounded-full" style="width: 2%"></div>
                            </div>
                            <span class="text-sm font-[thin-font] font-bold text-gr ">4%</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <img src={fullStar} width={15} height={15}></img>
                            <div class="w-full h-2 mx-4 bg-gray-200 rounded-full">
                                <div class="h-2 bg-dark-green-hover rounded-full" style="width: 1%"></div>
                            </div>
                            <span class="text-sm font-[thin-font] font-bold text-gr ">4%</span>
                        </div>
                    </div>
                </Match>
                <Match when={true}>
                    <p class="text-xs text-gr mt-2 text-center font-[thin-font] font-bold">მომხმარებელი არ არის შეფასებული.</p>
                </Match>
            </Switch>
        </div>
    </div>
}