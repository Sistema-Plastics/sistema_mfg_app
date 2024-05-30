export const helperfunctions = {
  //retrins wks days hours minutes and seconds when passed seconds
  //if passed in millsecs (Epoch) divide by 1000
  getRealTimefromSeconds: function (seconds, ms, format) {
    let retVal = "";
    if (ms) seconds = Math.Floor(seconds / 1000); //get to seconds rather than ms
    const weeks = Math.floor(seconds / (7 * 24 * 3600));

    seconds -= weeks * 24 * 3600;
    const days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    //rmaining are seconds left over
    retVal = Math.floor(seconds) + " s";
    if (format.includes("mm")) retVal = minutes + " m " + retVal;
    if (format.includes("hh")) retVal = hours + " h " + retVal;
    if (format.includes("dd")) retVal = days + " d " + retVal;
    if (format.includes("ww")) retVal = weeks + " w " + retVal;
    return retVal;

  },
};
/*
//initial seconds 
let seconds = 280000; 
 
//days 
let days = Math.floor(seconds/(24*3600)); 

 
//hours 
let hours = Math.floor(seconds/3600); 
seconds -= hours*3600; 
 
//minutes 
let minutes = Math.floor(seconds/60); 
seconds -= minutes*60; 
 

let diff = 29554456;

let ms = diff % 1000;
let ss = Math.floor(diff / 1000) % 60;
let mm = Math.floor(diff / 1000 / 60) % 60;
let hh = Math.floor(diff / 1000 / 60 / 60);

        */
