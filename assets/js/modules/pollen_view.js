import MakeLoadingIndicator from './Loading_indicator.js'
import { ReadObject } from './localstorage_object_module.js'
import { GetStoredLocations } from "./map_module.js";
import updatePos from '../app.js'; 

let viewElement;
let locationList




export default function MakePollenView(latitude, longitude, HtmlElement) {
  viewElement = HtmlElement;
  MakeLoadingIndicator(viewElement)

 
  getPollenData(latitude, longitude)
}

function getPollenData(latitude, longitude) {
  /* console.log("get pollen data: "+position);
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude; */
  console.log('getting data');

  let myUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen&timezone=Europe%2FBerlin&domains=cams_europe`;

  let myData = fetch(myUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {

      recivedData(data)

    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });

  return myData
}


function recivedData(data) {


  let mySettings = ReadObject('userSettings')


  let myData = []

  if (mySettings.birch) {

    let cardData = {
      name: 'Birk',
      number: data.current.birch_pollen,
      icon: 'birk.png'
    }
    myData.push(cardData)
  }

  if (mySettings.alder) {
    let cardData = {
      name: 'Elm',
      number: data.current.alder_pollen,
      icon: 'elm.png'
    }
    myData.push(cardData)

  }

  if (mySettings.grass) {
    let cardData = {
      name: 'Græs',
      number: data.current.grass_pollen,
      icon: 'Græs.png'
    }
    myData.push(cardData)

  }

  if (mySettings.ragweed) {
    let cardData = {
      name: 'Bynke',
      number: data.current.ragweed_pollen,
      icon: 'bynke.png'
    }
    myData.push(cardData)
  }

  buildPollenData(myData)

}

function buildPollenData(cards) {

  let myHtml = "";
  viewElement.innerHTML=""

  cards.forEach(card => {

    let myCard = `<section class="pollencard">
    <section><img src="./assets/img/${card.icon}"></section>
    <section>
    <h3>${card.name}<h3><p>${card.number}</p>
    </section>
    </section>`

    myHtml += myCard
  });



  createLocationList()
  let MyPollenVievElement=document.createElement("section");
  MyPollenVievElement.classList.add('pollenView')
  MyPollenVievElement.innerHTML=myHtml

  viewElement.appendChild(MyPollenVievElement)
  viewElement.scrollTop = 0;
  

}


function createLocationList(){

  let storedLocations=GetStoredLocations();


   locationList = document.createElement("section");
  locationList.id = "locationList";
  locationList.classList.add("hidden");
  
  storedLocations.locations.map((location,index) => {
  
    let myLocationElement=document.createElement("div");
    myLocationElement.classList.add("location");
    myLocationElement.setAttribute("data-index",index);
    myLocationElement.addEventListener("click",LocationListCallback);
    myLocationElement.innerText+= `${location.info.shortName}`
    locationList.appendChild(myLocationElement);
   
  })
  viewElement.appendChild(locationList)

}


function LocationListCallback(e){
  let selectedIndex = e.target.getAttribute('data-index');
  let storedLocations=GetStoredLocations();
  let selectedLocation = storedLocations.locations[selectedIndex];

   updatePos(selectedLocation) 
  //MakePollenView(selectedLocation.lat,selectedLocation.lng,viewElement);
}


export function ToggleLocationList(){
  locationList.classList.toggle('hidden')
  
}