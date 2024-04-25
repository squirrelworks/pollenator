


export default async function getLocationName(lat, long) {
  let myLocationInfo = fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fb5ea644244903025253axe09afbb`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data
      //console.log(data.display_name);
      return data
      //console.log(data.address.hamlet+' '+data.address.village);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });

  //console.log('from rev geo: '+myLocationInfo.display_name);
  return myLocationInfo

}