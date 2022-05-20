import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './Map.css';


mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Marker = ({ onClick, children, car ,selectedCarId}) => {
  const _onClick = (e) => {
    onClick(car.id);
  };
console.log('hrllp',selectedCarId,' --   ',car.id);
  return (
    <button onClick={_onClick} className="marker">
      <img height={"70px"} src='https://www.shareicon.net/data/512x512/2016/01/15/703693_gps_512x512.png'></img>
      {(selectedCarId==car.id) && <p>{car.driver.name}</p> }
      {children}
    </button>
  );
};

const Map = ({geoJson,lng,lat,zoom,selectedCarId,setselectedCarId}) => {
  const mapContainerRef = useRef(null);
  const [map,setmap]=useState(null)
  const [markers,setMarkers]=useState({})
  
  useEffect(() => {
    if(map){
      map.setCenter([lng, lat])
      map.setZoom(zoom)
    }
  }, [lat,lng,zoom]);  
  // Initialize map when component mounts

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    setmap(map)
    
    // Render custom marker components
    geoJson.cars.forEach((car) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      ref.current.id=car.id
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} car={car} setselectedCarId={setselectedCarId} selectedCarId={selectedCarId}/>,
        ref.current
      );
      
      // Create a Mapbox Marker at our new DOM node
      const marker=new mapboxgl.Marker(ref.current)
      marker.setLngLat(car.geometry.coordinates)
        .addTo(map);
      setMarkers((prev)=>({...prev,[car.id]:marker}))
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');


    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    map && geoJson.cars.forEach((car) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      ref.current.id=car.id
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} car={car} setselectedCarId={setselectedCarId} selectedCarId={selectedCarId}/>,
        ref.current
      );

      markers[car.id].remove()
      const marker=new mapboxgl.Marker(ref.current)
      marker.setLngLat(car.geometry.coordinates)
        .addTo(map);
      setMarkers((prev)=>({...prev,[car.id]:marker}))
    });
  },[selectedCarId])
  useEffect(()=>{
    geoJson.cars.forEach(car=>{
      
      markers[car.id] && markers[car.id].setLngLat(car.geometry.coordinates)
      .addTo(map);
   })
 },[geoJson,markers])

 
  const markerClicked = (id) => {
    setselectedCarId(id)
    const selectedCarElement=document.getElementById('car-'+id)
    selectedCarElement.scrollIntoView({behavior: "smooth", inline: "end",block:'center'})
  };

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Car Tracker : {geoJson.cars.length+' active cars'}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
