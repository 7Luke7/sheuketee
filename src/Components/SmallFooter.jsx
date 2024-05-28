import { A } from "@solidjs/router"

export const SmallFooter = () => {
    return <footer class="bg-slate-900 rounded-lg shadow m-4 dark:bg-gray-800">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <A href="/" class="hover:underline">შეუკეთე™</A>. ყველა უფლება დაცულია.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <A href="/about" class="hover:underline me-4 md:me-6">შესახებ</A>
            </li>
            <li>
                <A href="/rules" class="hover:underline me-4 md:me-6">სერვისის წესები</A>
            </li>
            <li>
                <A href="/contact" class="hover:underline">კონტაქტი</A>
            </li>
        </ul>
        </div>
    </footer>    
}