
import InitializeMap from './modules/map_module.js';
import { DestroyMap } from './modules/map_module.js';
import getLocationName from './modules/reverse_geolocation.js';
import MakePollenView from './modules/pollen_view.js';
import MakeSettingsView from './modules/settings_view.js'
import SaveObject from './modules/localstorage_object_module.js'
import { ReadObject } from './modules/localstorage_object_module.js'


let currentPositionData;
let myAppElement = document.getElementById("app");
let locationElement
let myViewElement


setUpApp()
getLocation();

// geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSucces);
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
}

function positionSucces(position) {

 
  displayMyPos(position.coords.latitude, position.coords.longitude)
}



function displayMyPos(latitude,longitude){

   getLocationName(latitude, longitude)
    .then((data) => {
      console.table(data);

      currentPositionData = {
        lat: latitude,
        long: longitude,
        info: data
      }

      if(data.address.hamlet){
        locationElement.innerText=data.address.hamlet
      }

      else if(data.address.village){
        locationElement.innerText=data.address.village
      }

      else if(data.address.town){
        locationElement.innerText=data.address.town
      }

      else if(data.address.city){
        locationElement.innerText=data.address.city
      }
      
      
      else if(data.address.suburb){
        locationElement.innerText=data.address.suburb
      }


      else if(data.address.municipality){
        locationElement.innerText=data.address.municipality
      }
     

    



      MakePollenView(latitude,longitude, myViewElement)
    })
}

// statics
function setUpApp() {

  let mySettings = ReadObject('userSettings')

  if (!mySettings) {
    let mySettings={
      birch: true,
      alder: true,
      grass: true,
      ragweed: true
    }

    SaveObject(mySettings,'userSettings')

  }
  MakeLandingPage()
}

function MakeLandingPage(){

  console.log("setup app");
  // header
 
  let myHeader=document.createElement('header');

  locationElement=document.createElement('h1');
  locationElement.innerText='Pollen Tracker'

myHeader.appendChild(locationElement)
myAppElement.appendChild(myHeader)


  //view section
  myViewElement = document.createElement('section');
  myViewElement.id = 'ViewSection';
  myAppElement.appendChild(myViewElement)
  

 // nav section
 let navList = document.createElement('nav');
 navList.id = 'nav';

 let navItems = ['home', 'settings', 'map'];

 navItems.forEach(item => {

   let navItem = document.createElement('img');

   navItem.src = `/assets/img/${item}.png`;

   navItem.setAttribute("data-path", item);
   navItem.onclick = navCallBack;
   navList.appendChild(navItem)

 })

 myAppElement.appendChild(navList)


}

// routing
function navCallBack(e) {
  let myNavItem = e.target.dataset.path
  switch (myNavItem) {

    case "map":
      console.log("map");
      if (currentPositionData) {
        InitializeMap(currentPositionData.lat, currentPositionData.long, myViewElement)
      }

      break;
    case "settings":
      console.log("settings");
      DestroyMap()
      MakeSettingsView(myViewElement)

      break;
    case "home":
      console.log("home");
      DestroyMap()
      if (currentPositionData) {
        MakePollenView(currentPositionData.lat, currentPositionData.long, myViewElement)
      }
      break;

    default:
      break;
  }
}



export default function updatePos(position){
console.log(position);
displayMyPos(position.lat,position.lng)
}