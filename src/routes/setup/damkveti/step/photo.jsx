import { createAsync } from "@solidjs/router";
import defaultProfileSVG from "../../../../../public/default_profile.png"
import CameraSVG from "../../../../../public/svg-images/camera.svg"
import { get_user_profile_image } from "../../../api/user";
import { processFile } from "../../../xelosani/[id]/ProfileLeft";
import { Suspense } from "solid-js";
  
const ProfilePictureStep = () => {
 const profile_image = createAsync(() => get_user_profile_image(null))

 return (
     <div class="flex flex-col items-center mb-4">
       <label for="profilePic" class="relative hover:opacity-[0.7] cursor-pointer">
         <Suspense fallback={<div class="w-[200px] h-[200px] rounded-full mb-4 animate-pulse bg-gray-300"></div>}>
         <img id="setup_image" src={profile_image() || defaultProfileSVG} alt="Profile" class="w-[200px] h-[200px] rounded-full mb-4" />
         </Suspense>
         <img src={CameraSVG} alt="camera" class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]" />
       </label>
       <input type="file" onChange={(e) => processFile(e.target.files[0], "setup_image")} class="hidden" accept="image/webp, image/png, image/gif, image/jpeg, image/avif, image/jpg" id="profilePic" />
       <label for="profilePic" class="cursor-pointer font-[thin-font] font-bold bg-[#108a00] duration-300 hover:bg-[#14a800] text-white py-2 px-3 rounded-md">
         ატვირთე ფოტო
       </label>
     </div>
 );
};

export default ProfilePictureStep;