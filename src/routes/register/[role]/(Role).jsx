import { EmailPassword } from "~/Components/EmailPassword";
import stepBack from "../../../svg-images/svgexport-25.svg";
import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { RegisterUser } from "../../api/authentication";

const Role = (props) => {
  const [error, setError] = createSignal(null);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const phoneRegex = /^\d{9}$/;
  const role = props.location.pathname.split("/")[2] === "xelosani" ? "ხელოსანი" : "დამკვეთი"

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError(null);
      const formData = new FormData(event.target);
      if (!formData.get("firstname").length) {
        return setError([
          {
            field: "firstname",
            message: "სახელი სავალდებულოა.",
          },
        ]);
      }
      if (!formData.get("lastname").length) {
        return setError([
          {
            field: "lastname",
            message: "გვარი სავალდებულოა.",
          },
        ]);
      }
      if (
        !emailRegex.test(formData.get("phoneEmail")) &&
        !phoneRegex.test(formData.get("phoneEmail"))
      ) {
        return setError([
          {
            field: "phoneEmail",
            message: "მეილი ან ტელეფონის ნომერი არასწორია.",
          },
        ]);
      }
      if (!formData.get("password").length) {
        return setError([
          {
            field: "password",
            message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.",
          },
        ]);
      }
      if (!formData.get("rules-confirmation")) {
        return setError([{
            field: "rules",
            message: "გთხოვთ დაეთანხმოთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას."
        }])
      }
      const result = await RegisterUser(formData, props.location.pathname.split("/")[2]);
      if (result.status === 400) {
        return setError(result.errors);
      }
      if (result.message === "success") {
        navigate(`/${result.role}/${result.profId}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div class="flex-[10] border p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-5 justify-center items-center">
      <div class="flex gap-x-5">
        <A href="/register">
        <img
          src={stepBack}
          class="cursor-pointer"
        ></img>
        </A>
        <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">
          გაიარე რეგისტრაცია როგორც <span class="text-gr">{role}</span>
        </h1>
      </div>
      <form method="post" onSubmit={handleSubmit} class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              სახელი
            </label>
            <input
              class={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                error()?.some((a) => a.field === "firstname")
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="grid-first-name"
              name="firstname"
              type="text"
              placeholder="ლუკა"
            />
            <Show when={error()?.some((a) => a.field === "firstname")}>
              <p class="text-xs text-red-500 mt-1 font-[thin-font] font-bold">
                {error().find((a) => a.field === "firstname").message}
              </p>
            </Show>
          </div>
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              გვარი
            </label>
            <input
              class={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                error()?.some((a) => a.field === "lastname")
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="grid-last-name"
              type="text"
              name="lastname"
              placeholder="ჩიკვაიძე"
            />
            <Show when={error()?.some((a) => a.field === "lastname")}>
              <p class="text-xs text-red-500 mt-1 font-[thin-font] font-bold">
                {error().find((a) => a.field === "lastname").message}
              </p>
            </Show>
          </div>
        </div>
        <EmailPassword error={error}></EmailPassword>
        <div class="flex gap-y-2 flex-col mt-4">
          <div class="flex items-center gap-x-2 justify-center">
            <input
              type="checkbox"
              name="rules-confirmation"
              class="accent-dark-green-hover"
              id="must"
            ></input>
            <label
              for="must"
              name="rules-confirmation"
              class="font-[thin-font] text-gr text-xs font-bold"
            >
              წავიკითხე და ვეთანხმები{" "}
              <A href="/rules" class="underline" target="_blank">
                სერვისის წესებსა
              </A>{" "}
              და{" "}
              <A href="/conf" class="underline" target="_blank">
                კონფიდენციალურობის პოლიტიკას
              </A>
            </label>
          </div>
          <button
            type="submit"
            class="font-[thin-font] text-center text-lg font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]"
          >
            რეგისტრაცია როგორც {role}
          </button>
        </div>
        <Show when={error()?.some((a) => a.field === "rules")}>
          <p class="text-xs text-red-500 mt-2 font-[thin-font] font-bold">
            {error().find((a) => a.field === "rules").message}
          </p>
        </Show>
      </form>
    </div>
  );
};

export default Role