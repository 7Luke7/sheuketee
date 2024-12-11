// import { For } from "solid-js";
// import plus from "../../../svg-images/plus.svg"

// export const MileStoneModal = (props) => {
//   return (
//     <div
//       id="milestoneWrapper"
//       class="p-4 min-h-[460px] relative mb-5 bg-white border-t-0 border w-full"
//     >
//       <h2 class="text-lg font-[normal-font] text-center text-gray-800 font-bold">
//         სამუშაოს ეტაპებად დაყოფა
//       </h2>
//       <div class="grid gap-x-2 mt-5 grid-cols-4">
//         <For each={props.mileStone()}>
//           {(m, index) => (
//             <div class="">
//               <h2 class="mb-2 font-[bolder-font] text-md">{index() + 1} ეტაპი</h2>
//               <input
//                 class="bg-gray-100 font-[bolder-font] w-full border border-gray-300 p-2 mb-2 outline-none"
//                 spellcheck="false"
//                 placeholder="ეტაპის სათაური"
//                 id="title"
//                 onInput={(e) => props.setMileStone((cm) => {
//                     cm[index()].title = e.target.value
//                     return cm
//                 })}
//                 maxLength={60}
//                 name="title"
//                 type="text"
//               />
//               <div class="flex mb-2 items-center text-gray-500 justify-between">
//                 <Show when={props.error()?.some((a) => a.field === `mileStones.${index()}.title`)}>
//                   <p class="text-xs text-red-500 font-[thin-font] font-bold">
//                     {props.error().find((a) => a.field === `mileStones.${index()}.title`).message}
//                   </p>
//                 </Show>
//               </div>
//               <textarea
//                 class="font-[bolder-font] text-sm bg-gray-100 p-3 h-60 w-full border border-gray-300 outline-none"
//                 spellcheck="false"
//                 name="description"
//                 onInput={(e) => props.setMileStone((cm) => {
//                     cm[index()].description = e.target.value
//                     return cm
//                 })}
//                 maxlength={600}
//                 id="desc"
//                 placeholder="აღწერეთ ეტაპის დეტალები"
//               ></textarea>
//               <div class="icons flex items-center text-gray-500 justify-between my-2">
//                 <Show when={props.error()?.some((a) => a.field === `mileStones.${index()}.description`)}>
//                   <p class="text-xs text-red-500 font-[thin-font] font-bold">
//                     {props.error().find((a) => a.field === `mileStones.${index()}.description`).message}
//                   </p>
//                 </Show>
//               </div>
//               <div class="flex items-start justify-between mb-4">
//                 <div class="flex flex-col gap-y-1">
//                 <div class="flex items-center">
//                   <input
//                     class="bg-gray-100 font-[bolder-font] w-[100px] border border-gray-300 p-2 outline-none"
//                     placeholder="ფასი"
//                     min={1}
//                     onInput={(e) => props.setMileStone((cm) => {
//                         cm[index()].price = Number(e.target.value)
//                         return cm
//                     })}
//                     id="price"
//                     name="price"
//                     type="number"
//                   />
//                   <span class="text-2xl font-[bolder-font]">₾</span>
//                 </div>
//                 <Show when={props.error()?.some((a) => a.field === `mileStones.${index()}.price`)}>
//                     <p class="text-xs text-red-500 font-[thin-font] font-bold mb-2">
//                       {props.error().find((a) => a.field === `mileStones.${index()}.price`).message}
//                     </p>
//                   </Show>
//                 </div>
//                 <button
//                 onClick={() => props.removeMileStone(index())}
//                   type="button"
//                   class="bg-red-600 px-4 text-sm py-2 font-[normal-font] font-bold hover:bg-red-500 transition ease-in delay-20 text-white text-center rounded-[16px]"
//                 >
//                   ეტაპის წაშლა
//                 </button>
//               </div>
//             </div>
//           )}
//         </For>
//       </div>
//       <div class="sticky bottom-0">
//       <button
//         onClick={props.addMileStone}
//         type="button"
//         class="bg-gray-800 flex items-center justify-center gap-x-2 px-4 w-full py-2 text-lg font-[bolder-font] hover:bg-gray-700 transition ease-in delay-20 text-white rounded-[16px]"
//       >
//         <img src={plus} class="border border-white rounded-full"></img>
//         <p class="text-lg">ეტაპის დამატება</p>
//       </button>
//       </div>
//     </div>
//   );
// };
