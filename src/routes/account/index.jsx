import { createAsync } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { get_account, modify_user } from "~/routes/api/user";
import exclamationSVG from "../../svg-images/exclamation.svg";

const Account = () => {
  const user = createAsync(get_account);
  const [editing, setEditing] = createSignal(false);
  const [error, setError] = createSignal();
  

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{9}$/;

  const editUser = async (event) => {
    event.preventDefault();
    try {
      if (editing()) {
        const formData = new FormData(event.target);
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const email = formData.get("email");
        const phone = formData.get("mobile");

        if (!firstname.length) {
          return setError([
            {
              field: "სახელი",
              message: "სახელი უნდა შეიცავდეს მინიმუმ 1 ასოს.",
            },
          ]);
        }

        if (!lastname.length) {
          return setError([
            {
              field: "გვარი",
              message: "გვარი უნდა შეიცავდეს მინიმუმ 1 ასოს.",
            },
          ]);
        }

        if (!user().email && (email && !emailRegex.test(email) || !email || email.length === 0)) {
          return setError([
            {
              field: "მეილი",
              message: "მეილი არასწორია.",
            },
          ]);
        }

        if (!user().phone && (phone && !phoneRegex.test(phone) || !phone || phone.length === 0)) {
          return setError([
            {
              field: "მობილური",
              message: "მობილურის ნომერი არასწორია.",
            },
          ]);
        }

        const response = await modify_user(firstname, lastname, !user().email && email, !user().phone && phone);

        if (response.status === 400) {
          return setError(response.errors);
        }
        if (response.status === 200) {
          setError([])
          return setEditing(false);
        }
      } else {
        setEditing(true);
        document.getElementById("firstname").focus()
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="flex px-10 items-start gap-x-2">
      <form onSubmit={editUser} class="flex-[6] mr-12">
        <div class="flex mb-3 gap-x-2 items-center">
          <img class="rounded-[50%] bg-gray-100" src={exclamationSVG}></img>
          <h1 class="font-[thin-font] text-gr break-all text-xs font-bold">
            გაითვალისწინეთ უკვე რეგისტრირებული მეილის ან ტელეფონის ნომრის შეცვლა
            შეუძლებელია გასაჩივრების გარეშე!
          </h1>
        </div>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <div class="flex flex-col">
            <label for="firstname" class="font-[thin-font] text-xl font-bold">
              სახელი
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              disabled={editing() ? false : true}
              value={user() && user()?.firstname}
              class={`px-2 mt-1 py-1 ${
                editing() && "ring-1 ring-dark-green"
              } outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}
            ></input>
            <Show when={error()?.some((a) => a.field === "სახელი")}>
              <p class="text-xs mt-1 text-red-500 font-[thin-font] font-bold">
                {error().find((a) => a.field === "სახელი").message}
              </p>
            </Show>
          </div>
          <div class="flex flex-col">
            <label for="lastname" class="font-[thin-font] text-xl font-bold">
              გვარი
            </label>
            <input
              type="text"
              id="lastname"
              disabled={editing() ? false : true}
              value={user() &&  user()?.lastname}
              name="lastname"
              class={`px-2 mt-1 py-1 ${
                editing() && "ring-1 ring-dark-green"
              } outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}
            ></input>
            <Show when={error()?.some((a) => a.field === "გვარი")}>
              <p class="text-xs mt-1 text-red-500 font-[thin-font] font-bold">
                {error().find((a) => a.field === "გვარი").message}
              </p>
            </Show>
          </div>
          <div class="flex flex-col">
            <label for="email" class="font-[thin-font] text-xl font-bold">
              მეილი
            </label>
            {user() && user()?.email ? (
              <p class="pt-1 font-[normal-font] text-base text-gray-[700]">
                {user() && user()?.email}
              </p>
            ) : (
              <input
                type="text"
                name="email"
                id="email"
                placeholder="ცარიელი"
                disabled={editing() ? false : true}
                class={`px-2 mt-1 mb-1 py-1 ${
                  editing() && "ring-1 ring-dark-green"
                } outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}
              ></input>
            )}
            <Show when={error()?.some((a) => a.field === "მეილი")}>
              <p class="text-xs mt-1 text-red-500 font-[thin-font] font-bold">
                {error().find((a) => a.field === "მეილი").message}
              </p>
            </Show>
          </div>
          <div class="flex flex-col">
            <label for="mobile" class="font-[thin-font] text-xl font-bold">
              მობილური ნომერი
            </label>
            {user() && user()?.phone ? (
              <p class="pt-1 font-[normal-font] text-base text-gray-[700]">
                {user() && user()?.phone}
              </p>
            ) : (
              <input
                type="text"
                name="mobile"
                placeholder="ცარიელი"
                id="mobile"
                disabled={editing() ? false : true}
                class={`px-2 mt-1 mb-1 py-1 ${
                  editing() && "ring-1 ring-dark-green"
                } outline-0 font-[normal-font] bg-gray-[500] text-base text-gray-[700]`}
              ></input>
            )}
            <Show when={error()?.some((a) => a.field === "მობილური")}>
              <p class="text-xs mt-1 text-red-500 font-[thin-font] font-bold">
                {error().find((a) => a.field === "მობილური").message}
              </p>
            </Show>
          </div>
        </div>
        <Show when={error()?.some((a) => a.field === "phoneEmailRegister")}>
          <p class="text-xs mb-1 text-red-500 mt-1 font-[thin-font] font-bold">
            {error().find((a) => a.field === "phoneEmailRegister").message}
          </p>
        </Show>
        <button
          type="submit"
          class={`text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold ${
            editing()
              ? "bg-dark-green hover:bg-dark-green-hover"
              : "bg-gray-900 hover:bg-gray-800"
          } duration-200 ease-in`}
        >
          {editing() ? "დადასტურება" : "შესწორება"}
        </button>
      </form>
    </div>
  );
};

export default Account;
