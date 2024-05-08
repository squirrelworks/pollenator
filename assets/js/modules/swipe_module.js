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
    if (touchendX < touchstartX) {
        alert(swiped + 'left!');
    }
    if (touchendX > touchstartX) {
        alert(swiped + 'right!');
    }
    if (touchendY < touchstartY) {
        alert(swiped + 'down!');
    }
    if (touchendY > touchstartY) {
        alert(swiped + 'left!');
    }
    if (touchendY == touchstartY) {
        alert('tap!');
    }
}