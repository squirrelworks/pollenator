let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;


export default function SetupSwipe(element){
    var gesuredZone =element// document.getElementById('gesuredZone');

    gesuredZone.addEventListener('touchstart', function(event) {
        touchstartX = event.screenX;
        touchstartY = event.screenY;
    }, false);
    
    
    gesuredZone.addEventListener('touchend', function(event) {
        touchendX = event.screenX;
        touchendY = event.screenY;
        handleGesure();
    }, false); 

}




function handleGesure() { 
    
let swiped = 'swiped: ';

let xDist=Math.abs(touchendX-touchstartX)
let yDist=Math.abs(touchendY-touchstartY)



if (touchendX < touchstartX) {
  

  if(xDist > yDist){
    alert(swiped + 'left!');
  }
  
}
  else{
    if(xDist > yDist){
      alert(swiped + 'right!');
    }
  }


  if (touchendY < touchstartY) {
  if(yDist > xDist){
    alert(swiped + 'up!');
  }
}else{
    if(yDist > xDist){
        alert(swiped + 'down!');
    }
}
}