import React, { useEffect, useRef, useState } from "react";
import Map from "./Map";
import "./App.css";
import InitialGeoJson from "./geoJson";
import GeoJson from "./models/geoJson.model";
import Car from "./models/car.model";

function App() {
  //Hold the Langitude of the map center
  const [lng, setLng] = useState(-87.65);
  //Hold the Latitude of the map center
  const [lat, setLat] = useState(41.84);
  const [zoom, setZoom] = useState(10);
  const [selectedCarId, setselectedCarId] = useState(InitialGeoJson.cars[0].id);
  const [filter, setFilter] = useState<string>("");

  //Hold the cars infos
  const [geoJson, setGeoJson] = useState<GeoJson>(InitialGeoJson);

  //Changes cars positions every 2 seconds based on the cars targets positions
  useEffect(() => {
    if (geoJson) {
      const interval = setInterval(() => {
        const newV = geoJson.cars.map((c) => {
          if (
            c.geometry.coordinates[0].toFixed(3) >
            c.geometry.target[0].toFixed(3)
          ) {
            c.geometry.coordinates = [
              c.geometry.coordinates[0] - 0.001,
              c.geometry.coordinates[1],
            ];
          } else if (
            c.geometry.coordinates[0].toFixed(3) <
            c.geometry.target[0].toFixed(3)
          ) {
            c.geometry.coordinates = [
              c.geometry.coordinates[0] + 0.001,
              c.geometry.coordinates[1],
            ];
          }

          if (
            c.geometry.coordinates[1].toFixed(3) >
            c.geometry.target[1].toFixed(3)
          ) {
            c.geometry.coordinates = [
              c.geometry.coordinates[0],
              c.geometry.coordinates[1] - 0.001,
            ];
          } else if (
            c.geometry.coordinates[1].toFixed(3) <
            c.geometry.target[1].toFixed(3)
          ) {
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
  const onHoverHandler = (f: Car) => {
    setselectedCarId(f.id);
    setZoom(10);
  };
  const changeViewPosition = (f: Car) => {
    setselectedCarId(f.id);
    setLng(f.geometry.coordinates[0]);
    setLat(f.geometry.coordinates[1]);
    setZoom(12);
  };

  return (
    <div className="container">
      <div className="driverboard">
        <header>
          <h1 className="driverboard__title">
            <span className="driverboard__title--top">Car Tracker</span>
            <span className="driverboard__title--bottom">
              track your company's cars 24/7

            </span>
          <input
          type={"search"}
          className="driverboard__search-bar"
          placeholder="Search Driver Name"
          value={filter}
          onChange={(e) => {
            setFilter(e.currentTarget.value.toLowerCase());
            setselectedCarId("");
            setZoom(10)
          }}
        />
          </h1>
        </header>
       
        <main className="driverboard__profiles">
          {geoJson.cars
            .filter((c) => c.driver.name.toLowerCase().includes(filter))
            .map((f: Car) => (
              <article
                key={f.id}
                id={"car-" + f.id}
                onMouseEnter={() => onHoverHandler(f)}
                onClick={() => changeViewPosition(f)}
                className={`driverboard__profile ${
                  selectedCarId == f.id ? "highlighted" : ""
                }`}
              >
                <img
                  src={`https://avatars.dicebear.com/api/open-peeps/${f.driver.name}.svg`}
                  alt={f.driver.name}
                  className="driverboard__picture"
                />
                <span className="driverboard__name">{f.driver.name}</span>
                <span className="driverboard__value">
                  {" "}
                  {f.geometry.coordinates[0].toFixed(4)}
                  <span>Lat</span>
                  <br />
                  {f.geometry.coordinates[1].toFixed(4)}
                  <span>Lng</span>
                </span>
              </article>
            ))}
        </main>
      </div>
      <div className="outer-map-container">
        <Map
          geoJson={geoJson}
          selectedCarId={selectedCarId}
          setselectedCarId={setselectedCarId}
          lat={lat}
          lng={lng}
          filter={filter}
          zoom={zoom}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
}

export default App;
