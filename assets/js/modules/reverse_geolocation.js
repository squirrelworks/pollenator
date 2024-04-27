





export default async function GetLocationInfo(lat, long) {
return fetch(
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
  
      
      let shortName=GetShortLocationName(data)
      data.shortName=shortName
      //console.table(data);
      return data
     
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });
}



 function GetShortLocationName(data){

let myLocationName=''

      if(data.address.hamlet){
        myLocationName=data.address.hamlet
      }

      else if(data.address.village){
        myLocationName=data.address.village
      }

      else if(data.address.town){
        myLocationName=data.address.town
      }

      else if(data.address.neighbourhood){
        myLocationName=data.address.neighbourhood
      }

      else if(data.address.suburb){
        myLocationName=data.address.suburb
      }

      else if(data.address.city){
        myLocationName=data.address.city
      }

      else if(data.address.municipality){
        myLocationName=data.address.municipality
      }
     
 

return myLocationName

}