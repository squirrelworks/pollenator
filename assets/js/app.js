
import InitializeMap from './modules/map_module.js';
import { DestroyMap } from './modules/map_module.js';
import getLocationName from './modules/reverse_geolocation.js';
import MakePollenView from './modules/pollen_view.js';
import MakeSettingsView from './modules/settings_view.js'
import SaveObject from './modules/localstorage_object_module.js'
import { ReadObject } from './modules/localstorage_object_module.js'


let currentPositionData;
let myAppElement = document.getElementById("app");
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

  getLocationName(position.coords.latitude, position.coords.longitude)
    .then((data) => {
      //console.log('pos succes: ' + data.display_name);

      currentPositionData = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        info: data
      }

      MakePollenView(position.coords.latitude, position.coords.longitude, myViewElement)
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
  myAppElement.innerHTML = '<header><h1>Pollen Tracker</h1></header>';


 


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


