//import getLocationName from './reverse_geolocation';
/*
CSS and Script must be loaded in this order in HTML
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
*/
import updatePos from '../app.js'; 

import GetLocationInfo from './reverse_geolocation.js';

export let storedLocations
export let currentLocation
let newLocation

let map = false
let PopUp = false;
let popUpChords;
let mapElement;


export default function InitializeMap(latitude, longitude, myElement) {

  if (!map) {
    mapElement = document.createElement('section')
    mapElement.id = 'map'
    myElement.innerHTML = ""
    myElement.appendChild(mapElement)

GetStoredLocations()

    popUpChords = {
      lat: latitude,
      lng: longitude
    }

    GetLocationInfo(latitude, longitude)
    .then((data) => {
      currentLocation={
        lat: latitude,
        lng: longitude,
        info:data
  
      }

      console.table(currentLocation)
      makeMap(latitude, longitude)

    })
  }
}



function makeMap(latitude, longitude) {
  if (!map) {


    let mapOptions = {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: false
   }

   
    map = new L.map('map', mapOptions);

   
    L.marker([latitude, longitude]).addTo(map).bindPopup(currentLocation.info.shortName);

    map.on("click", onMapClick);

    map.on("popupclose", PopUpCancled);
   
    

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //console.log(map.closePopupOnClick);
  }

}



export function DestroyMap() {

  if (map) {
   
    map.remove()
    mapElement.remove()
    map = false
  }
}



function onMapClick(e) {
  //moveMapToMarker(10,10);

  console.log('mapClick'+e.latlng.lat);
 
  if (!PopUp) {

    GetLocationInfo(e.latlng.lat, e.latlng.lng)
  .then((data) => {

    newLocation={
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      info:data

    }

    console.table(newLocation);

    createPopUp(e.latlng,newLocation.info.shortName)

  })

  } else {
    map.closePopup(PopUp);
    PopUp = false
  }

}

function createPopUp(latlng,location) {


  console.log('createPopUp: '+latlng,location);

  let myContent = document.createElement("section");

  myContent.innerHTML =`<h3>${location}</h3><p>do you want to save this position</p>`


  let myButton = document.createElement("button");
  myButton.innerText = "Save";

  myButton.onclick = MapPopupCallBack;
  
  myContent.appendChild(myButton)

  PopUp = L.popup(latlng, { content: myContent }).openOn(map);

  //var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

function PopUpClose(e) {
 console.log('popupClose');
  if (PopUp) {
    map.closePopup(PopUp);
  
  }
  PopUp = false
}


function PopUpCancled(){
  console.log('popupCancled');

  PopUp = false;
}



function MapPopupCallBack() {
  console.log("pop up callback");



    currentLocation=newLocation

    StoreLocation(currentLocation)
    L.marker([currentLocation.lat, currentLocation.lng]).addTo(map).bindPopup(`${currentLocation.info.shortName}`);
  
  

    PopUpClose()
    DestroyMap()

    // do stuff at user code
    updatePos(currentLocation)



}


function moveMapToMarker(latitude, longitude) {
  latitude = 57.35;
  longitude = 9.950001;

  map.setView([latitude, longitude], 13);


}



// stored Locations

export function GetStoredLocations() {

  storedLocations = ReadObject('storedLocations');
  if (storedLocations) {
  
    return storedLocations
  } else {
    storedLocations = [];
    SaveObject(storedLocations, 'storedLocations');
  }
}



export function StoreLocation(newLocation) {
  
  

  storedLocations = ReadObject('storedLocations');

  console.log('Stored Locations:', storedLocations);
  let Found=false
  storedLocations.locations.forEach((location)=>{



if(newLocation.info.shortName==location.info.shortName){
  Found=true
}
  })

  if(!Found){
  storedLocations.locations.push(newLocation);
  SaveObject(storedLocations, 'storedLocations');
  }
}

export function DeleteStoredLocation(index){

  storedLocations.locations.splice(index,1);
  SaveObject(storedLocations,'storedLocations');
}

// local Storage

function SaveObject(basketData, itemName) {
  let mySerializedData = JSON.stringify(basketData)
  localStorage.setItem(itemName, mySerializedData)
}


 function ReadObject(itemName) {

  let mybasketstring = localStorage.getItem(itemName)
  // @ts-ignore
  let myBasket = JSON.parse(mybasketstring)
  return myBasket
}


