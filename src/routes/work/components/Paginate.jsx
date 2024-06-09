import chevronRight from "../../../../public/svg-images/chevron-right.svg"
import chevronLeft from "../../../../public/svg-images/chevron-left.svg"

export const Paginate = () => {
    return <div class="flex sticky bottom-0 h-[35px] items-center justify-center bg-gray-100">
    <nav class="flex items-center gap-x-2 min-w-max">
        <a class="text-gray-500 hover:text-gray-900 p-1 inline-flex items-center md:mr-4 mr-1" href="javascript:;">
            <span class="w-8 h-8 rounded-full transition-all duration-150 flex justify-center items-center hover:border hover:border-dark-green-hover">
                <img src={chevronLeft}></img>
            </span>
        </a>
        <a class="w-8 h-8 text-gray-500 p-1 inline-flex items-center justify-center border border-gray-200 rounded-full transition-all duration-150 hover:text-white hover:bg-dark-green-hover hover:border-dark-green-hover " href="javascript:;" aria-current="page">1</a>
        <a class="w-8 h-8 bg-dark-green text-white p-1 inline-flex items-center justify-center rounded-full transition-all duration-150 hover:bg-dark-green-hover hover:text-white" href="javascript:;">2</a>
        <a class="w-8 h-8 text-gray-500 p-1 inline-flex items-center justify-center border border-gray-200 rounded-full transition-all duration-150 hover:text-white hover:bg-dark-green-hover hover:border-dark-green-hover " href="javascript:;">3</a>
        <a class="w-8 h-8 text-gray-500 p-1 inline-flex items-center justify-center border border-gray-200 rounded-full transition-all duration-150 hover:text-white hover:bg-dark-green-hover hover:border-dark-green-hover " href="javascript:;">4</a>
        <a class="w-8 h-8 text-gray-500 p-1 inline-flex items-center justify-center border border-gray-200 rounded-full transition-all duration-150 hover:text-white hover:bg-dark-green-hover hover:border-dark-green-hover " href="javascript:;">...</a>
        <a class="w-8 h-8 text-gray-500 p-1 inline-flex items-center justify-center border border-gray-200 rounded-full transition-all duration-150 hover:text-white hover:bg-dark-green-hover hover:border-dark-green-hover " href="javascript:;">10</a>
        <a class="text-gray-500 hover:text-gray-900 p-1 inline-flex items-center md:ml-4 ml-1" href="javascript:;">
            <span class="w-8 h-8 rounded-full transition-all duration-150 flex justify-center items-center hover:border hover:border-dark-green-hover ">
                <img src={chevronRight}></img>              
            </span>
        </a>
    </nav>
</div>

}