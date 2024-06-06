export const Pay = () => {
    return <div class="absolute top-0 bg-white p-2 border border-t-0 w-[250px] left-[360px]">
    <form className="pt-2 xxs:flex lg:block">
          <input type="number" className="p-2 border w-1/2 outline-none" id="min" placeholder="მინ." ></input>
          <input type="number" placeholder="მაქს." id="max" className="p-2 border w-1/2 outline-none" ></input>
          <button class="flex items-center mt-3 justify-center gap-x-1 text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold bg-dark-green duration-200 ease-in hover:bg-dark-green-hover">
                გაფილტვრა
            </button>
      </form>
</div>
}