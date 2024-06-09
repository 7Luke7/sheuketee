import { createAsync, useNavigate } from "@solidjs/router";
import { get_notification_targets, toggle_notification } from "~/routes/api/user";
import exclamationSVG from "../../../public/svg-images/exclamation.svg"

const fetchNotificationTargets = async (navigate) => {
  try {
    const response = await get_notification_targets();
    const data = JSON.parse(response);
    if (data === 401) {
      navigate("/login")
    }
    return data;
  } catch (error) {
    alert(error)
  }
};

const toggleMailNotifications = async (emailRef) => {
  try {
    const response = await toggle_notification("email")
    if (response === "მეილზე შეტყობინებები გამოირთო") {
      emailRef.checked = false
    } else if (response === "მეილზე შეტყობინებები ჩაირთო") {
      emailRef.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}

const toggleMobileNotifications = async (mobileRef) => {
  try {
    const response = await toggle_notification("phone")
    if (response === "მობილურზე შეტყობინებები გამოირთო") {
      mobileRef.checked = false
    } else if (response === "მობილურზე შეტყობინებები ჩაირთო") {
      mobileRef.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}

const Notifications = () => {
  const navigate = useNavigate()
  const notifTargets = createAsync(() => fetchNotificationTargets(navigate))
  let emailNotif; 
  let mobileNotif;

  return <div class="px-10">
    <div class="flex flex-col gap-y-1">
      <p class="font-[thin-font] font-bold">შეტყობინებები მეილზე</p>
      <div class="checkbox-wrapper-6">
        <label class="relative inline-flex items-center cursor-pointer">
          <input onChange={() => toggleMailNotifications(emailNotif)} ref={emailNotif} checked={notifTargets()?.includes("email")}t type="checkbox" class="sr-only peer" />
          <div class="w-[60px] h-8 after:w-7 after:h-7 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-dark-green hover:peer-checked:bg-dark-green-hover"></div>
        </label>
      </div>
    </div>
    <div class="flex flex-col pt-3 gap-y-1">
      <p class="font-[thin-font] font-bold">
        შეტყობინებები მობილურზე
      </p>
      <div class="checkbox-wrapper-6">
        <label class="relative inline-flex items-center cursor-pointer">
          <input onChange={() => toggleMobileNotifications(mobileNotif)} ref={mobileNotif} checked={notifTargets()?.includes("phone")} type="checkbox" class="sr-only peer" />
          <div class="w-[60px] h-8 after:w-7 after:h-7 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-dark-green hover:peer-checked:bg-dark-green-hover"></div>
        </label>
      </div>
    </div>
    <div class="flex mt-5 gap-x-2 items-center">
      <img class="rounded-[50%] bg-gray-100" src={exclamationSVG}></img>
      <h1 class="font-[thin-font] text-gr text-xs font-bold">არ აქვს მნიშვნელობა შეტყობინებები ჩართული გაქვთ თუ გამორთული ვერიფიკაციის კოდი ყოველთვის გამოიგზავნება.</h1>
    </div>
  </div>
}

export default Notifications