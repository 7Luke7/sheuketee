import { createSignal } from "solid-js";
import cities from "../../work/components/filter-comps/cities.json"

const Location = () => {
  const [state, setState] = createSignal("")

  return <div class="bg-white p-2">
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
          onChange={(e) => {
            setState(e.target.value)
          }}
          name="state"
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
      <button type="submit" className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
          გაგრძელება
        </button>
    </div>
  </div>
};

export default Location;
