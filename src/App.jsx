import React, { useEffect, useRef, useState } from "react";
import Map from "./Map";
import "./App.css";
import InitialGeoJson from "./geoJson.json";

function App() {
  //Hold the Langitude of the map center
  const [lng, setLng] = useState(-87.65);
  //Hold the Latitude of the map center
  const [lat, setLat] = useState(41.84);
  const [zoom, setZoom] = useState(10);
  const [selectedCarId, setselectedCarId] = useState(InitialGeoJson.cars[0].id);

  //Hold the cars infos 
  const [geoJson, setGeoJson] = useState(InitialGeoJson);

  //Changes cars positions every 2 seconds based on the cars targets positions
  useEffect(() => {
    if (geoJson) {
      const interval = setInterval(() => {
        const newV = geoJson.cars.map((c) => {
          if(c.geometry.coordinates[0].toFixed(3)>c.geometry.target[0].toFixed(3)){
            c.geometry.coordinates = [
              c.geometry.coordinates[0] - 0.001,
              c.geometry.coordinates[1],
            ];
          }else if(c.geometry.coordinates[0].toFixed(3)<c.geometry.target[0].toFixed(3)){
            c.geometry.coordinates = [
              c.geometry.coordinates[0] + 0.001,
              c.geometry.coordinates[1],
            ];
          }

          if(c.geometry.coordinates[1].toFixed(3)>c.geometry.target[1].toFixed(3)){
            c.geometry.coordinates = [
              c.geometry.coordinates[0] ,
              c.geometry.coordinates[1]- 0.001,
            ];
          }else if(c.geometry.coordinates[1].toFixed(3)<c.geometry.target[1].toFixed(3)){
            c.geometry.coordinates = [
              c.geometry.coordinates[0],
              c.geometry.coordinates[1] + 0.001,
            ];
          }

          return c;
        });
        setGeoJson({ cars: newV });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);
  const onHoverHandler = (f) => {
    setselectedCarId(f.id);
    setZoom(10)
  };
  const changeViewPosition = (f) => {
    setselectedCarId(f.id);
    setLng(f.geometry.coordinates[0]);
    setLat(f.geometry.coordinates[1]);
    setZoom(12);
  };

  return (
    <div class="container">
      <div class="list-container">
        {geoJson.cars.map((f) => {
          return (
            <div
              key={f.id}
              id={"car-" + f.id}
              class={`car-item ${selectedCarId == f.id ? "highlighted" : ""}`}
              onMouseEnter={() => onHoverHandler(f)}
              onClick={()=>changeViewPosition(f)}
            >
              {f.driver.name}
              <br />
              <p>
                {f.geometry.coordinates[0].toFixed(6) + " , " + f.geometry.coordinates[1].toFixed(6)}
              </p>
            </div>
          );
        })}
      </div>
      <div class="outer-map-container">
        <Map
          geoJson={geoJson}
          selectedCarId={selectedCarId}
          setselectedCarId={setselectedCarId}
          lat={lat}
          lng={lng}
          setLat={setLat}
          setLng={setLng}
          zoom={zoom}
          setZoom={setZoom}
        />
      </div>
    </div>
  );
}

export default App;
