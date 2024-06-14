import { Header } from "~/Components/Header"
import { get_xelosani } from "../../api/user"
import { createAsync, useNavigate } from "@solidjs/router"
import { Footer } from "~/Components/Footer"
import { Show } from "solid-js"
import { ProfileLeft } from "./ProfileLeft"
import { ProfileRight } from "./ProfileRight"
import { navigateToStep } from "~/routes/api/xelosani/setup/step"

const Xelosani = (props) => {
    const user = createAsync(() => get_xelosani(props.params.id));
    const navigate = useNavigate()

    const handlenavigateToStep = async () => {
        try {
            const response = await navigateToStep() 
            navigate(response)
        } catch (error) {
            console.log(error)
            alert("წარმოიშვა შეცდომა გთხოვთ ცადოთ მოგვიანებით.")
        }
    }

   return (
        <div>
            <Header />
            <div class="w-[90%] mx-auto mt-8">
                <Show when={user()}>
                    <Show when={user().status === 200}>
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center w-5/6">
                            <div class="h-5 w-full rounded-[16px] bg-[#E5E7EB] relative">    
                                <div class="bg-dark-green rounded-[16px] h-full absolute" style={{ width: `${user().stepPercent}%` }}></div>
                                <span class="font-[thin-font] text-[11px] text-green-800 font-bold absolute right-2 top-1/2 transform -translate-y-1/2">{user().stepPercent}%</span>
                            </div>
                        </div>
                        <button onClick={handlenavigateToStep} class="py-1 w-1/6 text-center rounded-md text-xs font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover ml-2">სეტაპის გაგრძელება</button>
                    </div>
                    </Show>
                    <div class="flex items-start relative">
                        <ProfileLeft user={user} />
                        <ProfileRight user={user} />
                    </div>
                </Show>
                <Footer />
            </div>
        </div>
    );
};


export default Xelosani