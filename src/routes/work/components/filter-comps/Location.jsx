import { createSignal } from "solid-js"
import locationWhite from "../../../../../public/svg-images/locationWhite.svg"
import cities from "./cities.json"

export const Location = ({findLocation, marker, map}) => {
    const [state, setState] = createSignal("")
    const [coordinates, setCoordinates] = createSignal({
        city: "",
        cords: null
    })

    const moveToCity = () => {
      map().setCenter(coordinates().cords);
      marker().setPosition(coordinates().cords)
    }
    return <div class="absolute top-0 bg-white p-2 border border-t-0 w-[250px] left-[165px]">
        <button onClick={findLocation} class="flex items-center justify-center gap-x-1 text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold bg-gray-900 duration-200 ease-in hover:bg-gray-800">
            <img src={locationWhite}></img>
            <p>თქვენი ლოკაცია</p>
        </button> 
        <div class="flex mt-1 items-center max-w-lg justify-start w-full">
          <hr class="flex-grow border-t border-gray-300"></hr>
          <span class="mx-4 text-gray-500 font-[thin-font] font-bold">ან</span>
          <hr class="flex-grow border-t border-gray-300"></hr>
        </div>
        <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                მხარე
              </label>
                <div className="mt-1">
                    <select
                    id="state"
                    name="state"
                    onChange={(e) => {
                        const index = e.target.childNodes[e.target.selectedIndex].getAttribute("data")
                        setCoordinates({
                            name: cities[index].cities[0].name,
                            cords: cities[index].cities[0].coords
                        })
                        setState(e.target.value)
                    }}
                    value={state() === "" ? "თბილისი" : state()}
                    type="select"
                    className="block px-3 w-full rounded-md py-2 text-gray-900 shadow-sm border outline-none focus:ring-2 focus:ring-inset focus:ring-dark-green sm:text-sm sm:leading-6"
                    >
                        {cities.map((c, i) => {
                            return <option key={i} data={i} value={c.state}>{c.state}</option>
                        })}
                    </select>
              </div>
            </div>

            <div class="bg-white z-50">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ქალაქი
                </label>
              <div className="mt-1">
                <select
                  id="city"
                  name="city"
                  onChange={(e) => {
                    const selected = e.target.childNodes[e.target.selectedIndex].getAttribute("data")
                    setCoordinates({
                        city: selected.split("-")[0],
                        cords: { lat: parseFloat(selected.split("-")[1]), lng: parseFloat(selected.split("-")[2]) }
                    })
                  }}
                  value={coordinates().city === "" ? "თბილისი" : coordinates().city}
                  type="select"
                  className="block px-3 w-full rounded-md py-2 text-gray-900 shadow-sm border outline-none focus:ring-2 focus:ring-inset focus:ring-dark-green sm:text-sm sm:leading-6"
                >
                    {cities.filter((cs) => state() === "" ? cs.state === "თბილისი" : cs.state === state()).map((c, i) => {
                        return c.cities.map((city, index) => {
                            return <option attr:data={city.name + "-" + city.coords.lat + "-" + city.coords.lng} key={index} value={city.name}>{city.name}</option>
                        })
                    })}
                </select>
              </div>
              <button onClick={moveToCity} class="flex items-center mt-3 justify-center gap-x-1 text-white w-full rounded-[16px] py-2 text-base font-[thin-font] font-bold bg-dark-green duration-200 ease-in hover:bg-dark-green-hover">
                გაფილტვრა
              </button>
            </div>
    </div>
}