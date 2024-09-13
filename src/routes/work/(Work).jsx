import { Footer } from "~/Components/Footer";
import { Header } from "~/Components/Header";
import { Jobs } from "./components/Jobs";
import { SearchWork } from "./components/SearchWork";
import { createSignal, onMount } from "solid-js";
import "ol/ol.css";
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { Map, View } from 'ol';
import Feature from 'ol/Feature';
import { fromLonLat, transformExtent } from 'ol/proj';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import Geolocation from 'ol/Geolocation';
import SearchIcon from "../../../public/svg-images/svgexport-5.svg";
import CloseIcon from "../../../public/svg-images/svgexport-12.svg";
import JobLocationIcon from "../../../public/svg-images/job.svg"; // Adjust path as needed

const Work = () => {
    const [location, setLocation] = createSignal({ lat: 41.804981, lon: 44.827554 });
    const [message, setMessage] = createSignal("");
    const [searchInputValue, setSearchInputValue] = createSignal("");
    const [markedLocation, setMarkedLocation] = createSignal(null);
    const [submitted, setSubmitted] = createSignal(false);

    let map;
    let geolocation;
    let isGeolocationActive = true;

    const fetchLocation = async (lng, lat) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lon=${lng}&lat=${lat}&accept-language=ka`);
            if (response.ok) {
                const data = await response.json();
                setMarkedLocation(data);
            } else {
                setMessage('Error fetching location.');
            }
        } catch (error) {
            setMessage('Unexpected error, please try again.');
        }
    };

    onMount(() => {
        const georgiaExtent = [38.5, 40.9, 46.8, 44.5];
        const view = new View({
            zoom: 12,
            extent: transformExtent(georgiaExtent, 'EPSG:4326', 'EPSG:3857'),
            center: fromLonLat([location().lon, location().lat])
        });

        map = new Map({
            target: 'map', // Ensure this matches the ID in your HTML
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                // Add vector layer for user location and job locations
                new VectorLayer({
                    source: new VectorSource({
                        features: []
                    }),
                    name: 'jobLocations'
                }),
            ],
            view: view
        });

        geolocation = new Geolocation({
            tracking: true,
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: view.getProjection()
        });

        geolocation.on('change:position', async () => {
            if (isGeolocationActive) {
                const coordinates = geolocation.getPosition();
                userLocationFeature.setGeometry(coordinates ? new Point(coordinates) : null);
                map.getView().setCenter(coordinates);
                const [lng, lat] = fromLonLat(coordinates);
                await fetchLocation(lng, lat);
            }
        });

        // Add markers for job locations
        const jobLocations = [
            { position: [44.8271, 41.7151], title: "Job Location 1" },
            { position: [44.8371, 41.7251], title: "Job Location 2" },
            { position: [44.8471, 41.7351], title: "Job Location 3" },
            { position: [44.8571, 41.7451], title: "Job Location 4" },
            { position: [44.8671, 41.7551], title: "Job Location 5" }
        ];

        const jobSource = new VectorSource();
        const jobLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'jobLocations');
        if (jobLayer) {
            jobLayer.setSource(jobSource);
        }

        jobLocations.forEach(loc => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(loc.position)),
                name: loc.title
            });
            const jobStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 40],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: JobLocationIcon, // Adjust path as needed
                    scale: 1.4,
                })
            });
            feature.setStyle(jobStyle);
            jobSource.addFeature(feature);
        });
    });

    return (
        <>
            <Header />
            <div class="w-[90%] mx-auto">
                <SearchWork />
                <section class="h-[800px] overflow-hidden flex mt-3 border-2 rounded-l-[16px]">
                    <Jobs />
                    <div class="h-[800px] w-[800px] m-0 relative" id="map">
                    </div>
                </section>
                <Footer />
            </div>
        </>
    );
};

export default Work;
