import {
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import eyeFillSVG from "../../../../../svg-images/eye-fill.svg";
import eyeSlashSVG from "../../../../../svg-images/eye-slash.svg";
import { Toast } from "~/Components/ToastComponent";
import { CustomError } from "~/Components/errors/ExtendedErrorFrontend";

const ResetPassword = (props) => {
  const [showPasswordForm, setShowPasswordForm] = createSignal(false);
  const [displayNewPassword, setDisplayNewPassword] = createSignal(false);
  const [displayRepeatPassword, setDisplayRepeatPassword] = createSignal(false);
  const [timer, setTimer] = createSignal();
  const [toast, setToast] = createSignal();
  const [otp1, setOtp1] = createSignal("");
  const [otp2, setOtp2] = createSignal("");
  const [otp3, setOtp3] = createSignal("");
  const [otp4, setOtp4] = createSignal("");
  const [otp5, setOtp5] = createSignal("");
  const [otp6, setOtp6] = createSignal("");
  const [isExiting, setIsExiting] = createSignal(false);

  let input1, input2, input3, input4, input5, input6, submitButton;
  let inputs;

  onMount(async () => {
    try {
      const response = await fetch(`/api/utils/verification/validate_id`, {
        method: "POST",
        body: JSON.stringify({
          randomId: props.params.id,
          profId: props.params.profId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.status);
      }

      inputs = [input1, input2, input3, input4, input5, input6];
      inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e) => handleKeyDown(e, index));
        input.addEventListener("paste", handlePaste);
      });
    } catch (error) {
      console.log(error);
      if (error.message === "400") {
        alert(400)
      } else {
        return 500;
      }
    }
  });

  const handleKeyDown = (e, index) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if ((e.key === "Delete" || e.key === "Backspace") && index > 0) {
      if (inputs[index].value === "") {
        inputs[index - 1].focus();
        inputs[index - 1].value = "";
      } else {
        inputs[index].value = "";
      }
    }
  };

  const handleInput = (e, setSignal, index) => {
    setSignal(e.target.value);
    if (e.target.value && index < (inputs && inputs.length - 1)) {
      inputs[index + 1].focus();
    } else if (index === (inputs && inputs.length - 1)) {
      submitButton.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!/^[0-9]{6}$/.test(text)) return;
    const digits = text.split("");
    setOtp1(digits[0]);
    setOtp2(digits[1]);
    setOtp3(digits[2]);
    setOtp4(digits[3]);
    setOtp5(digits[4]);
    setOtp6(digits[5]);
    submitButton.focus();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/utils/verification/verify_code", {
        method: "POST",
        body: JSON.stringify({
          randomId: props.params.id,
          role: props.params.role,
          profId: props.params.profId,
          code: otp1() + otp2() + otp3() + otp4() + otp5() + otp6(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new CustomError(
          response.status,
          "კოდი არ არსებობს, გთხოვთ ხელახლა გაიგზავნოთ."
        ).ExntendToErrorName();
      }

      setShowPasswordForm(true);
    } catch (error) {
      console.log(error, error.message, error.name);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const new_password = JSON.stringify(formData.get("new_password"));
      const repeat_password = formData.get("repeat_password");

      if (JSON.parse(new_password).length < 8 || repeat_password.length < 8) {
        return setToast({
          type: false,
          message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს!",
        });
      }
      if (JSON.parse(new_password) !== repeat_password) {
        return setToast({
          type: false,
          message: "პაროლები არ ემთხვევა.",
        });
      }
      formData.append("role", JSON.stringify(props.params.role));
      formData.append("profId", JSON.stringify(props.params.profId));
      const response = await fetch("/api/password/reset", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("problema")
      }

      setToast({
        type: true,
        message: "პაროლი წარმატებით განახლდა.",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const resendCode = async () => {
    try {
      const response = await fetch(
        `/api/utils/verification/resend_verification_code`,
        {
          method: "POST",
          body: JSON.stringify({
            role: props.params.role,
            profId: props.params.profId,
            randomId: props.params.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(500);
      }

      setToast({
        type: true,
        message: "კოდი გამოგზავნილია.",
      });
      clearInterval(intervalId);
      localStorage.setItem("otpExpirationTime", Date.now() + 3 * 60 * 1000);
      setTimer(180);
    } catch (error) {
      console.log(error);
    }
  };

  let intervalId;
  createEffect(() => {
    const savedExpirationTime = localStorage.getItem("otpExpirationTime");

    if (savedExpirationTime) {
      const timeRemaining = savedExpirationTime - Date.now();

      if (timeRemaining > 0) {
        setTimer(Math.floor(timeRemaining / 1000));
      } else {
        setTimer("დრო ამოიწურა, გააგზავნეთ კოდი ხელახლა.");
        localStorage.removeItem("otpExpirationTime");
      }
    }

    if (typeof timer() === "number" && timer() > 0) {
      intervalId = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(intervalId);
            localStorage.removeItem("otpExpirationTime");
            return setTimer("დრო ამოიწურა, გააგზავნეთ კოდი ხელახლა.");
          }
          return t - 1;
        });
      }, 1000);
    }

    onCleanup(() => clearInterval(intervalId));
  });

  const phoneVerification = async () => {
    try {
      const response = await fetch(
        `/api/utils/verification/send_verification_code_phone`,
        {
          method: "POST",
          body: JSON.stringify({
            role: props.params.role,
            profId: props.params.profId,
            randomId: props.params.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(500);
      }

      setToast({
        type: true,
        message: "კოდი გამოგზავნილია.",
      });
      clearInterval(intervalId);
      localStorage.setItem("otpExpirationTime", Date.now() + 3 * 60 * 1000);
      setTimer(180);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Switch>
        <Match when={!showPasswordForm()}>
          <div class="flex h-full items-center justify-center flex-col w-full">
            <div class="text-center relative w-[500px] bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
              <header class="mb-8">
                <h1 class="text-2xl font-bold mb-1">მეილის ვერიფიკაცია</h1>
                <p class="text-[15px] w-[80%] font-[normal-font] font-bold text-base mx-auto text-slate-500">
                  შეიყვანეთ 6 ციფრა კოდი რომელიც თქვენს მეილზე გამოიგზავნა.
                </p>
              </header>
              <form
                onSubmit={handleFormSubmit}
                id="otp-form"
                class="flex items-center justify-center flex-col mx-auto w-[400px]"
              >
                <div class="flex flex-col items-start gap-3">
                  <div class="flex gap-x-3">
                    <input
                      ref={input1}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp1()}
                      onInput={(e) => handleInput(e, setOtp1, 0)}
                    />
                    <input
                      ref={input2}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp2()}
                      onInput={(e) => handleInput(e, setOtp2, 1)}
                    />
                    <input
                      ref={input3}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp3()}
                      onInput={(e) => handleInput(e, setOtp3, 2)}
                    />
                    <input
                      ref={input4}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp4()}
                      onInput={(e) => handleInput(e, setOtp4, 3)}
                    />
                    <input
                      ref={input5}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp5()}
                      onInput={(e) => handleInput(e, setOtp5, 4)}
                    />
                    <input
                      ref={input6}
                      type="text"
                      class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      maxlength="1"
                      value={otp6()}
                      onInput={(e) => handleInput(e, setOtp6, 5)}
                    />
                  </div>
                  <p class="font-[thin-font] text-slate-500 text-sm font-bold">
                    {typeof timer() === "number" ? (
                      `კოდის ფუნქციონირების დრო: ${timer()}`
                    ) : (
                      <span class="text-red-500">{timer()}</span>
                    )}
                  </p>
                </div>
                <button
                  ref={submitButton}
                  type="submit"
                  class="w-full inline-flex font-[bolder-font] justify-center whitespace-nowrap rounded-lg bg-green-500 px-3.5 py-2.5 text-base font-bold text-white shadow-sm shadow-green-950/10 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-green-300 transition-colors mt-4 duration-150"
                >
                  გაგრძელება
                </button>
              </form>
              <div class="text-sm font-bold font-[normal-font] text-slate-500 mt-4">
                  <span>არ მოგსვლიათ კოდი?</span>
                  <button
                    onClick={resendCode}
                    class="text-green-500 pl-1 hover:text-green-600"
                  >
                    გაგზავნა
                  </button>
              </div>
            </div>
          </div>
        </Match>
        <Match when={showPasswordForm()}>
          <form
            onSubmit={handlePasswordReset}
            class="flex-col h-full w-full flex justify-center items-center"
          >
            <div class="flex flex-col w-[300px] gap-y-1">
              <div class="flex items-center focus:outline-none border border-gray-200 rounded py-3 px-4 mb-2 bg-gray-200 focus:bg-white focus:border-gray-500 justify-between">
                <input
                  type={displayNewPassword() ? "text" : "password"}
                  class="font-[thin-font] font-bold bg-transparent outline-0 text-gray-700"
                  name="new_password"
                  placeholder="ახალი პაროლი"
                />
                <button
                  type="button"
                  onClick={() => setDisplayNewPassword((prev) => !prev)}
                >
                  <img
                    src={displayNewPassword() ? eyeSlashSVG : eyeFillSVG}
                  ></img>
                </button>
              </div>
              <div class="flex items-center bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-2 focus:outline-none focus:bg-white focus:border-gray-500 justify-between">
                <input
                  type={displayRepeatPassword() ? "text" : "password"}
                  class="font-[thin-font] font-bold bg-transparent outline-0 text-gray-700"
                  name="repeat_password"
                  placeholder="გაიმეორე პაროლი"
                />

                <button
                  type="button"
                  onClick={() => setDisplayRepeatPassword((prev) => !prev)}
                >
                  <img
                    src={displayRepeatPassword() ? eyeSlashSVG : eyeFillSVG}
                  ></img>
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                class="text-white flex items-center justify-center gap-x-2 w-[300px] py-2 text-base font-[thin-font] font-bold bg-dark-green hover:bg-dark-green-hover rounded-[16px]"
              >
                პაროლის განახლება
              </button>
            </div>
          </form>
        </Match>
      </Switch>
      <Show when={toast()}>
        <Toast
          toast={toast}
          setToast={setToast}
          isExiting={isExiting}
          setIsExiting={setIsExiting}
        ></Toast>
      </Show>
    </>
  );
};

export default ResetPassword;
