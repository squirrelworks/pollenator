import SaveObject from './localstorage_object_module.js'
import { ReadObject } from './localstorage_object_module.js'
import { GetStoredLocations,DeleteStoredLocation} from "./map_module.js";

let mySettings;
let locationList
let settingsView

export default function MakeSettingsView(element) {
    settingsView = element  
    mySettings = ReadObject('userSettings')

    element.innerHTML = "" 

    let mySettingsElement = document.createElement('section');
    mySettingsElement.classList.add('settingsCard')

    mySettingsElement.innerHTML ='<h3>Pollen typer</h3>'

    let myItems = ['Birk', 'Elm', 'Græs', 'Bynke'];

    myItems.map((item, index) => {


        let myDiv = document.createElement('div')

        myDiv.innerHTML = `<h3>${item}</h3>`
        mySettingsElement.appendChild(myDiv)

        let myLabel = document.createElement('label')
        myLabel.classList.add('switch')
        myDiv.appendChild(myLabel)



        let clicker = document.createElement('input');
        clicker.type = 'checkbox'
        clicker.setAttribute("data-type", item);
        clicker.onclick = checkboxCallback;
        // selected?

        clicker.checked = Object.values(mySettings)[index];
        myLabel.appendChild(clicker)

        let mySlider = document.createElement('span')
        mySlider.classList.add("slider", "round")

        myLabel.appendChild(mySlider)


        mySettingsElement.appendChild(myDiv)
    })

    element.appendChild(mySettingsElement)
    createLocationList(element)
    element.scrollTop = 0;

}

function checkboxCallback(e) {
    let settingsItem = e.target.dataset.type





    //['birk', 'elm', 'grass', 'ragweed'];

    switch (settingsItem) {

        case "Birk":
            mySettings.birch = !mySettings.birch

            break;
        case "Elm":
            mySettings.alder = !mySettings.alder

            break;
        case "Græs":
            mySettings.grass = !mySettings.grass
            break;
        case "Bynke":
            mySettings.ragweed = !mySettings.ragweed
            break;

        default:
            break;

    }


    SaveObject(mySettings, "userSettings")
}


function createLocationList(){

    let storedLocations=GetStoredLocations();
  
  
    if (!locationList) {
        locationList = document.createElement("section");
        locationList.id='settingsLocationList'
    }else{
        locationList.innerHTML="" 
    }
   

     locationList.innerHTML='<h3>Lokationer</h3>'
    
  
    
    storedLocations.locations.map((location,index) => {
    
      let myLocationElement=document.createElement("div");
      myLocationElement.classList.add("settingsLocation");
      myLocationElement.setAttribute("data-index",index);
      myLocationElement.addEventListener("click",LocationListCallback);
      myLocationElement.innerHTML+= `<div>${location.info.shortName}</div> <div>X</div>`
      
      locationList.appendChild(myLocationElement);
     
    })
    settingsView.appendChild(locationList)
  
  }
  
  
  function LocationListCallback(e){
    let selectedIndex = e.target.getAttribute('data-index');
    
    DeleteStoredLocation(selectedIndex)
   
    createLocationList()
   
  }