import { configureStore,createSlice } from "@reduxjs/toolkit";
import geoJson from "../geoJson";
import GeoJson from "../models/geoJson.model";
export interface storeDetails{
    lng:number;
    lat:number;
    zoom:number,
    filter:string;
    selectedCarId:string
    geoJson:GeoJson
}
const initialMapState={
    geoJson:geoJson,
    lat:41.84,
    lng:-87.65,
    zoom:10,
    filter:'',
    selectedCarId:geoJson.cars[0].id
}
const MapReducer =createSlice({
    name:'map',
    initialState:initialMapState,
    reducers:{
        moveCarsPositions(state,action){
             state.geoJson.cars.forEach((c) => {
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
                });
            },
        changeMapViewPosition (state,action){
            state.zoom=initialMapState.zoom
            state.selectedCarId=action.payload.id
            state.lng=action.payload.geometry.coordinates[0];
            state.lat=action.payload.geometry.coordinates[1];
        },
        showSlectedCarToolTipHandler(state,action){
            state.zoom=10;
            state.selectedCarId=action.payload.id
        },
        changeSelectedCar(state,action){
            state.filter=''
            state.selectedCarId=action.payload
        },
        changeFilter(state,action){
          state.filter=action.payload
          state.selectedCarId=''
          //zoom back to view all markers
          state.zoom=10
        }
        /*incrementItems (state,action){
            let index=-1
            state.items.forEach((item)=>{
                if(item.title===action.payload){
                    console.log(true)
                    index= state.items.indexOf(item)
                }
            })
            if(state.items[index].total>1){
                state.items[index].quantity++
                state.totalprice+=state.items[index].price
                state.items[index].total--
            }
        },
        decrementItems (state,action){
            let index=-1
            state.items.forEach((item)=>{
                if(item.title===action.payload){
                    console.log(true)
                    index= state.items.indexOf(item)
                }
            })
            
            if(state.items[index].quantity>0){
                state.items[index].quantity--
                state.items[index].total++
                state.totalprice-=state.items[index].price
            }
        },
        togglecarte (state){
            state.showcarte = !state.showcarte
        }*/
    }
})
const store=configureStore({
    reducer:MapReducer.reducer
})
export const mapAction=MapReducer.actions
export default store