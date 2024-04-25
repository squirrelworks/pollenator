//import getLocationName from './reverse_geolocation';
/*
CSS and Script must be loaded in this order in HTML
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
*/
import updatePos from '../app.js';
let map = false
let PopUp = false;
let popUpChords;
let mapElement;

export default function InitializeMap(latitude, longitude, myElement) {
 console.log('i am in initialize map: '+map);
  if (!map) {
    mapElement = document.createElement('section')
    mapElement.id = 'map'
    myElement.innerHTML = ""
    myElement.appendChild(mapElement)

    popUpChords = {
      lat: latitude,
      lng: longitude
    }

    makeMap(latitude, longitude)
  }
}



function makeMap(latitude, longitude) {
  if (!map) {
    map = L.map("map").setView([latitude, longitude], 13);

    var marker = L.marker([latitude, longitude]).addTo(map);

    map.on("click", onMapClick);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

  if (!PopUp) {

    createPopUp(e.latlng)
  } else {
    map.closePopup(PopUp);
    PopUp = false
  }

}

function createPopUp(latlng) {
  let myContent = document.createElement("section");

  myContent.innerHTML = '<h3>position marker</h3><p>do you want to save this position</p>'


  let myButton = document.createElement("button");
  myButton.innerText = "Save";

  myButton.onclick = MapPopupCallBack;
  popUpChords = {
    lat: latlng.lat,
    lng: latlng.lng
  }

  myContent.appendChild(myButton)

  PopUp = L.popup(latlng, { content: myContent }).openOn(map);
  //var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

function PopUpClose(e) {
 
  if (PopUp) {
    map.closePopup(PopUp);
    PopUp = false
  }
}


function MapPopupCallBack() {
  console.log("pop up callback");
  
  L.marker([popUpChords.lat, popUpChords.lng]).addTo(map).bindPopup("Saved Location");
   
  PopUpClose()
  DestroyMap()
  updatePos(popUpChords)

}


function moveMapToMarker(latitude, longitude) {
  latitude = 57.35;
  longitude = 9.950001;

  map.setView([latitude, longitude], 13);


}