// write cool JS hwere!!

getLocation();


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(GetAll);
   
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
}


async function GetAll(position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    let myUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen&timezone=Europe%2FBerlin&domains=cams_europe`;

    let geoUrl=`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65fb5ea644244903025253axe09afbb`

  try {
    const res = await Promise.all([
      fetch(myUrl),
      fetch(geoUrl)
    ]);
    const data = await Promise.all(res.map(r => r.json()))

    console.log(data[0]);
    console.log(data[1]);

  } catch {
    throw Error("Promise failed");
  }
};








/* function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPollenData);
    console.log(myPos);
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
} */

function getPollenData(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  getLocationName(latitude,longitude);

  let myUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen&timezone=Europe%2FBerlin&domains=cams_europe`;

  fetch(myUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });
}


function getLocationName(lat,long){




  fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fb5ea644244903025253axe09afbb`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data
      console.log(data.display_name);
      console.log(data.address.hamlet+' '+data.address.village);
    
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });


}