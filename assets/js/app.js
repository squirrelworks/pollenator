import InitializeMap from "./modules/map_module.js";
import { DestroyMap, currentLocation } from "./modules/map_module.js";

import GetLocationInfo from "./modules/reverse_geolocation.js";
import MakePollenView from "./modules/pollen_view.js";
import MakeSettingsView from "./modules/settings_view.js";
import SaveObject from "./modules/localstorage_object_module.js";
import { ReadObject } from "./modules/localstorage_object_module.js";

let storedLocations;
let currentPositionData;

let myAppElement = document.getElementById("app");
let locationElement;
let myViewElement;

// pwa serviceworker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

setUpApp();

// geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSucces);
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
}

function positionSucces(position) {
 

  GetLocationInfo(position.coords.latitude, position.coords.longitude).then(
    (data) => {
      currentPositionData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        info: data
      };
      displayMyPos();
    }
  );
}

function displayMyPos() {
 

  locationElement.innerText = currentPositionData.info.shortName;

  storedLocations.locations.push(currentPositionData);
  SaveObject(storedLocations, "storedLocations");

  

  MakePollenView(currentPositionData.lat,currentPositionData.lng,myViewElement);
}



// statics
function setUpApp() {
  console.log("setupApp");

  let mySettings = ReadObject("userSettings");

  if (!mySettings) {
    let mySettings = {
      birch: true,
      alder: true,
      grass: true,
      ragweed: true,
    };

    SaveObject(mySettings, "userSettings");
  }

  storedLocations = ReadObject("storedLocations");

  if (!storedLocations) {
    storedLocations = {
      locations: [],
    };
  }

  console.log("storedLocations: " + storedLocations);

  SaveObject(storedLocations, "storedLocations");

  getLocation();
  MakeLandingPage();
}

function MakeLandingPage() {
  console.log("setup app");
  // header

  let myHeader = document.createElement("header");

  locationElement = document.createElement("h1");
  locationElement.innerHTML = "Loading";

  myHeader.appendChild(locationElement);
  myAppElement.appendChild(myHeader);

  //view section
  myViewElement = document.createElement("section");
  myViewElement.id = "ViewSection";
  myAppElement.appendChild(myViewElement);

  // nav section
  let navList = document.createElement("nav");
  navList.id = "nav";

  let navItems = ["home", "map", "settings"];

  navItems.forEach((item) => {
    let navItem = document.createElement("img");

    navItem.src = `/assets/img/${item}.png`;

    navItem.setAttribute("data-path", item);
    navItem.onclick = navCallBack;
    navList.appendChild(navItem);
  });

  myAppElement.appendChild(navList);
}

// routing
function navCallBack(e) {
  let myNavItem = e.target.dataset.path;
  switch (myNavItem) {
    case "map":
      console.log("map");
      //myLocationName='Kort'
      if (currentPositionData) {
        InitializeMap(
          currentPositionData.lat,
          currentPositionData.lng,
          myViewElement
        );
      }

      break;
    case "settings":
      console.log("settings");
      // myLocationName='Settings'
      DestroyMap();
      MakeSettingsView(myViewElement);

      break;
    case "home":
      console.log("home");

      DestroyMap();
      if (currentPositionData) {
        displayMyPos(currentPositionData.lat, currentPositionData.lng);
        MakePollenView(
          currentPositionData.lat,
          currentPositionData.lng,
          myViewElement
        );
      }
      break;

    default:
      break;
  }
}

export default function updatePos(locationData) {
 

  currentPositionData = locationData;

  displayMyPos();
}
