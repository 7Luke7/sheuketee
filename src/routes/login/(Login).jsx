import { createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { SmallFooter } from '~/Components/SmallFooter';
import { EmailPassword } from '~/Components/EmailPassword';
import { LoginUser } from '../api/authentication';

const Login = () => {
  const [error, setError] = createSignal(null);
    const navigate = useNavigate()
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError(null)
      const formData = new FormData(event.target);
      const result = await LoginUser(formData);
      if (result.status === 400) {
        return setError(result.errors);
      }
        navigate(`/${result.role}/${result.profId}`)
    } catch (error) {
      console.log(error)
    }
  };    

  return (
    <div class="mx-12 mt-6">
      <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
      <div class="border h-[60vh] w-[600px] mx-auto p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-5 justify-center items-center">
        <div class="flex gap-x-5">
          <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">შესვლა</h1>
        </div>
        <form method="post" onSubmit={handleSubmit} class="w-full max-w-lg">
          <EmailPassword error={error} />
          <Show when={error()?.some(a => a.message === "user")}>
            <p class="text-xs text-red-500 mt-1 font-[thin-font] font-bold">მომხმარებელი ვერ მოიძებნა.</p>
          </Show>
          <button type="submit" class="font-[thin-font] text-center text-lg w-full font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">გაგრძელება</button>
        </form>
        <div class="flex items-center max-w-lg justify-start w-full">
          <hr class="flex-grow border-t border-gray-300"></hr>
          <span class="mx-4 text-gray-500 font-[thin-font] font-bold">ან</span>
          <hr class="flex-grow border-t border-gray-300"></hr>
        </div>
        <p class="text-center mt-1 font-[thin-font] font-bold text-sm text-gray-700">არ გაქვს ექაუნთი? <A href="/choose" class="text-gr underline">რეგისტრაცია</A></p>
      </div>
      <div class="mt-32">
        <SmallFooter />
      </div>
    </div>
  );
};

export default Login;
