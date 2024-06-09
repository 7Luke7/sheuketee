import { Header } from "~/Components/Header"
import { get_user } from "../../api/user"
import { createAsync } from "@solidjs/router"
import { Footer } from "~/Components/Footer"
import { Show } from "solid-js"
import { ProfileLeft } from "./ProfileLeft"
import { ProfileRight } from "./ProfileRight"

const Xelosani = (props) => {
    const user = createAsync(() => get_user(props.params.id));

    return (
        <div>
            <Header />
            <div class="w-[90%] mx-auto">
                <Show when={user()}>
                    <div class="flex items-start relative mt-14">
                        <ProfileLeft user={user} prof_id={props.params.id} />
                        <ProfileRight user={user} />
                    </div>
                </Show>
                <Footer />
            </div>
        </div>
    );
};


export default Xelosani