/** 
* Make a sample player interface with Tone.js
* June 26, 2023
*/

// read in the JSON file with sampler meta-data
async function loadJSONData() {
  const response = await fetch("samples.json");
  const text = await response.text(); 
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    loadSamples(obj); // load samples into the player
    return obj;
  } catch (error){
    console.log("error - invalid JSON file (samples.json)");
    return;
  }
  //console.log(JSON.stringify(data));
}

// start by cycling through the array of sample objects, making buttons
function loadSamples(obj){
  if(obj.hasOwnProperty("samples") && Array.isArray(obj.samples)){
    //console.log("obj.samples is an array");
    for(let i = 0; i < obj.samples.length; i ++){
      //console.log(obj.samples[i]);
      makeButton(obj.samples[i], i);
    }
  }
}

// create a button interface for each sample
// accompany player buttons with controls for FWD/REV
// playback is tempo sensitive if meta data includes "bpm" field
function makeButton(sObj, i){
  //play button
  let b = document.createElement("button");
  b.id = "sample_" + i;
  b.className = "samplerButton";
  b.innerHTML = sObj.name;
  let d = document.getElementById("sampler");
  let player = new Tone.Player("/samples/" + sObj.file).toDestination();
  b.addEventListener('click', () =>{
    if(sObj.hasOwnProperty("bpm")){
      // scale playback rate to tempo
      player.playbackRate = Tone.Transport.bpm.value / sObj.bpm;
    }
    player.start(); // play the sample
  });
  // reverse button
  let rev = document.createElement("button");
  rev.innerHTML = "REV";
  rev.addEventListener('click', () => {
    if(player.reverse){
      player.reverse = false;
      rev.innerHTML = "REV";
    } else {
      player.reverse = true;
      rev.innerHTML = "FWD";
    }
  });
  d.appendChild(b); // add buttons to sampler div
  d.appendChild(rev);
}

let promise = loadJSONData();

//console.log("global data: " + data)

//import data from "./samples.json" assert { type: "json" };
//var str = JSON.parse(data);
//console.log(data);