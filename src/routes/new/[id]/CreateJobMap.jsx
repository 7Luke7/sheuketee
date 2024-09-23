import SearchIcon from "../../../svg-images/svgexport-5.svg";
import CloseIcon from "../../../svg-images/svgexport-12.svg";
import { createSignal, onMount, Show, Switch, Match } from "solid-js";
import "ol/ol.css";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import { fromLonLat, transformExtent, toLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Geolocation from "ol/Geolocation";
import { Icon, Style } from "ol/style";
import Modify from "ol/interaction/Modify";

export const CreateJobMap = (props) => {
  const [searchResults, setSearchResults] = createSignal();
  const [searching, setSearching] = createSignal(false);
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [searchInputValue, setSearchInputValue] = createSignal("");
  const [message, setMessage] = createSignal("");

  let map;
  let geolocation;
  let isGeolocationActive = true;

  const fetch_location = async (lng, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lon=${lng}&lat=${lat}&accept-language=ka`
      );
      document.body.style.cursor = "pointer";

      if (response.ok) {
        const data = await response.json();
        props.setMarkedLocation(data);
      } else {
        setMessage(
          "დაფიქსირდა შეცდომა: თქვენს მიერ მარკირებული ადგილი ვერ მოიძებნა, ცადეთ თავიდან."
        );
      }
    } catch (error) {
      setMessage("დაფიქსირდა მოულოდნელი შეცდომა, ცადეთ თავიდან.");
    }
  };

  onMount(() => {
    const userLocationFeature = new Feature({
      geometry: new Point(props.location() && fromLonLat([props.location().lon, props.location().lat])),
    });
    const georgiaExtent = [38.5, 40.9, 46.8, 44.5];
    const view = new View({
      zoom: 12,
      center: props.location() && fromLonLat([props.location().lon, props.location().lat]),
      extent: transformExtent(georgiaExtent, "EPSG:4326", "EPSG:3857"),
    });

    map = new Map({
      target: map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [userLocationFeature],
          }),
          style: new Style({
            image: new Icon({
              anchor: [0.5, 40],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              src: "../../../../svg-images/redlocation.svg",
              scale: 1.25,
            }),
          }),
        }),
      ],
      view: view,
    });

    geolocation = new Geolocation({
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });

    geolocation.on("change:position", async function () {
      if (isGeolocationActive) {
        const coordinates = geolocation.getPosition();
        userLocationFeature.setGeometry(
          coordinates ? new Point(coordinates) : null
        );
        map.getView().setCenter(coordinates);
        const [lng, lat] = toLonLat(coordinates);
        await fetch_location(lng, lat);
      }
    });

    const modify = new Modify({
      source: map.getLayers().item(1).getSource(), // Assuming the vector layer is the second layer
    });

    map.addInteraction(modify);

    modify.on(["modifystart", "modifyend"], async function (evt) {
      try {
        if (evt.type === "modifystart") {
          document.body.style.cursor = "grabbing";
          isGeolocationActive = false;
        } else if (evt.type === "modifyend") {
          document.body.style.cursor = "pointer";
          const feature = evt.features.item(0);
          const coordinates = feature.getGeometry().getCoordinates();
          const [lng, lat] = toLonLat(coordinates);

          await fetch_location(lng, lat);
          isGeolocationActive = true; // Reactivate geolocation if needed
        }
      } catch (error) {
        setMessage("დაფიქსირდა შეცდომა ლოკაციის მარკირებისას.");
      }
    });
  });

  async function searchLocation(query) {
    const countryCodes = "GE";
    const viewbox = "38.5,40.9,46.8,44.5";
    const bounded = 1;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&accept-language=ka&countrycodes=${countryCodes}&viewbox=${viewbox}&bounded=${bounded}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(400);
      }
      const data = await response.json();
      if (!data.length) return setSearching(false);
      setSearchResults(data);
      setSearching(false);
      return data;
    } catch (error) {
      if (error.message === "400") {
        setError("დაფიქსირდა შეცდომა ინფორმაციის მიღებისას ცადეთ თავიდან.");
      }
      setSearching(false);
    }
  }

  const displaySearchResults = async (results) => {
    try {
      let searchResultLayer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("name") === "searchResults");

      if (!searchResultLayer) {
        const vectorSource = new VectorSource();
        searchResultLayer = new VectorLayer({
          source: vectorSource,
          name: "searchResults",
        });
        map.addLayer(searchResultLayer);
      } else {
        searchResultLayer.getSource().clear();
      }
    } catch (error) {
      setSearching(false);
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const locationInput = formData.get("searchLocation");
      if (locationInput && locationInput.length > 3) {
        setSearching(true);
        const results = await searchLocation(locationInput);
        if (!results) return;
        displaySearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log(error);
      setSearching(false);
    }
  };

  const handleSidebarLocationChange = (location) => {
    const coordinates = fromLonLat([
      parseFloat(location.lon),
      parseFloat(location.lat),
    ]);

    let searchResultLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("name") === "place_id");
    let searchSource;

    if (searchResultLayer) {
      searchSource = searchResultLayer.getSource();
      if (searchSource) {
        searchSource.clear();
      } else {
        console.warn("Search source is undefined");
        searchSource = new VectorSource();
        searchResultLayer.setSource(searchSource);
      }
    } else {
      searchSource = new VectorSource();
      searchResultLayer = new VectorLayer({
        source: searchSource,
        name: "place_id",
      });
      map.addLayer(searchResultLayer);
    }

    userLocationFeature.getGeometry().setCoordinates(coordinates);

    map.getView().setCenter(coordinates);
    map.getView().setZoom(14);

    props.setMarkedLocation(location);
  };

  return (
    <div class="flex-[1] w-full">
      <div class="flex h-full flex-col items-start justify-start">
        <div class="flex justify-center flex-col px-2 gap-y-1 my-2 items-start">
          <h2 class="text-lg text-gray-800 text-center">
            სამუშაოს ადგილ-მდებარეობა(ლოკაცია)
          </h2>
          <div class="w-full flex flex-col gap-y-2 border-t">
            <Show when={message()}>
              <p class="text-red-500 text-xs font-[thin-font] break-word font-bold">
                {message()}
              </p>
            </Show>
            <div class="flex items-center gap-x-1">
              <p class="text-[12px] text-gray-800 font-[thin-font] break-word font-bold">
                {props.markedLocation()?.display_name ||
                  (props.location() && props.location().display_name)}
              </p>
            </div>
          </div>
        </div>
        <div class="h-full border-b w-full m-0">
          <div class="h-full w-full m-0 relative" ref={map}>
            <div
              class={`absolute max-w-[280px] ${
                isSearchOpen() && "h-full opacity-[90%] overflow-y-auto"
              } right-0 z-40 bg-white`}
            >
              <Switch>
                <Match when={isSearchOpen()}>
                  <div class="flex gap-x-2 items-center py-2 px-3 border-b">
                    <form
                      onSubmit={handleSearchLocation}
                      class="flex w-full justify-between items-center"
                    >
                      <input
                        value={searchInputValue()}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        autocomplete="off"
                        type="text"
                        name="searchLocation"
                        class="w-full outline-none text-gray-800 font-[thin-font] font-bold"
                        placeholder="მოძებნე..."
                      />
                      <button type="submit">
                        <img src={SearchIcon} alt="Search" />
                      </button>
                    </form>
                    <button onClick={() => setIsSearchOpen(false)}>
                      <img src={CloseIcon} alt="Search" />
                    </button>
                  </div>
                  <div class="py-2 px-3">
                    <Switch>
                      <Match when={searching()}>
                        <p class="text-gray-800 text-center font-[thin-font] font-bold">
                          იტვირთება...
                        </p>
                      </Match>
                      <Match when={!searching() && !searchResults()}>
                        <p class="text-gray-800 text-center font-[thin-font] font-bold">
                          მისამართები ვერ მოიძებნა.
                        </p>
                      </Match>
                      <Match when={!searching() && searchResults()}>
                        <ul>
                          {searchResults().map((result, index) => (
                            <li
                              onClick={() =>
                                handleSidebarLocationChange(result)
                              }
                              key={index}
                              class={`text-xs font-bold font-[thin-font] break-word p-1 cursor-pointer ${
                                props.markedLocation()?.place_id === result.place_id
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-100"
                              } border-b`}
                            >
                              {result.display_name}
                            </li>
                          ))}
                        </ul>
                      </Match>
                    </Switch>
                  </div>
                </Match>
                <Match when={!isSearchOpen()}>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    class="flex items-center justify-center p-2"
                  >
                    <img src={SearchIcon} alt="Search" />
                  </button>
                </Match>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
