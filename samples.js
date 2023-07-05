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
/** 
  loadSample() takes the object read in from "samples.json" and creates an array of sample controls (play, reverse, etc)
*/
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
  b.className = "play-button";
  b.innerHTML = sObj.name;
  let d = document.getElementById("sampler");
  let player = new Tone.Player(sObj.file).toDestination();
  b.addEventListener('click', () =>{
    if(sObj.hasOwnProperty("bpm")){
      // scale playback rate to tempo
      player.playbackRate = Tone.Transport.bpm.value / sObj.bpm;
    }
    if(Tone.Transport.state == "stopped"){
      startTransport();
    }
    player.start(); // play the sample
  });
  // reverse button
  let rev = document.createElement("button");
  rev.innerHTML = "REV";
  rev.className = "metro-button";
  rev.addEventListener('click', () => {
    if(player.reverse){
      player.reverse = false;
      rev.innerHTML = "REV";
    } else {
      player.reverse = true;
      rev.innerHTML = "FWD";
    }
  });
  d.appendChild(b); // add play button to sampler div
  d.appendChild(rev);  // add reverse button
  d.appendChild(document.createElement("br"));
}

let promise = loadJSONData();

//console.log("global data: " + data)

//import data from "./samples.json" assert { type: "json" };
//var str = JSON.parse(data);
//console.log(data);