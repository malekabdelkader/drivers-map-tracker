import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Marker from './components/Marker';
import './Map.css';
import GeoJson from './models/geoJson.model';


mapboxgl.accessToken =
  'pk.eyJ1IjoibWFsZWs5NyIsImEiOiJjbDNlYXMyb2MwZ2puM21wcjE3ZGx6dHljIn0.khxYSNnUEhDCeR00mCl8EQ';



  interface MapProps{
    geoJson:GeoJson,
    lng:number,
    lat:number,
    zoom:number,
    selectedCarId:string,
    filter:string
    setFilter: React.Dispatch<React.SetStateAction<string>>
    setselectedCarId: React.Dispatch<React.SetStateAction<string>>
  }
  const Map:React.FC<MapProps> = ({setFilter,filter,geoJson,lng,lat,zoom,selectedCarId,setselectedCarId}) => {
    const mapContainerRef =useRef<HTMLDivElement | null>(null);
    const [map,setmap]=useState<mapboxgl.Map>()
    //Object that hold all the existant map markers 
    const [markers,setMarkers]=useState<{[e:string]:mapboxgl.Marker}>({})
    const ref = React.useRef<any>();

  //Update the map View when map lat,lng,zoom changes 
  useEffect(() => {
    if(map){
      map.setCenter([lng, lat])
      map.setZoom(zoom)
    }
  }, [lat,lng,zoom]);  


  // Initialize map when component mounts
  useEffect(() => {
    if(mapContainerRef.current){

    
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
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      ref.current.id=car.id
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker filter={filter} onClick={markerClicked} car={car} selectedCarId={selectedCarId}/>,
        ref.current
      );
      
      // Create a Mapbox Marker at our new DOM node
      const marker=new mapboxgl.Marker(ref.current)
      marker.setLngLat(car.geometry.coordinates)
        .addTo(map);

      //store the marke object to change it's coordinates if needed (car mouvement)
      setMarkers((prev)=>({...prev,[car.id]:marker}))
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');


    // Clean up on unmount
    return () => map.remove();
  }
}, []); // eslint-disable-line react-hooks/exhaustive-deps


  // we're not using React VirtualDom
  // the Dom will not update if a param ( selectedCarId in this case) changes
  // for each marker Element ,delete the old one , create another one with the new params (selectedCarId)
  useEffect(()=>{
    map && geoJson.cars.forEach((car) => {
      // Create a React ref
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      ref.current.id=car.id
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} filter={filter} car={car} selectedCarId={selectedCarId}/>,
        ref.current
      );
      //remove the old marker from the map
      markers[car.id].remove()

      //create new marker
      const marker=new mapboxgl.Marker(ref.current)
      marker.setLngLat(car.geometry.coordinates)
        .addTo(map);

      // set the new marker in the place of the old removed marker
      setMarkers((prev)=>({...prev,[car.id]:marker}))
    });
  },[selectedCarId,filter])


  useEffect(()=>{
    geoJson.cars.forEach(car=>{
      //change a marker position when a car coordiantes changes
      (map && markers[car.id])&& markers[car.id].setLngLat(car.geometry.coordinates)
      .addTo(map);
   })
 },[geoJson,markers])

 
  const markerClicked = (id:string) => {
    setFilter('')
    setselectedCarId(id)
    const selectedCarElement=document.getElementById('car-'+id)
    selectedCarElement?.scrollIntoView({behavior: "smooth", inline: "end",block:'center'})
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
