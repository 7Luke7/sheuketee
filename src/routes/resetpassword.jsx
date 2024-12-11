import { A } from "@solidjs/router";
import { SmallFooter } from "~/Components/SmallFooter";

const ResetPassword = (props) => {
  return (
    <div class="h-screen overflow-y-hidden mx-12 pt-6">
      <A
        href="/"
        class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]"
      >
        შეუკეთე
      </A>
      <section class="flex min-h-[70vh] justify-center w-[70%] m-auto flex-col items-center">
        <div class="border px-5 flex items-center h-[500px] w-[800px]">
            {props.children}
          </div>
      </section>
      <div class="mt-32">
        <SmallFooter></SmallFooter>
      </div>
    </div>
  );
};

export default ResetPassword;
