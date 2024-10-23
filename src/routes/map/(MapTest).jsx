import { onMount } from "solid-js";
import redLocationSVG from "../../svg-images/redlocation.svg";

const MapTest = () => {
  let map;
  let userMarker;

  const get_tiles = async (lat, lng, zoom) => {
    try {
      const response = await fetch(
        `http://localhost:1112/tiles/${lat}/${lng}/${zoom}.pbf`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        }
      );

      if (response.ok) {
        return await response.arrayBuffer();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMount(async () => {
    if (!navigator.geolocation) return;
    const L = (await import("leaflet")).default;
    import("leaflet/dist/leaflet.css");
    import("leaflet.vectorgrid");

    map = L.map("leafletmap", {
      crs: L.CRS.EPSG3857
    });
    const current_location = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            accuracy: pos.coords.accuracy,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }); // Resolve the promise with the location
        },
        (err) => {
          reject(err); // Reject the promise with the error
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });

    current_location
      .then(async (loc) => {
        map.setView([loc.latitude, loc.longitude], 16);
        console.log("hiii");
        const buff = await get_tiles(loc.latitude, loc.longitude, 16);
        // const blob = new Blob([buff], { type: "application/octet-stream" });
        // const url = URL.createObjectURL(blob);
        L.vectorGrid
          .protobuf(`http://localhost:1112/tiles/${loc.latitude}/${loc.longitude}/${16}.pbf`)
          .addTo(map);
      })
      .catch((err) => {
        console.log(err);
      });
    userMarker = L.marker([41.7151, 44.8271], {
      icon: L.icon({
        iconUrl: redLocationSVG,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Anchor point
      }),
    }).addTo(map);

    map.on("moveend", async () => {
      const zoom = map.getZoom();
      const center = map.getCenter();

      console.log(center.lat, center.lng, zoom);
      const buff = await get_tiles(center.lat, center.lng, zoom);
      // const blob = new Blob([buff], { type: "application/octet-stream" });
      // const url = URL.createObjectURL(blob);
      L.vectorGrid
        .protobuf(`http://localhost:1112/tiles/${center.lat}/${center.lng}/${zoom}.pbf`)
        .addTo(map);
    });
  });

  return (
    <div class="h-screen w-screen m-0 relative" id="leafletmap" ref={map}></div>
  );
};

export default MapTest;
