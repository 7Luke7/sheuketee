export const EmailPassword = () => {
    return <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full px-3">
      <div class="flex items-center justify-between">
        <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email-mobile">
          მეილი ან ტელ.ნომერი
        </label>
      </div>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email-mobile" type="text" name="phoneEmail" placeholder="example@gmail.com" />
    </div>
    <div class="w-full px-3">
      <label class="block font-[normal-font] tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
        პაროლი
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" name="password" placeholder="******************" />
    </div>
  </div>
}