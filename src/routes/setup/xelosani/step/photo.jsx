import { A, createAsync, useNavigate } from "@solidjs/router";
import defaultProfileSVG from "../../../../default_profile.png";
import CameraSVG from "../../../../svg-images/camera.svg";
import spinnerSVG from "../../../../svg-images/spinner.svg";
import { Match, Suspense, Switch, batch, createSignal, onMount } from "solid-js";
import { makeAbortable } from "@solid-primitives/resource";
import { Buffer } from 'buffer';
import { get_profile_photo } from "~/routes/api/xelosani/setup/step";

const ProfilePictureStep = () => {
  const userImage = createAsync(get_profile_photo)
  const [imageLoading, setImageLoading] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [file, setFile] = createSignal();
  const [imageUrl, setImageUrl] = createSignal(defaultProfileSVG);
  const [signal, abort, filterErrors] = makeAbortable({
    timeout: 0,
    noAutoAbort: true,
  });
  const navigate = useNavigate();

  const handleProfileImageChange = async () => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append("profile_image", file());

    try {
      const response = await fetch(
        `http://localhost:5555/profile_picture/${userImage().profId}`,
        {
          method: "POST",
          body: formData,
          signal: signal(),
          credentials: "include"
        }
      );

      if (!response.ok) {
        return alert("პროფილის ფოტო ვერ განახლდა, სცადეთ თავიდან.");
      }

      const data = await response.json();

      if (data.stepPercent === 100) {
        return navigate(`/xelosani/${data.profId}`);
      }

      batch(() => {
        setFile(null);
        setSubmitted(true);
      });
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleFilePreview = async (file) => {
    setImageLoading(true);
    try {
      const worker = new Worker(
        new URL("../../../../Components/readImagesWorker.js", import.meta.url)
      );

      worker.onmessage = async (e) => {
        const buffer = e.data;
        const base64string = Buffer.from(buffer, "utf-8").toString("base64");
        batch(() => {
          setFile(file);
          setImageLoading(false);
          setImageUrl(`data:image/png;base64,${base64string}`);
        });
      };
      worker.postMessage(file);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Switch>
      <Match when={!userImage()?.url && !submitted()}>
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
                      class="object-cover w-[140px] border-2 h-[140px] rounded-full mb-4"
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
                accept="image/webp, image/png, image/jpeg, image/avif, image/jpg"
                id="profilePic"
              />
            </Match>
            <Match when={imageLoading()}>
              <div class="w-[140px] flex flex-col justify-center mb-4 items-center h-[140px] rounded-[50%] bg-[#E5E7EB]">
                <img
                  class="animate-spin"
                  src={spinnerSVG}
                  width={40}
                  height={40}
                />
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
              onClick={() => abort()}
              class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 px-4  rounded-[16px] text-sm font-bold transition-all duration-300"
            >
              გაუქმება
            </button>
          </Show>
        </div>
      </Match>
      <Match
        when={
          userImage() && userImage().url ||
          submitted()
        }
      >
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
