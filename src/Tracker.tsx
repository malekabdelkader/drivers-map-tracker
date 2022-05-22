import React, { useEffect} from "react";
import Map from "./Map";
import "./Tracker.css";
import Car from "./models/car.model";
import  { storeDetails,mapAction } from './store/index'
import {useSelector} from 'react-redux'
import { useDispatch } from "react-redux";

function Tracker() {
  const {geoJson,selectedCarId,zoom,filter,lat,lng}=useSelector((state:storeDetails)=>state)
  const dispatch = useDispatch()


  //Changes cars positions every 2 seconds based on the cars targets positions
  useEffect(() => {
    if (geoJson) {
      const interval = setInterval(() => {
        dispatch(mapAction.moveCarsPositions(null))
        
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [dispatch,geoJson]);
  
  const applyFilterHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
    dispatch(mapAction.changeFilter(e.currentTarget.value))

  }

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
          onChange={applyFilterHandler}
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
                onMouseEnter={() =>dispatch(mapAction.showSlectedCarToolTipHandler(f))}
                onClick={() => dispatch(mapAction.changeMapViewPosition(f))}
                className={`driverboard__profile ${
                  selectedCarId === f.id ? "highlighted" : ""
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
          lat={lat}
          lng={lng}
          filter={filter}
          zoom={zoom}
        />
      </div>
    </div>
  );
}

export default Tracker;
