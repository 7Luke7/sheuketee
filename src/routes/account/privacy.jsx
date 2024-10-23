import { createAsync } from "@solidjs/router";
import { createSignal, Suspense } from "solid-js";
import { Toast } from "~/Components/ToastComponent";
import { get_privacy } from "../api/privacy";

const Privacy = () => {
  const privacy = createAsync(get_privacy);
  const [toast, setToast] = createSignal();
  const [isExiting, setIsExiting] = createSignal(false);

  const handlePrivacyChange = async (e) => {
    try {
      const response = await fetch("/api/privacy", {
        method: "POST",
        body: JSON.stringify(e.target.value),
      });
      if (!response.ok) {
        throw new Error("დაფიქსირდა შეცდომა!");
      }
      const data = await response.json();

      setToast({
        type: true,
        message: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(privacy())
  return (
    <div class="px-10 flex flex-col gap-y-4">
      <Suspense fallback={<p>Loading...</p>}>
        <div class="flex gap-x-5">
          <div class="flex flex-col gap-y-2">
            <p class="font-[thin-font] font-bold">ელექტრონული ფოსტა</p>
            <select
              onChange={handlePrivacyChange}
              class="w-[220px] border font-[normal-font] text-base border-green-500 rounded-lg bg-white text-green-800 p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out shadow-lg hover:bg-green-50"
            >
              <option selected={privacy()?.email === "გამოჩენა"} value="email-გამოჩენა">გამოჩენა</option>
              <option selected={privacy()?.email === "ნახევრად დამალვა"} value="email-ნახევრად დამალვა">ნახევრად დამალვა</option>
              <option selected={privacy()?.email === "დამალვა"} value="email-დამალვა">დამალვა</option>
            </select>
          </div>
          <div class="flex flex-col gap-y-2">
            <p class="font-[thin-font] font-bold">ტელეფონის ნომერი</p>
            <select
              onChange={handlePrivacyChange}
              class="w-[220px] border font-[normal-font] text-base border-green-500 rounded-lg bg-white text-green-800 p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out shadow-lg hover:bg-green-50"
            >
              <option selected={privacy()?.phone === "გამოჩენა"} value="phone-გამოჩენა">გამოჩენა</option>
              <option selected={privacy()?.phone === "ნახევრად დამალვა"} value="phone-ნახევრად დამალვა">ნახევრად დამალვა</option>
              <option selected={privacy()?.phone === "დამალვა"} value="phone-დამალვა">დამალვა</option>
            </select>
          </div>
        </div>
        <div class="gap-x-5 flex">
          <div class="flex flex-col gap-y-2">
            <p class="font-[thin-font] font-bold">დაბადების თარიღი</p>
            <select
              onChange={handlePrivacyChange}
              class="w-[220px] border font-[normal-font] text-base border-green-500 rounded-lg bg-white text-green-800 p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out shadow-lg hover:bg-green-50"
            >
              <option selected={privacy()?.birthDate === "გამოჩენა"} value="birthDate-გამოჩენა">გამოჩენა</option>
              <option selected={privacy()?.birthDate === "დამალვა"} value="birthDate-დამალვა">დამალვა</option>
            </select>
          </div>
        </div>
      </Suspense>
      <Show when={toast()}>
        <Toast
          toast={toast}
          setToast={setToast}
          isExiting={isExiting}
          setIsExiting={setIsExiting}
        ></Toast>
      </Show>
    </div>
  );
};

export default Privacy;
