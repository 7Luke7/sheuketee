import { Index, Match, batch, createSignal, Show, Switch } from "solid-js"
import location from "../../../../public/svg-images/location.svg"
import telephone from "../../../../public/svg-images/telephone.svg"
import envelope from "../../../../public/svg-images/envelope.svg"
import defaultProfileSVG from "../../../../public/default_profile.png"
import CameraSVG from "../../../../public/svg-images/camera.svg"
import spinnerSVG from "../../../../public/svg-images/spinner.svg"
import { A } from "@solidjs/router"
import { handle_profile_image } from "../../api/prof_image"
import { Buffer } from 'buffer';

export const processFile = async (file) => {
    const worker = new Worker(new URL('./fileWorker.js', import.meta.url));

    return new Promise((resolve, reject) => {
        worker.onmessage = async (e) => {
            const buffer = e.data;
            try {
                const response = await handle_profile_image(buffer);
                if (response === 200) {
                    const base64string = Buffer.from(buffer, "utf-8").toString('base64')
                    resolve(base64string);
                } else {
                    reject(new Error("ფოტოს ატვირთვა/პროცესირება ვერ მოხერხდა ცადეთ თავიდან."));
                }
            } catch (error) {
                reject(error);
            }
        };

        worker.postMessage(file);
    });
};

export const ProfileLeft = ({ user }) => {
    const [imageLoading, setImageLoading] = createSignal(false);
    const [imageUrl, setImageUrl] = createSignal(user().profile_image || defaultProfileSVG);

    const handleInputChange = async (file) => {
        setImageLoading(true);
        try {
            const url = await processFile(file);
            if (url) {
                batch(() => {
                    setImageUrl(`data:image/png;base64,${url}`)
                    setImageLoading(false);
                })}
        } catch (error) {
            alert(error.message || "Failed to process image");
            setImageLoading(false);
        }
    };
    return <div class="flex sticky top-[50px] gap-y-3 flex-col">
        <div class="border-2 py-2 flex flex-col px-2 items-center flex-[2]">
            <Switch>
                <Match when={user().status !== 401}>
                    <Switch>
                        <Match when={!imageLoading()}>
                            <label for="profilePic" class="hover:opacity-[0.7] cursor-pointer">
                                <div class="relative">
                                    <img id="prof_pic" src={imageUrl()} alt="Profile" class="border-2 w-[190px] h-[180px] rounded-[50%] border-solid border-[#14a800] mb-4" />

                                    <img src={CameraSVG} alt="camera" class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]" />
                                    <span class='bottom-2 right-6 absolute w-5 h-5 bg-[#14a800] border-2 border-indigo-100 rounded-full'></span></div>
                            </label>
                            <input onChange={(e) => handleInputChange(e.target.files[0])} type="file" class="hidden" accept="image/webp, image/png, image/gif, image/jpeg, image/avif, image/jpg" id="profilePic" />
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
                        <img id="prof_pic" class="w-[190px] border-2 border-solid border-[#108a00] rounded-[50%] h-[180px]" src={user().profile_image || defaultProfileSVG}></img>
                        <span class='bottom-2 right-6 absolute w-5 h-5 bg-[#108a00] border-2 border-white rounded-full'></span>
                    </div>
                </Match>
            </Switch>
            <h1 class="text-xl font-[boldest-font] text-gray-900">{user().firstname + " " + user().lastname}</h1>

            <div class="flex flex-col w-full justify-start mt-2 gap-y-2">
                <div class="flex pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().location}>
                            <img src={location}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">{user().location}</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/profile/complete" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ლოკაცია</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={location}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().phone}>
                            <img src={telephone}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">{user().phone}</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/profile/complete" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ტელ. ნომერი</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={telephone}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().email}>
                            <img src={envelope}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">{user().email}</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/profile/complete" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე მეილი</A>
                        </Match>
                        <Match when={user().status === 401}>
                            <img src={envelope}></img>
                            <p class="text-gr text-xs font-[thin-font] font-bold">არ არის დამატებული</p>
                        </Match>
                    </Switch>
                </div>
                <div class="flex pb-1 border-b items-center gap-x-1">
                    <Switch>
                        <Match when={user().age}>
                            <p class="text-gr text-xs font-[thin-font] font-bold">ასაკი {user().age} წლის</p>
                        </Match>
                        <Match when={user().status === 200}>
                            <A href="/profile/complete" class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე ასაკი</A>
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

                        <A href="/profile/complete" class="bg-dark-green px-2 w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]">დაამატე განრიგი</A>
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