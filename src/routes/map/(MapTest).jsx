import { onMount } from "solid-js";
import redLocationSVG from "../../svg-images/redlocation.svg";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle, Point } from 'ol/geom';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { Feature } from "ol";
import { MVT } from 'ol/format'; // Import MVT format for vector tiles
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from 'ol/source/VectorTile';

const MapTest = () => {  
  onMount(async () => {
    let map
    let vtLayer
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        vtLayer = new VectorTileLayer({
          declutter: false,
          source: new VectorTileSource({
            format: new MVT(),
            url: `http://localhost:1112/tiles/{z}/{x}/{y}.pbf`,
          }),
          style: function (feature) {
            const linelayer = feature.get('linelayer');  // Get the 'linelayer' property
            const name = feature.get('name');            // Get the 'name' if available
            const geometryType = feature.getGeometry().getType(); // Get geometry type

            let fillColor = '#ffffff';  
            let strokeColor = '#000000';
            // Apply different colors for different layers
            if (linelayer === 'lines') {
                strokeColor = '#00ff00';
            } else if (linelayer === 'multipolygons') {
                fillColor = '#0000ff';
            }
            const baseStyle = {
              text: new Text({
                  text: name,
                  font: '12px Arial',
                  fill: new Fill({ color: '#000000' }),
                  stroke: new Stroke({ color: '#ffffff', width: 3 })
              })
          };      

            if (geometryType === 'Point') {
              // return new Style({
              //     image: new Circle({
              //         radius: 5,
              //         fill: new Fill({ color: fillColor }),
              //         stroke: new Stroke({ color: strokeColor, width: 2 })
              //     }),
              //     text: baseStyle.text
              // });
          } else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
            return new Style({
                  stroke: new Stroke({
                      color: strokeColor,
                      width: 2
                  }),
                  ...baseStyle
              });
          } else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
              return new Style({
                  fill: new Fill({
                      color: fillColor,
                  }),
                  stroke: new Stroke({
                      color: strokeColor,
                      width: 2
                  }),
                  ...baseStyle 
              });
          }
        }
    
        });
        map = new Map({
          target: 'map',
          layers: [vtLayer], // Add vector tile layer
          view: new View({
            center: fromLonLat([longitude, latitude]), // Center on user's location
            zoom: 14, // Set appropriate zoom level
            maxZoom: 18
          }),
        });
        const userMarker = new Point(fromLonLat([longitude, latitude]));
        const vectorSource = new VectorSource({
          features: [new Feature({
            geometry: userMarker,
          })],
        });

        const userMarkerLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Icon({
              src: redLocationSVG,
              scale: 0.05,
            }),
          }),
        });
          
        map.addLayer(userMarkerLayer)
      }, (err) => {
        console.log("Geolocation error:", err);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  });

  return (
    <div class="h-screen w-screen m-0 relative" id="map"></div>
  );
};

export default MapTest;
