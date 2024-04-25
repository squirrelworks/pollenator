import SaveObject from './localstorage_object_module.js'
import { ReadObject } from './localstorage_object_module.js'

let mySettings;

export default function MakeSettingsView(element) {
    mySettings = ReadObject('userSettings')

    element.innerHTML = ""

    let mySettingsElement = document.createElement('section');
    mySettingsElement.classList.add('settingsCard')



    let myItems = ['Birk', 'Elm', 'Græs', 'ragweed'];

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
    element.scrollTop = -1;
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
        case "ragweed":
            mySettings.ragweed = !mySettings.ragweed
            break;

        default:
            break;

    }


    SaveObject(mySettings, "userSettings")
}