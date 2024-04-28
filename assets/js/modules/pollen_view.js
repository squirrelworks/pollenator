import MakeLoadingIndicator from './Loading_indicator.js'
import { ReadObject } from './localstorage_object_module.js'
import { GetStoredLocations } from "./map_module.js";
import updatePos from '../app.js'; 

let viewElement;
let locationList






export default function MakePollenView(latitude, longitude, HtmlElement) {
  viewElement = HtmlElement;
 
  
 
 // console.log(pollenIndicator);

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
  let pollenIndicator=getSvgIndicator()

  cards.forEach(card => {

   /*  let myCard = `<section class="pollencard">
    <section><img src="./assets/img/${card.icon}"></section>
    <section>
    <h3>${card.name}<h3><p>${card.number}</p>
    </section>
    </section>`

    myHtml += myCard */
let myCard=document.createElement("section");

myCard.classList.add("pollencard");

myCard.innerHTML=pollenIndicator
myCard.querySelector(`[id='name']`).textContent=card.name
myCard.querySelector(`[id='number']`).textContent=card.number

console.log(myCard.querySelector(`[id='${card.name}']`).style.visibility);

myCard.querySelector(`[id='${card.name}']`).style.visibility='visible'

let mySeverity='moderate'

if(card.number>100){
  mySeverity='high'
} else if(card.number>50){
  mySeverity='moderate'
} else {
  mySeverity='low'

}


myCard.querySelector(`[id='${mySeverity}']`).style.visibility='visible'




//console.log(document.querySelector(`#${card.name}`));



//document.getElementById(card.name).style.display="block";



viewElement.appendChild(myCard)

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

function getSvgIndicator() {
  return `<?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 28.4.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" id="pollenIndicator" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
     y="0px" width="600px" height="800px" viewBox="0 0 600 800" enable-background="new 0 0 600 800" xml:space="preserve">
  <path id="high" visibility="hidden" fill="#FF0000" d="M207,564.5c-2.1,0-4.3-0.5-6.3-1.4c-40-18.6-73.8-48.1-97.9-85.2C78,439.8,64.9,395.6,64.9,350
    c0-62.8,24.4-121.8,68.8-166.2c44.4-44.4,103.4-68.8,166.2-68.8c62.8,0,121.8,24.4,166.2,68.8c44.4,44.4,68.8,103.4,68.8,166.2
    c0,45.2-12.9,89.1-37.2,126.9c-23.7,36.8-57.1,66.3-96.5,85.2c-7.5,3.6-16.4,0.4-20-7.1c-3.6-7.5-0.4-16.4,7.1-20
    c70.9-33.9,116.6-106.5,116.6-185c0-113-92-205-205-205s-205,92-205,205c0,79.3,46.5,152.3,118.5,185.9c7.5,3.5,10.8,12.4,7.3,19.9
    C218.1,561.3,212.7,564.5,207,564.5z"/>
  <path id="moderate" visibility="hidden" fill="#FFBC00" d="M207,564.5c-2.1,0-4.3-0.5-6.3-1.4c-40-18.6-73.8-48.1-97.9-85.2
    C78,439.8,64.9,395.6,64.9,350c0-62.8,24.4-121.8,68.8-166.2c44.4-44.4,103.4-68.8,166.2-68.8c61.5,0,119.6,23.6,163.7,66.4
    c5.9,5.8,6.1,15.3,0.3,21.2c-5.8,5.9-15.3,6.1-21.2,0.3c-38.5-37.4-89.2-58-142.8-58c-113,0-205,92-205,205
    c0,79.3,46.5,152.3,118.5,185.9c7.5,3.5,10.8,12.4,7.3,19.9C218.1,561.3,212.7,564.5,207,564.5z"/>
  <path id="low" visibility="hidden" fill="#439B15" d="M207,564.5c-2.1,0-4.3-0.5-6.3-1.4c-40-18.6-73.8-48.1-97.9-85.2C78,439.8,64.9,395.6,64.9,350
    c0-61.7,23.8-120,66.9-164.2c5.8-5.9,15.3-6,21.2-0.2c5.9,5.8,6,15.3,0.2,21.2c-37.6,38.5-58.3,89.4-58.3,143.2
    c0,79.3,46.5,152.3,118.5,185.9c7.5,3.5,10.8,12.4,7.3,19.9C218.1,561.3,212.7,564.5,207,564.5z"/>
  <path id="Birk" visibility="hidden" fill-rule="evenodd" clip-rule="evenodd" fill="#757575" d="M296.2,505.6c0.6,1.7,1.4,3.4,2.4,4.9
    c1.3,1.8,3.3,2.9,5.5,3.1c1.2,0.1,2.5,0.1,3.7-0.1c-0.4,4,0.1,8,1.4,11.8c0.7,1.5,2.5,2.1,4,1.4c0.2-0.1,0.4-0.2,0.6-0.4l2.5-2.3
    c0.1,4.5,1.5,8.9,4.1,12.6c1.2,1.3,3.2,1.3,4.5,0.1c0.1-0.1,0.1-0.1,0.2-0.2l1.3-2c0.5,3.6,0.5,7.3-0.1,11c-0.1,1.1,0.4,2.3,1.4,2.9
    c1,0.5,2.3,0.4,3.2-0.2l3.4-2.6c-0.3,4.5-1.1,9-2.5,13.4c-0.3,1,0,2.1,0.8,2.9c0.8,0.7,1.9,1,2.9,0.6l4.5-1.6
    c-2,5-5.7,10.5-8.3,16.4c-0.5,1.5,0.3,3.2,1.8,3.7c0.3,0.1,0.7,0.2,1,0.2l0.1,0c-2.9,3.1-6.3,5.6-10.1,7.3c-4.4,1.6-10.4,1.9-19.5,2
    l-1-14.4l21.7-9.3c1.4-0.6,2.1-2.2,1.5-3.6c-0.7-1.4-2.3-2-3.7-1.5l-20,8.5l-1-13.7l13.4-5.9c1.5-0.6,2.1-2.3,1.5-3.8
    c-0.7-1.4-2.5-2-3.9-1.4l-11.5,5l-1.5-21.2c-0.2-1.6-1.6-2.7-3.1-2.6c-1.5,0.2-2.6,1.4-2.6,3l1.5,21.2l-12.1-3.4
    c-1.7-0.3-3.3,0.8-3.6,2.5c-0.1,1.3,0.7,2.5,2,2.9l14.1,3.9l1,13.7l-21-5.7c-1.7-0.3-3.3,0.8-3.6,2.5c-0.1,1.4,0.9,2.6,2.2,2.9
    l22.8,6.2l1,14.4c-9,1.2-14.9,1.8-19.5,0.8c-4.1-1.1-7.8-3.1-10.9-5.9c1.8-0.5,2.9-2.3,2.4-4.1c0,0,0-0.1,0-0.1
    c-3.4-5.4-7.8-10.4-10.5-15l4.7,1c1,0.2,2.1-0.2,2.8-1c0.7-0.8,0.8-2,0.4-3c-2-4.1-3.5-8.4-4.4-12.9l3.7,2.1c1,0.5,2.3,0.4,3.2-0.2
    c0.9-0.7,1.3-1.9,1-3c-1-3.5-1.6-7.2-1.6-10.8l1.6,1.8c1.2,1.1,3.1,1.1,4.3-0.1c0.1-0.1,0.3-0.3,0.4-0.5c1.9-4.1,2.7-8.5,2.3-13
    l2.8,1.9c1.5,0.9,3.3,0.4,4.2-1.1c0.1-0.2,0.2-0.3,0.2-0.5c0.8-3.9,0.8-8-0.2-11.9c1.2,0.1,2.5-0.1,3.7-0.4c2.1-0.6,3.9-2,5-3.9
    C295.3,508.9,295.8,507.3,296.2,505.6z M295.1,492.7c-1.2,0.1-2.2,1-2.5,2.2c-0.8,4.5-1.9,8.9-3.3,13.2c-0.3,0.6-0.8,1.1-1.5,1.2
    c-1.8,0.3-3.6,0.3-5.4,0c-1.7-0.1-3.1,1.2-3.2,2.8c0,0.3,0,0.6,0.1,0.9c0.9,2.6,1.4,5.4,1.3,8.2l-3.4-2.5c-0.9-0.6-2.1-0.7-3-0.1
    c-0.9,0.6-1.5,1.6-1.5,2.7c0.3,3.8,0.3,7.6-0.2,11.3l-2.7-3c-0.7-0.8-1.9-1.1-2.9-0.7c-1.1,0.4-1.8,1.3-2,2.4
    c-0.6,4.4-0.5,8.9,0.2,13.3l-3.6-2c-0.9-0.5-2.1-0.5-3,0.1c-0.9,0.5-1.4,1.5-1.4,2.6c0.5,5.3,1.8,10.5,4,15.4l-5-1.1
    c-1.6-0.3-3.1,0.8-3.4,2.4c-0.1,0.4,0,0.7,0,1.1c1.8,6.5,6.5,11.9,10.3,17.2l-1.9,0.1c-1.1,0.1-2.1,0.8-2.5,1.8
    c-0.4,1.1-0.1,2.2,0.7,3c7.1,6.8,12.6,10.4,19,11.7c5.8,1.2,12.2,0.5,21.1-0.7l1.2,17.2c0.1,1.5,1.5,2.7,3,2.6
    c1.5-0.2,2.7-1.5,2.7-3l-1.2-17.4c9,0,15.4-0.3,21-2.3c6.3-2.2,11.1-6.6,17.2-14.3c0.7-0.9,0.8-2.1,0.3-3.1
    c-0.6-0.9-1.6-1.5-2.7-1.5l-2,0.1c3.2-5.8,6.9-11.8,7.8-18.5c0-1.7-1.3-3.1-3-3.1c-0.3,0-0.5,0-0.8,0.1l-4.8,1.7
    c1.4-5.1,2-10.5,1.8-15.8c-0.1-1.1-0.7-2-1.7-2.4c-1-0.4-2.1-0.3-3,0.3l-3.3,2.5c0.1-4.5-0.4-8.9-1.6-13.2c-0.4-1.5-2-2.3-3.4-1.9
    c-0.6,0.2-1.1,0.6-1.5,1.1l-2.3,3.3c-1-3.7-1.5-7.4-1.7-11.2c-0.1-1.1-0.8-2.1-1.8-2.5c-1-0.4-2.2-0.2-2.9,0.6l-3.1,2.8
    c-0.5-2.7-0.4-5.5,0.1-8.3c0.2-1.7-1-3.1-2.7-3.3c-0.3,0-0.6,0-0.9,0c-1.7,0.6-3.5,0.8-5.3,0.7c-0.7,0-1.3-0.4-1.6-0.9
    c-1.1-1.5-2.3-6-5.1-12.6C297.5,493.3,296.4,492.6,295.1,492.7z"/>
  <path id="Bynke" visibility="hidden" fill-rule="evenodd" clip-rule="evenodd" fill="#757575" d="M340.7,560.2c-1.4-1.7-3.6-2.6-5.9-2.3
    c-7.1,2.1-11,0.8-16.7-5.8c2.3-0.2,3.8-0.7,5.6-0.8c4.6,0.1,7.8-2.5,7.9-6.4c0.3-3.2-1.9-6.1-5-6.7c-4.2-0.5-6.7,2-7.9,6
    c-0.5,1.6-1.6,3-3.2,3.7c-3.8,0.7-7.9,0.6-12.5,0.9c2-4.4,3.6-8.1,5.2-11.7c2-4,3.2-8.8,8.8-10.4c4.1-1.1,5.6-7,4.2-10.8
    c-1.3-4-5.5-6.2-9.5-4.9c-0.1,0-0.2,0.1-0.3,0.1c-5,1.8-7.7,7.3-5.9,12.4c0.2,0.6,0.5,1.1,0.8,1.7c2.7,5.3-0.2,8.2-2.9,12.3
    c-2.4-4.7-4.3-9.7-5.6-14.8c-1.1-4.6-1.8-9.6,2.8-13.9c3.3-3.5,4-8.7,1.7-13c-1.4-3.4-5.3-5-8.7-3.6c-0.2,0.1-0.5,0.2-0.7,0.3
    c-4.4,2.6-6.3,12.5-3,16.2c4.1,4,2.9,8.4,2.1,13.5c-2.8-2.1-5.9-3.1-7.2-5.3c-3.1-6.4-5.5-8.2-11.9-7c-3.8,0.7-7,2.4-7.1,6.7
    c-0.7,4.5,1.8,8.8,6.1,10.5c2.3,1,6-0.8,9-1.4c1.1-0.5,2.1-2.1,3.3-1.8c4.2-0.3,11,4.7,12.4,8.9c1,3.1,2.7,5.7,3.6,8.3
    c0.5,0.6,0.7,1.5,0.5,2.3c-1.9,4.8-4.3,9.7-6.5,14.9c-0.5,0.1-1.1,0-1.5-0.3c-1.1-4.3-1.7-8.7-1.7-13.1c0.4-5.5-1.4-9.3-6.4-10.5
    c-3.7-1-7.5,1.2-8.5,4.9c-0.1,0.3-0.1,0.5-0.2,0.8c-0.9,4.7,2.1,9.3,6.8,10.3c0.2,0,0.5,0.1,0.7,0.1c1.5,0.4,2.9,1.3,4,2.5
    c-0.3,0.5-0.5,1-0.6,1.6c-2.1,0.7-4.2,1.3-6.3,1.6c-4.2,0.3-8.3,1-10.2-5.1c-1-3.4-4.8-4-8.2-2.5c-3.7,2-5.2,6.6-3.4,10.4
    c1.4,3.2,5,4.6,8.2,3.3c1.4-0.8,2.9-1.4,4.4-1.9c5.7-0.4,11,0,17.1,0c2.7,5.7,0.7,15.2-5.3,22.2c-2.2-4.2-4.1-8.5-5.8-12.9
    c-1.7-3.9-6.1-5.6-10-4c-0.3,0.1-0.6,0.3-0.9,0.5c-2.2,1.6-3.6,4.2-3.7,6.9c-0.1,3.9,4.6,5.9,9.1,5.2c1.1-0.1,2.2-0.5,3-0.6
    c5.1,7.4,7.1,14.3,2.7,22.4c-2,4.3-3.5,8.9-4.4,13.6c-0.4,1.9-0.7,3.9-0.7,5.9c0.4,0,0.8,0.3,1.2,0.3c1.4-1.6,2.5-3.4,3.4-5.3
    c1.8-6.4,4.5-10.9,12.1-11c4.7-0.7,9.3-1.8,13.8-3.3c4-1.3,6.9-4.9,7.3-9.1c0.1-3.5-2.4-6.5-5.8-7c-3.5-0.8-7,1.4-7.8,5
    c0,0.2-0.1,0.4-0.1,0.7c-1.3,8.3-7.8,7.2-13,9.5c2.2-7.1,4.7-14,7.7-20.8c2.1-4.9,7.8-7.2,12.7-5.1c1,0.4,1.9,1,2.6,1.7
    c3.3,2.7,8.1,2.4,11-0.8c3.6-3,4.7-8.5,2.6-11.5c-3-5.2-11-5.5-12.9-0.3c-2.2,6.4-6.5,5.1-11.4,4.7c1.3-2.8,1.9-5.2,3.3-7.6
    c1-2,1.9-4.8,3.4-4.9c3.8-0.7,8.6-1.8,11.8-0.1c6.3,3.5,11.6,8.9,17.6,13.2c2.2,1.2,4.8,1.4,7.3,0.7c2.7-1.3,3.7-4.6,2.4-7.2
    C341.2,560.9,341,560.5,340.7,560.2 M309.8,520.6c1-2,2.4-3.7,4.2-5c0.4-0.4,2.8,1.8,5.2,3.5c-1.9,1.6-4,3.1-6.1,4.3
    C311.6,523.1,310.4,522,309.8,520.6 M279.2,517.7c-1.3,2-2.6,3.9-4.1,5.8c-1.3-1.9-2.9-3.3-4.2-5.2c1.4-1.3,3.2-2.6,5-4.3
    C277.1,515.2,278.2,516.4,279.2,517.7 M292.5,506.2c0.9-3.6,1.8-6.8,2.7-10.3C299.3,501.1,298.4,504.3,292.5,506.2 M282.4,546.8
    c-0.5-1.9-1.1-4.2-1.6-6.1c1.1-0.1,2.6-0.6,3.8-0.7c0.5,1.9,0.7,4.3,1.2,6.2C284.6,546.1,283.5,546.4,282.4,546.8 M313.3,564.1
    c0.8,0.7,2.8,1.8,2.5,2.6c-0.2,3.1-1.9,4.8-7.3,4.8C310.5,568.2,311.9,566.2,313.3,564.1"/>
  <path id="Elm" visibility="hidden" fill-rule="evenodd" clip-rule="evenodd" fill="#757575" d="M340.3,554.1c-0.8-9.7-3.5-19.2-8-27.8
    c-3.9-7.2-8.9-13.7-14.8-19.5c-6.1-6.1-13.2-11.2-20.8-15.3c-0.8-0.3-1.8-0.2-2.6,0.2c-7,5.1-13.2,11.2-18.5,18
    c-5.1,6.4-9.1,13.6-11.9,21.3c-3.4,9.2-4.8,18.9-4,28.7c1.6,21.3,19.3,37.7,40.6,37.8l1.2,17.6c0.1,1.4,1.3,2.5,2.7,2.4
    c1.4-0.1,2.5-1.3,2.4-2.7l-1.2-17.6C326.4,594.1,341.6,575.3,340.3,554.1 M265.8,565.9l29.9,26C281.3,590.4,269.4,580,265.8,565.9
     M299.7,588.8l-35-30.6c-0.3-4.6-0.1-9.3,0.6-13.9l33.3,28.9L299.7,588.8L299.7,588.8z M298.1,566.2l-31.6-27.1l-0.3-0.3
    c1.1-3.8,2.4-7.4,4-11l26.5,22.7l1.1,15.7L298.1,566.2z M296.4,543.3L273,522.9c1.8-3.2,3.8-6.3,6-9.3l16.3,14L296.4,543.3z
     M294.9,520.7l-12.9-11.1c3.4-4,7.2-7.7,11.4-10.9L294.9,520.7L294.9,520.7z M298.4,498c4.5,2.8,8.7,5.8,12.8,9.2L299.9,520
    L298.4,498L298.4,498z M300.4,527.2l14.2-16.1c2.6,2.6,5.1,5.4,7.3,8.3l-20.7,23.6l-1.1-15.7L300.4,527.2L300.4,527.2z M302,550.1
    l23-26.2c2.1,3.3,3.9,6.8,5.5,10.3l-0.3,0.3l-27.2,31.2L302,550.1L302,550.1z M309.1,591l26-29.9C333.4,575.4,323.1,587.3,309.1,591
     M304.7,588.4l-1.1-15.7l28.9-33.3c1.3,4.5,2.2,9.1,2.6,13.7L304.7,588.4z"/>
  <path id="Græs" visibility="hidden" fill-rule="evenodd" clip-rule="evenodd" fill="#757575" d="M314.4,488c-2.2,3.8-4,7.8-5.5,11.9
    c-3.4,8.6-4.6,18.7-6.1,28.8c-0.6,5-1.5,10.1-2.4,15.1c-2.9,21.8-3.5,43.9-1.8,65.8c-3.4,0.9-6.8,1.5-10.1,2.4
    c-0.1-23,1.9-45.9,6.1-68.5c1.7-10.3,4-20.5,7-30.6c1.4-4.6,3-9.2,4.9-13.6C308,494.9,310.7,490.9,314.4,488 M258,548.2
    c2,1.4,3.5,3.4,4.3,5.6c3.1,7.2,5.4,14.8,6.8,22.5c2.8,11.5,4.2,23.2,4,35l-5.2,0c0.9-11.4,0.1-22.9-2.2-34.1
    C264.4,567.3,261.8,557.6,258,548.2 M271.2,516.2c3.3,2.3,5.9,5.5,7.4,9.2c1.8,3.8,3.2,7.8,4.3,11.9c0.8-2.9,1.9-5.8,3.1-8.6
    c0.9-2.7,2.5-5.2,4.6-7.1c-2.1,6.2-3.8,12.6-5.2,19c-0.4,1-0.6,2-0.6,3c0.1,0.7,0.3,1.4,0.6,2.1c2.5,9.9,4.4,20,5.6,30.2
    c1.5,11.9,1.9,23.9,1.3,35.9c-3.1,0-6.1-0.3-9.2-0.6c3.4-16,2.4-36.8-0.4-52.8c-3.2,17.4-4.2,35.1-3,52.8l-6.1,0
    c0.1-20,2.3-40,6.7-59.6c0.3-1.2,0.6-2.7,0.9-3.6c0-0.6-0.3-1.5-0.3-2.1c-0.8-4.9-1.9-9.8-3.4-14.5C275.2,526,273,521.3,271.2,516.2
     M305,547.6C305,547.3,305.3,547.3,305,547.6c2.1,1.3,3.6,3.3,4.3,5.6c0.9,1.8,1.8,3.7,2.5,5.6l0.9-0.9c4.5-6,11.4-9.8,19-10.4
    c1.6-6.9,3.8-13.6,6.4-20.2c0.8-2,2-3.7,3.7-5c-1.8,6.5-4.3,13.1-5.5,19.9c-1.5,7.1-2.7,14.2-3.7,21.7c-2.6,15.7-3.3,31.6-2.1,47.5
    l-6.1,0c0.2-21.5,2.7-42.8,7.6-63.8c-8.6,2.7-14.1,9.2-17.8,17.2c4.3,15,6.6,30.4,6.8,46l-5.8,0c0.8-13.7-0.3-27.5-3.4-40.9
    c-4,11.3-5.2,25.2-5.2,40.4l-9.5,0c0.9-19.3,4.9-35.9,12.8-48.6C308.6,556.8,307,552.1,305,547.6"/>
  <text id="name" transform="matrix(1 0 0 1 200.9052 323.9805)" font-family="'MyriadPro-Regular'" font-size="80px">Name</text>
  <text id="number" transform="matrix(1 0 0 1 262.9149 391.9805)" font-family="'MyriadPro-Regular'" font-size="60px">5.2</text>
  </svg>
  `
}
