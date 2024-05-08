import {swipeCallback} from '../app.js'; 


let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let gesuredZone


export default function SetupSwipe(element){
     gesuredZone =element// document.getElementById('gesuredZone');
console.log('setup swipe');
//swipeCallback('setup!!!!!!!!!!!!')

     gesuredZone.addEventListener('touchstart', function(event) {
      
        touchstartX = event.targetTouches[0].screenX;
        touchstartY = event.targetTouches[0].screenY;
        //console.log( touchstartX,touchstartY);
    });
    
    
    gesuredZone.addEventListener('touchend', function(event) {
     
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
      
        handleGesure();
    }); 

}




function handleGesure() { 
   
let swiped = 'swiped: ';

let xDist=Math.abs(touchendX-touchstartX)
let yDist=Math.abs(touchendY-touchstartY)



if (touchendX < touchstartX) {
  

  if(xDist > yDist){
  
    swipeCallback('left');

  }
  
}
  else{
    if(xDist > yDist){
      
      swipeCallback('right');
      
    }
  }


  if (touchendY < touchstartY) {
  if(yDist > xDist){
   
    swipeCallback('up');
  }
}else{
    if(yDist > xDist){
      
      swipeCallback('down');
    }
}
}