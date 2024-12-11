// import { A } from "@solidjs/router";
// import { Match, Show, Switch } from "solid-js";

// export const ProfileRight = (props) => {
//   return (
//     <div class="flex flex-1 flex-col border-r px-3">
//       <Switch>
//         <Match when={props.user().about}>
//           <div class="flex flex-col">
//             <div class="flex justify-between items-center">
//               <h2 class="font-[normal-font] text-gray-800 font-bold text-lg">ჩემს შესახებ</h2>
//               <p class="text-xs font-[thin-font] font-bold">
//                 შემოუერთდა {props.user().creationDateDisplayable}
//               </p>
//             </div>
//             <p class="text-sm mt-2 font-[thin-font] break-all text-gr font-bold">
//               {props.user().about}
//             </p>
//           </div>
//         </Match>
//         <Match when={props.user().status === 200}>
//           <div class="flex items-center justify-between">
//             <A
//               href="/setup/damkveti/step/about"
//               class="px-4 py-2 mt-2 bg-dark-green font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
//             >
//               დაამატე აღწერა
//             </A>
//             <p class="text-xs font-[thin-font] font-bold">
//               შემოუერთდა {props.user().creationDateDisplayable}
//             </p>
//           </div>
//         </Match>
//         <Match when={props.user().status === 401}>
//           <p class="text-gr text-xs font-[thin-font] font-bold">
//             მომხმარებელს აღწერა არ აქვს დამატებული.
//           </p>
//         </Match>
//       </Switch>
//       <div>
//           <h2 class="font-[normal-font] text-gray-800 font-bold text-lg mt-2">განცხადებები</h2>
//             <Show when={props.user().jobs}>
//             <div class="grid grid-cols-4 gap-x-5 mt-3 gap-y-5">
//               <For each={props.user().jobs}>
//                 {(j, i) => {
//                   return (
//                     <A href="javascript:void(0)">
//                       <div class="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full">
//                         <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
//                           <img
//                             src={j.thumbnail}
//                             alt="card-image"
//                             class="object-center object-cover h-full w-full"
//                           />
//                         </div>
//                         <div class="px-2.5 py-1">
//                           <div class="rounded-full mb-2 w-[120px] font-[thin-font] font-bold bg-dark-green-hover py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm text-center">
//                             {j.createdAt}
//                           </div>
//                           <h6 class="mb-1 text-slate-800 font-[normal-font] font-bold text-xl">
//                             {j.title}
//                           </h6>
//                           <p class="text-gr font-[thin-font] text-sm font-bold">
//                             {j.description}
//                           </p>
//                         </div>

//                         <div class="flex items-center justify-between p-4">
//                           <div class="flex items-center">
//                             <img
//                               alt="Tania Andrew"
//                               src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
//                               class="relative inline-block h-8 w-8 rounded-full"
//                             />
//                             <div class="flex flex-col ml-3 text-sm">
//                               <span class="text-slate-800 font-semibold">
//                                 Lewis Daniel
//                               </span>
//                               <span class="text-slate-600">
//                                 January 10, 2024
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </A>
//                   );
//                 }}
//               </For>
//             </div>
//             </Show>
//           </div>
//     </div>
//   );
// };
