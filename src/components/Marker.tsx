import React from "react";
import Car from "../models/car.model";

interface MarkerProps{
    onClick:(e:string)=>void
    car: Car
    selectedCarId:string
    filter:string
  }
  
const Marker:React.FC<MarkerProps> = ({filter, onClick,  car ,selectedCarId}) => {
    const _onClick = (e:any) => {
      onClick(car.id);
    };
    const showToolTipHandler=()=>{

      
      if((filter && car.driver.name.toLowerCase().includes(filter.toLowerCase())) || car.id==selectedCarId){
        return <p>Driver: {car.driver.name}</p>
      }
      }
    return (
      <button onClick={_onClick} className="marker">
        <img height={"70px"} src={'https://www.shareicon.net/data/512x512/2016/01/15/703693_gps_512x512.png'}></img>
        {showToolTipHandler()}
      </button>
    );
  };
  export default Marker;