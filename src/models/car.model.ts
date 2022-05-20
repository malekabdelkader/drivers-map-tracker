export default interface Car  {
    id:string
    driver: Driver
    geometry:Geometry
  }

  
 export interface Driver{
     name:string
 } 
 export interface Geometry{
    coordinates: [number,number]
    target:[number,number]
} 