import searchIcon from "../../../svg-images/svgexport-5.svg"
import clear from "../../../svg-images/svgexport-12.svg"

export const SearchWork = () => {
    return <form class="flex mt-5 items-center border-dark-green border px-2 py-1 rounded-[16px]">
        <button class="w-[25px] h-[20px]" type="submit">
            <img width={16} height={16} src={searchIcon}></img>
        </button> 
        <input type="text" class="w-full font-[thin-font] text-sm font-bold outline-0" placeholder="მოძებნე სამუშაო"></input>
        <img width={16} height={16} class="border rounded-[50%] border-gr" src={clear}></img>
    </form>
}