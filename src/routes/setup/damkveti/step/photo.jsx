import { A, createAsync, useNavigate } from "@solidjs/router";
import defaultProfileSVG from "../../../../../public/default_profile.png";
import CameraSVG from "../../../../../public/svg-images/camera.svg";
import spinnerSVG from "../../../../../public/svg-images/spinner.svg";
import { Match, Suspense, Switch, batch, createSignal } from "solid-js";
import { preview_image } from "~/routes/api/user";
import { profile_image_no_id } from "~/routes/api/damkveti/setup";
import { upload_profile_picture_setup } from "~/routes/api/damkveti/step";

const ProfilePictureStep = () => {
  const profile_image = createAsync(profile_image_no_id);
  const [error, setError] = createSignal();
  const [imageLoading, setImageLoading] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [file, setFile] = createSignal();
  const [imageUrl, setImageUrl] = createSignal(!profile_image()?.url ? defaultProfileSVG : profile_image()?.url);

  console.log(profile_image()?.profId)
  const navigate = useNavigate()

  const handleProfileImageChange = async () => {
    setImageLoading(true);
    try {
      const response = await upload_profile_picture_setup(
        file(),
        profile_image().profId
      );
      if (response.status === 400) {
        return setMessage(response.message)
      }
      if (response.stepPercent > 100) {
        return navigate(`/damkveti/${response.profId}`) //ჩანიშვნა
      }
      if (response.imageResponse) {
        batch(() => {
          setFile(null);
          setImageLoading(false);
          setSubmitted(true)
        });
      }
    } catch (error) {
      alert(error.message || "Failed to process image");
      setImageLoading(false);
    }
  };

  const handleFilePreview = async (file) => {
    setImageLoading(true)
    try {
      const response = await preview_image(file, profile_image().profId)
      if (response) {
        batch(() => {
          setFile(file)
          setImageLoading(false)
          setImageUrl(response)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Switch>
      <Match when={!profile_image()?.url && !submitted()}>
        <div class="flex p-10 flex-col items-center mb-4">
          <Switch>
            <Match when={!imageLoading()}>
              <label
                for="profilePic"
                class="hover:opacity-[0.7] cursor-pointer"
              >
                <div class="relative">
                  <Suspense
                    fallback={
                      <div class="w-[200px] h-[200px] rounded-full mb-4 bg-[#E5E7EB]"></div>
                    }
                  >
                    <img
                      id="setup_image"
                      src={imageUrl()}
                      alt="Profile"
                      class={`object-cover ${
                        error() && "border-red-500"
                      } w-[140px] border-2 h-[140px] rounded-full mb-4`}
                    />
                  </Suspense>
                  <img
                    src={CameraSVG}
                    alt="camera"
                    class="absolute transform opacity-50 -translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%]"
                  />
                </div>
              </label>
              <input
                type="file"
                onChange={(e) => handleFilePreview(e.target.files[0])}
                class="hidden"
                accept="image/webp, image/png, image/gif, image/jpeg, image/avif, image/jpg"
                id="profilePic"
              />
            </Match>
            <Match when={imageLoading()}>
              <div class="w-[140px] flex flex-col justify-center mb-4 items-center h-[140px] rounded-[50%] bg-[#E5E7EB]">
                <img class="animate-spin" src={spinnerSVG} width={40} height={40} />
                <p class="text-dark-green font-[thin-font] text-xs font-bold">
                  იტვირთება...
                </p>
              </div>
            </Match>
          </Switch>
          <Show when={file() && !imageLoading()}>
            <button
                onClick={handleProfileImageChange}
                class="mb-2 bg-dark-green hover:bg-dark-green-hover text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
              >
               პროფილზე დაყენება
              </button>
            </Show>
            <Show when={imageLoading()}>
            <button
                onClick={handleProfileImageChange}
                class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
              >
                გაუქმება 
              </button>
            </Show>
        </div>
      </Match>
      <Match when={profile_image()?.url !== "NotFound" && profile_image()?.url || submitted()}>
        <div class="p-10 flex flex-col items-center">
          <p class="text-sm font-[normal-font] font-bold text-gray-700">
            პროფილის ფოტო უკვე დამატებულია გთხოვთ განაგრძოთ.
          </p>
          <A
            className="py-2 mt-3 text-center w-1/2 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
            href="/setup/xelosani/step/contact"
          >
            გაგრძელება
          </A>
        </div>
      </Match>
    </Switch>
  );
};

export default ProfilePictureStep;