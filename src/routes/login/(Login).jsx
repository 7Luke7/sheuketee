import { createSignal, onMount } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { SmallFooter } from '~/Components/SmallFooter';
import { EmailPassword } from '~/Components/EmailPassword';
import { LoginUser, LoginWithFacebook } from '../api/authentication';
import { MetaProvider } from "@solidjs/meta";

const Login = () => {
    const [error, setError] = createSignal(null);
    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^\d{9}$/
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setError(null);
            const formData = new FormData(event.target)
            if (!emailRegex.test(formData.get("phoneEmail")) && !phoneRegex.test(formData.get("phoneEmail"))) {
                return setError([{
                    field: "phoneEmail",
                    message: "მეილი ან ტელეფონის ნომერი არასწორია."
                }])
            }
            if (!formData.get("password").length) {
                return setError([
                    {
                        field: "password",
                        message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."
                    }
                ])
            }
            const result = await LoginUser(formData);
            if (result.status === 400) {
                return setError(result.errors);
            }
            if (result.status === 200) return navigate(`/${result.role}/${result.profId}`);
        } catch (error) {
            console.log(error);
        }
    };

//     onMount(() => {
//
//         window.fbAsyncInit = function() {
//             // Initialize the SDK with your app and the Graph API version for your app
//             FB.init({
//                       appId            : '{your-facebook-app-id}',
//                         cookie: true,
//                       xfbml            : true,
//                       version          : '{the-graph-api-version-for-your-app}'
//                     });
//             // If you are logged in, automatically get your name and email adress, your public profile information
//             FB.login(function(response) {
//                 console.log(response)
//                       if (response.authResponse) {
//                            console.log('Welcome!  Fetching your information.... ');
//                            FB.api('/me', {fields: 'name, email'}, function(response) {
//                                document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
//                            });
//                       } else {
//                            // If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email
//                            console.log('User cancelled login or did not fully authorize.'); }
//             })
//         };
//
//
//         const finished_rendering = function() {
//             let spinner = document.getElementById("spinner");
//             spinner.removeAttribute("style");
//             spinner.removeChild(spinner.childNodes[0]);
//         }
//
//         const handleFacebookLogin = async (authResponse) => {
//         try {
//             console.log(authResponse)
//             const { accessToken, userID } = authResponse;
//             const result = await LoginWithFacebook({ accessToken, userID });
//             if (result.status === 400) {
//                 return setError(result.errors);
//             }
//             navigate(`/${result.role}/${result.profId}`);
//         } catch (error) {
//             console.error('Error during Facebook login:', error);
//         }
//     };
//
//         window.FB.Event.subscribe('auth.login', handleFacebookLogin);
//
//         window.FB.Event.subscribe('xfbml.render', finished_rendering);
//     });

    const statusChangeCallback = (response) => {
        console.log(response);
        if (response.status === 'connected') {
            handleFacebookLogin(response.authResponse);
        }
    };

    return (
        <MetaProvider>
        {/*<script async defer crossorigin="anonymous" src="https://connect.facebook.net/ka_GE/sdk.js#xfbml=1&version=v20.0&appId=798141012304233" nonce="aoYbrohF"></script>*/}
            <div class="h-screen overflow-y-hidden mx-12 pt-6">
                <A href="/" class="text-xl leading-[25px] text-dark-green font-bold font-[thin-font]">შეუკეთე</A>
                <div class="h-full justify-evenly flex flex-col">
                    <div class="border w-[500px] mx-auto p-5 mt-5 rounded border-slate-300 border-2 flex flex-col gap-y-2 items-center">
                        <h1 class="text-xl font-bold text-slate-900 font-[boldest-font]">შესვლა</h1>
                        <form method="post" onSubmit={handleSubmit} class="w-full">
                            <EmailPassword error={error} />
                            <button type="submit" class="font-[thin-font] text-center text-lg w-full font-bold bg-dark-green hover:bg-dark-green-hover transition ease-in delay-20 text-white px-3 py-2 rounded-[16px]">გაგრძელება</button>
                        </form>
                        <div class="flex items-center max-w-lg justify-start w-full">
                            <hr class="flex-grow border-t border-gray-300"></hr>
                            <span class="mx-4 text-gray-500 font-[thin-font] font-bold">ან</span>
                            <hr class="flex-grow border-t border-gray-300"></hr>
                        </div>
{/*                       <div id="spinner" class="bg-[#4267b2] rounded-[5px] text-center text-white font-[thin-font] font-bold h-[40px] w-[80%] mx-auto">
//                             იტვირთება...
//                             <div scope="public_profile,email,user_location,user_hometown,user_birthday,user_gender" class="fb-login-button w-full" data-width="100%" data-size="large" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false">
//
//                             </div>
             </div>
*/}
                        <p class="text-center font-[thin-font] font-bold text-sm text-gray-700">არ გაქვს ექაუნთი? <A href="/choose" class="text-gr underline">რეგისტრაცია</A></p>
                    </div>
                    <div>
                        <SmallFooter />
                    </div>
                </div>
            </div>
        </MetaProvider>
    );
};

export default Login;
