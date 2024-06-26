import { createSignal, onMount, Show, Switch, Match } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import "ol/ol.css"
import mapSVG from "../../../../public/svg-images/map.svg"
import formSVG from "../../../../public/svg-images/form.svg"
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import Feature from 'ol/Feature'
import {fromLonLat, transformExtent, toLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import Link from 'ol/interaction/Link';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { getCenter, containsExtent } from 'ol/extent';
import Geolocation from 'ol/Geolocation';
import { Icon, Style, Text, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Modify from 'ol/interaction/Modify';
import exclamationSVG from "../../../../public/svg-images/exclamation.svg"
import SearchIcon from "../../../../public/svg-images/svgexport-5.svg"
import CloseIcon from "../../../../public/svg-images/svgexport-12.svg"
import {handle_location, check_location} from "../../api/xelosani/setup/setup"
import closeIcon from "../../../../public/svg-images/svgexport-12.svg"

export const ModifyLocaitonModal = ({setModal, location}) => {
    const [message, setMessage] = createSignal("")
    const [searchResults, setSearchResults] = createSignal();
    const [searching, setSearching] = createSignal(false);
    const [isSearchOpen, setIsSearchOpen] = createSignal(false)
    const [activeSearchOption, setActiveSearchOption] = createSignal()
    const [searchInputValue, setSearchInputValue] = createSignal("")
    const [markedLocation, setMarkedLocation] = createSignal()

    let mapElement;
    let map;

    const userLocationFeature = new Feature({
        geometry: new Point(fromLonLat([location.lon, location.lat])),
    });

    // Secondary feature for the blue circle
    const blueCircleFeature = new Feature({
        geometry: new Point(fromLonLat([location.lon, location.lat])),
    });

    const fetchLocation = async (lng, lat) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lon=${lng}&lat=${lat}&accept-language=ka`);

            if (response.ok) {
                const data = await response.json();
                setMarkedLocation(data);
            } else {
                setMessage('დაფიქსირდა შეცდომა: თქვენს მიერ მარკირებული ადგილი ვერ მოიძებნა, ცადეთ თავიდან.');
            }
        } catch (error) {
            setMessage('დაფიქსირდა მოულოდნელი შეცდომა, ცადეთ თავიდან.');
        }
    };

    const initializeMap = () => {
        setMarkedLocation(location)
        const georgiaExtent = [38.5, 40.9, 46.8, 44.5];
        const view = new View({
            zoom: 12,
            center: fromLonLat([location.lon, location.lat]),
            extent: transformExtent(georgiaExtent, 'EPSG:4326', 'EPSG:3857'),
        });

        map = new Map({
            target: mapElement,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: view,
        });

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: '../../../../../public/svg-images/redlocation.svg',
                scale: 1.25,
            }),
        });

        const blueCircleStyle = new Style({
            image: new CircleStyle({
                radius: 6,
                anchor: [0.5, 40],
                fill: new Fill({ color: 'blue' }),
                stroke: new Stroke({
                    color: 'white',
                    width: 2,
                }),
            }),
        });

        userLocationFeature.setStyle(iconStyle);
        blueCircleFeature.setStyle(blueCircleStyle);

        const userLocationSource = new VectorSource({
            features: [userLocationFeature, blueCircleFeature],
        });

        const userLocationLayer = new VectorLayer({
            source: userLocationSource,
        });

        map.addLayer(userLocationLayer);

        const modify = new Modify({
            source: userLocationSource,
        });

        map.addInteraction(modify);

        modify.on(['modifystart', 'modifyend'], async (evt) => {
            if (evt.type === 'modifystart') {
            } else if (evt.type === 'modifyend') {
                const feature = evt.features.item(0);
                const coordinates = feature.getGeometry().getCoordinates();
                const [lng, lat] = toLonLat(coordinates);

                // Update both features' geometry
                userLocationFeature.setGeometry(new Point(coordinates));
                blueCircleFeature.setGeometry(new Point(coordinates));

                await fetchLocation(lng, lat);
            }
        });
    };

    onMount(() => {
        initializeMap();
        return () => {
            if (map) {
                map.setTarget(null);
            }
        };
    });

    const searchLocation = async (query) => {
        const countryCodes = 'GE';
        const viewbox = '38.5,40.9,46.8,44.5';
        const bounded = 1;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&accept-language=ka&countrycodes=${countryCodes}&viewbox=${viewbox}&bounded=${bounded}`;

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
            if (error.message === '400') {
                setMessage('დაფიქსირდა შეცდომა ინფორმაციის მიღებისას ცადეთ თავიდან.');
            }
            setSearching(false);
        }
    };

    const displaySearchResults = (results) => {
        let searchResultLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'searchResults');
        if (!searchResultLayer) {
            const vectorSource = new VectorSource();
            searchResultLayer = new VectorLayer({
                source: vectorSource,
                name: 'searchResults',
            });
            map.addLayer(searchResultLayer);
        } else {
            searchResultLayer.getSource().clear();
        }
        results.forEach(result => {
            const coordinates = fromLonLat([parseFloat(result.lon), parseFloat(result.lat)]);
            const feature = new Feature({
                geometry: new Point(coordinates),
                name: result.place_id,
            });
            feature.setStyle(new Style({
                image: new Icon({
                    src: '../../../../../public/svg-images/redlocation.svg',
                    scale: 0.7,
                }),
                text: new Text({
                    text: result.display_name,
                    offsetY: 20,
                    fill: new Fill({
                        color: '#000',
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                    }),
                }),
            }));
            searchResultLayer.getSource().addFeature(feature);
        });
    };

    const handleSearchLocation = async (e) => {
        e.preventDefault();
        const locationInput = searchInputValue();
        if (locationInput && locationInput.length > 3) {
            setSearching(true);
            const results = await searchLocation(locationInput);
            if (results) displaySearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSidebarLocationChange = (location) => {
        const coordinates = fromLonLat([parseFloat(location.lon), parseFloat(location.lat)]);
        let searchResultLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'place_id');
        let searchSource;

        if (searchResultLayer) {
            searchSource = searchResultLayer.getSource();
            if (searchSource) {
                searchSource.clear();
            } else {
                console.warn('Search source is undefined');
                searchSource = new VectorSource();
                searchResultLayer.setSource(searchSource);
            }
        } else {
            searchSource = new VectorSource();
            searchResultLayer = new VectorLayer({
                source: searchSource,
                name: 'place_id',
            });
            map.addLayer(searchResultLayer);
        }

        const feature = new Feature({
            geometry: new Point(coordinates),
            name: location.place_id,
        });

        feature.setStyle(new Style({
            image: new Icon({
                src: '../../../../../public/svg-images/redlocation.svg',
                scale: 0.7,
            }),
        }));

        searchSource.addFeature(feature);

        map.getView().setCenter(coordinates);
        map.getView().setZoom(14);

        setMarkedLocation(location);
    };

    const handleLocationSubmit = async () => {
        try {
            const response = await handle_location(markedLocation());
            if (response !== 200) throw new Error(response);
            setModal(null)
        } catch (error) {
            console.log(error.message);
            if (error.message === '401') {
                return alert('მომხმარებელი არ არის შესული სისტემაში.');
            }
            return alert('წარმოიშვა შეცდომა ცადეთ მოგვიანებით.');
        }
    };

    return (
        <div className="w-[800px] h-[600px]">
      <div className="flex w-full justify-between items-center mb-2">
        <h1 className="font-[boldest-font] text-lg">ლოკაციის შეცვლა</h1>
        <button onClick={() => setModal(null)}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      <div className="flex h-full flex-col items-start justify-start">
        <div className="h-[500px] border-b w-full m-0">
          <div className="h-full w-full m-0 border relative" ref={mapElement}>
            <div id="search_wrapper" className={`absolute max-w-[280px] ${isSearchOpen() && 'h-full opacity-[90%] overflow-y-auto'} right-0 z-50 bg-white`}>
              <Switch>
                <Match when={isSearchOpen()}>
                  <div id="inner_search_wrapper" className="flex gap-x-2 items-center py-2 px-3 border-b">
                    <form onSubmit={handleSearchLocation} className="flex w-full justify-between items-center">
                      <input
                        value={searchInputValue()}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        autoComplete="off"
                        type="text"
                        name="searchLocation"
                        className="w-full outline-none text-gray-800 font-[thin-font] font-bold"
                        placeholder="მოძებნე..."
                      />
                      <button type="submit">
                        <img src={SearchIcon} alt="Search" />
                      </button>
                    </form>
                    <button onClick={() => setIsSearchOpen(false)}>
                      <img src={CloseIcon} alt="Close" />
                    </button>
                  </div>
                  <div id="inner_search_wrapper" className="py-2 px-3">
                    <Switch>
                      <Match when={searching()}>
                        <p className="text-gray-800 text-center font-[thin-font] font-bold">იტვირთება...</p>
                      </Match>
                      <Match when={!searching() && !searchResults()}>
                        <p className="text-gray-800 text-center font-[thin-font] font-bold">მისამართები ვერ მოიძებნა.</p>
                      </Match>
                      <Match when={!searching() && searchResults()}>
                        <ul>
                          {searchResults().map((result, index) => (
                            <li
                              onClick={() => handleSidebarLocationChange(result)}
                              key={index}
                              className={`text-xs font-bold font-[thin-font] break-word p-1 cursor-pointer ${
                                markedLocation()?.place_id === result.place_id ? 'bg-gray-200' : 'hover:bg-gray-100'
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
                  <button id="search_btn" onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center p-2">
                    <img src={SearchIcon} alt="Search" />
                  </button>
                </Match>
              </Switch>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2 my-2">
          <Show when={message()}>
            <p className="text-red-500 text-xs font-[thin-font] break-word font-bold">{message()}</p>
          </Show>
          <div className="flex items-center gap-x-1">
            <p className="text-gray-800 font-[thin-font] font-bold">შერჩეული:</p>
            <p className="text-[12px] text-gray-800 font-[thin-font] break-word font-bold">{markedLocation()?.display_name}</p>
          </div>
          <button
            onClick={handleLocationSubmit}
            className="py-2 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
          >
            შეცვლა
          </button>
        </div>
      </div>
    </div>
);

}