"use server"
import mapnik from "mapnik"
import fs from "fs"

mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

const Map = async () => {
    try {
        const map = new mapnik.Map(800, 600)
        const zoom = 5
        const x = 12
        const y = 18
        const {west, south, east, north} = getBoundingBox(zoom,x,y)

        fs.readFile("../mapnik.xml", "utf-8", (err, content) => {
            try {
                if (err) throw new Error(err)
                    const modifiedXML = content.replace("get_vector_tile({{zoom}}, {{x}}, {{y}}))", `get_vector_tile(${zoom}, ${x}, ${y}))`)

                fs.writeFile("../mapnik.xml", modifiedXML, (err) => {
                    if (err) throw new Error(err)
                })
            } catch (error) {
                console.log(error)
            }
        })
        console.log({zoom: zoom, x, y})
        map.load("../mapnik.xml", {zoom: zoom, x, y}, async (err, map) => {
            if (err) throw new Error(err)
            
            const boundingBox = new mapnik.Box2(west, south, east, north) 
            map.zoomToBox(boundingBox);    
            const im = new mapnik.Image(800, 600);
            map.render(im, function(err,im) {
            if (err) throw err;
            im.encode('png', function(err,buffer) {
                if (err) throw err;
                fs.writeFile('map.png',buffer, function(err) {
                    if (err) throw err;
                        console.log('saved map image to map.png');
                    });
                });
            });
        })
    } catch (error) {
        console.log(error)
    }
}

function getBoundingBox(zoom, x, y) {
    const n = Math.pow(2, zoom);
    const lon_deg = (x / n) * 360.0 - 180.0; 
    const lat_deg = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * (180 / Math.PI);
    
    const west = lon_deg;
    const east = (x + 1) / n * 360.0 - 180.0;
    const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y) / n))) * (180 / Math.PI);
    const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * (180 / Math.PI);
    
    return {west, south, east, north}
}

Map()