export const Sort = () => {
    return <div class="absolute top-0 bg-white p-2 border border-t-0 w-[250px] right-0">
    <select className="block mb-2 px-3 w-full rounded-md py-2 text-gray-900 shadow-sm border outline-none focus:ring-2 focus:ring-inset focus:ring-dark-green sm:text-sm sm:leading-6">
        <option>თარიღი კლებადი</option>
        <option>თარიღი ზრდადი</option>
        <option value="inc">ანაზღაურება ზრდადი</option>
        <option value="dec">ანაზღაურება კლებადი</option>
    </select>
</div>
}