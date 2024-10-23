import cities from "~/Components/cities.json";

export const ManualLocation = (props) => {
  return (
    <div class="flex-[1] w-full px-4 py-2 ">
      <div class="flex justify-center flex-col my-2 items-start">
        <h2 class="text-lg text-gray-800 text-center">
          სამუშაოს ადგილ-მდებარეობა
        </h2>
        <p class="text-gray-600 text-sm font-[normal-font]">{props.location().display_name || "არ არის მითითებული."}</p>
      </div>
      <div class="w-full">
        <div class="w-full gap-x-5 flex">
          <div class="w-1/2">
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
                  const index =
                    e.target.childNodes[e.target.selectedIndex].getAttribute(
                      "data"
                    );
                  props.setCoordinates({
                    name: cities[index].cities[0].name,
                    cords: cities[index].cities[0].coords,
                  });
                  props.setState(e.target.value);
                }}
                value={props.state() === "" ? "თბილისი" : props.state()}
                type="select"
                className="block px-3 w-full rounded-md py-2 text-gray-900
shadow-sm border outline-none focus:ring-2 focus:ring-inset
focus:ring-dark-green sm:text-sm sm:leading-6"
              >
                {cities.map((c, i) => {
                  return (
                    <option key={i} data={i} value={c.state}>
                      {c.state}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div class="w-1/2">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ქალაქი
            </label>
            <div className="mt-1 w-full">
              <select
                id="city"
                name="city"
                onChange={(e) => {
                  const selected =
                    e.target.childNodes[e.target.selectedIndex].getAttribute(
                      "data"
                    );
                  props.setCoordinates({
                    city: selected.split("-")[0],
                    cords: {
                      lat: parseFloat(selected.split("-")[1]),
                      lng: parseFloat(selected.split("-")[2]),
                    },
                  });
                }}
                value={
                  props.coordinates().city === ""
                    ? "თბილისი"
                    : props.coordinates().city
                }
                type="select"
                className="block px-3 w-full rounded-md py-2 text-gray-900
shadow-sm border outline-none focus:ring-2 focus:ring-inset
focus:ring-dark-green sm:text-sm sm:leading-6"
              >
                {cities
                  .filter((cs) =>
                    props.state() === ""
                      ? cs.state === "თბილისი"
                      : cs.state === props.state()
                  )
                  .map((c, i) => {
                    return c.cities.map((city, index) => {
                      return (
                        <option
                          attr:data={
                            city.name +
                            "-" +
                            city.coords.lat +
                            "-" +
                            city.coords.lng
                          }
                          key={index}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      );
                    });
                  })}
              </select>
            </div>
          </div>
        </div>
        <input
          value={props.streetAddress()}
          onInput={(e) => {
            props.setStreetAdress(e.target.value);
          }}
          type="text"
          minLength={1}
          maxLength={100}
          placeholder="ქუჩის მისამართი"
          class="mt-3 text-base text-gray-800 w-full bg-gray-100 font-[normal-font] border border-gray-300 p-2 mb-2 outline-none"
        ></input>
        <div class="w-full">
          <div class="flex items-center justify-start w-full">
            <hr class="flex-grow border-t border-gray-300"></hr>
            <span class="mx-4 text-gray-500 font-[thin-font] font-bold">
              ან
            </span>
            <hr class="flex-grow border-t border-gray-300"></hr>
          </div>
          <button
            type="button"
            class="mt-2 bg-dark-green w-full hover:bg-dark-green-hover px-4 py-2 font-bold font-[normal-font] text-base transition ease-in delay-20 text-white text-center rounded-[16px]"
          >
            შეცვალე ლოკაცია(რუქით)
          </button>
        </div>
      </div>
    </div>
  );
};
