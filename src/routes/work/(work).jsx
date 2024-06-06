import { Footer } from "~/Components/Footer"
import { Header } from "~/Components/Header"
import { Jobs } from "./components/Jobs"
import {Map} from "./components/Map"
import { SearchWork } from "./components/SearchWork"
import { createSignal, onCleanup, onMount } from "solid-js"
import * as gmapsLoader from '@googlemaps/js-api-loader';
const { Loader } = gmapsLoader;
import jobLocationIcon from "../../../public/svg-images/svgexport-11.svg"

const Work = () => {
    const [userLocation, setUserLocation] = createSignal({ lat: 41.6938, lng: 44.8015 });
    const [map, setMap] = createSignal(null);
    const [marker, setMarker] = createSignal(null)

    const updateUserLocation = (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setUserLocation(newLocation);
        if (map()) {
            map().setCenter(newLocation);
        }
        if (marker()) {
            marker().setPosition(newLocation);
        }
    };

    const findLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updateUserLocation, (err) => {
                alert(err.message);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    onMount(async () => {
        let map
        const loader = new Loader({
            apiKey: "AIzaSyBSOLgaU_88VYM0eVwECXfHt7BCdtinboM",
            version: "weekly",
            language: "ka"
        });

        const google = await loader.load();
        const { event, Map, Size, InfoWindow, Marker } = google.maps;

        const mapInstance = new Map(document.getElementById("map"), {
            center: userLocation(),
            zoom: 12,
            streetViewControl: false,
            restriction: {
                latLngBounds: {
                    north: 44.0,   // slightly more to the north
                    south: 40.5,   // slightly more to the south
                    east: 47.5,    // slightly more to the east
                    west: 39.0,    // slightly more to the west
                },
                strictBounds: true,
            },
        });
    
        const markerInstance = new Marker({
            map: mapInstance,
            position: { lat: 41.6938, lng: 44.8015 }
        });
    
        setMap(mapInstance);
        setMarker(markerInstance);
    
        const locations = [
            { position: { lat: 41.7151, lng: 44.8271 }, title: "Tbilisi 1", icon: jobLocationIcon },
            { position: { lat: 41.7251, lng: 44.8371 }, title: "Tbilisi 2", icon: jobLocationIcon },
            { position: { lat: 41.7351, lng: 44.8471 }, title: "Tbilisi 3", icon: jobLocationIcon },
            { position: { lat: 41.7451, lng: 44.8571 }, title: "Tbilisi 4", icon: jobLocationIcon },
            { position: { lat: 41.7551, lng: 44.8671 }, title: "Tbilisi 5", icon: jobLocationIcon },
            { position: { lat: 45.7551, lng: 43.8671 }, title: "Tbilisi 5", icon: jobLocationIcon },
        ];
    
        findLocation();
        locations.forEach(loc => {
            const infowindow = new InfoWindow({
                content: `<div>${loc.title}</div>`,
                ariaLabel: loc.title,
            });

            const job_mark = new Marker({
                position: loc.position,
                map: mapInstance,
                title: loc.title,
                icon: {
                    url: loc.icon,
                    scaledSize: new Size(40, 40),
                },
            });

            job_mark.addListener("click", () => {
                infowindow.open({
                    anchor: job_mark,
                    map,
                    shouldFocus: false,
                });
            });
        });


        onCleanup(() => {
            if (map) {
                event.clearInstanceListeners(map);
            }
        });
    });

    return <>
        <Header></Header>
        <div class="w-[90%] mx-auto">
            <SearchWork></SearchWork>
                <section class="h-[650px] overflow-hidden flex mt-3 border-2  rounded-l-[16px]">
                    <Jobs findLocation={findLocation} marker={marker} map={map}></Jobs>
                    <Map></Map>
                </section>
            <Footer></Footer>
        </div>
    </>
}

export default Work