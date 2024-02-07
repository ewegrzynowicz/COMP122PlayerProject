/** 
* Make a sample player interface with Tone.js
* June 26, 2023
*/
var samplePlayers = []; // store sample players globally
var sampleParts = [];

let promise = loadSamplerData("samples.json");
// read in the JSON file with sampler meta-data
async function loadSamplerData(file) {
  const response = await fetch(file);
  console.log("samples.json OK?: " + response.ok);
  if(!response.ok) {
    let e = "Error: file not found (samples.json)"
    document.getElementById("sampler").innerHTML = e;
    console.log(e);
    return;
  }
  const text = await response.text(); 
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    loadSamples(obj); // load samples into the player
    return obj;
  } 
  catch (error){
    let e = "error - invalid JSON file (samples.json)<br /> copy and paste your JSON to <a href = 'https://jsonlint.com/' target='_blank'>jsonlint.com</a>";
    document.getElementById("sampler").innerHTML = e;
    console.log(e);
    return;
  }
  //console.log(JSON.stringify(data));
}

/** 
  loadSample() takes the object read in from "samples.json" and creates an array of sample controls (play, reverse, etc)
*/
function loadSamples(obj){
  if(Array.isArray(obj)){
    //console.log("obj.samples is an array");
    for(let i = 0; i < obj.length; i ++){
      if(obj[i].hasOwnProperty("file")){
        let player = new Tone.GrainPlayer(obj[i].file, function(){
          //after the player has loaded:
          samplePlayers.push(player); // add player to list
          console.log("loaded sample " + obj[i].file);
          console.log(player.buffer);
          console.log("duration " + player.buffer.duration);
//          let event = makeEvent(player);
          let part = new Tone.Part(() => {
    player.start();
  }, [0]);
          sampleParts.push(part);
          makeButtons(obj[i], i, player, part); 
        }).toDestination();
      } else 
        console.log("no sample file loaded");

    }
  }
}

// create a button interface for each sample
// accompany player buttons with controls for FWD/REV
// playback is tempo sensitive if meta data includes "bpm" field
function makeButtons(sObj, i, player, part){  

  //play button
  let b = document.createElement("button");
  b.id = "sample_" + i;
  b.className = "play-button";
  b.innerHTML = sObj.name;
  console.log("making button for " + b.id + " " + sObj.name);
  b.addEventListener('click', () =>{
    if(sObj.hasOwnProperty("bpm")){
      // scale playback rate to tempo
      //samplePlayers[i].playbackRate = Tone.Transport.bpm.value / sObj.bpm;
      player.playbackRate = Tone.Transport.bpm.value / sObj.bpm;
    }
    if(Tone.Transport.state == "stopped"){
//      startTransport();
    }
    let t = Tone.Transport.position;
    let times = t.split(':');
    times[2] = 0; // set to downbeat;
    times[1] = 0; // set to first beat
    times[0] = Number(times[0]) + 1; // move up to the next measure;
    t = times[0] + ":" + times[1] + ":" + times[2]; 
    // console.log("sample at " + t);
    Tone.Transport.scheduleOnce((time) => {
//      sampleParts[i].stop();
//      sampleParts[i].start();
      part.stop();
      part.start();
    }, t);

///    sampleParts[i].start(t);
    console.log("playing " + part + " at " + t);
    console.log("loop status: " + part.loop);
    console.log("loop state: " + part.state);
    
  });

  /* 
  duration property is currently linked to the player.loop property, which is limited to the length of the sample. Looking for a method to trigger samples at arbitrary intervals beyond the length of the sample
  
  if(sObj.hasOwnProperty("duration")){
    if(Tone.Time(sObj.duration).toSeconds() <= player.buffer.duration){
      player.loopEnd = sObj.duration;      
    } else player.loopEnd = player.buffer.duration;
  } else {
    sObj.duration = player.buffer.duration;
    player.loopEnd = sObj.duration;
  }  
  */
  if(sObj.hasOwnProperty("duration")){
//    sampleParts[i].loopEnd = sObj.duration;      
    part.loopEnd = sObj.duration;      
  } else {  
//    sampleParts[i].loopEnd = samplePlayers[i].buffer.duration;
//    part.loopEnd = samplePlayers[i].buffer.duration;
    part.loopEnd = player.buffer.durration;
  }
  
  
  // loop button
  let loopB = document.createElement("button");
  loopB.innerHTML = "Loop";
  loopB.className = "metro-button";
  loopB.addEventListener('click', () => {
/*    if(sampleParts[i].loop){
      sampleParts[i].loop = false;
      loopB.innerHTML = "Loop"
    } else {  
      loopB.innerHTML = "Looping";
      sampleParts[i].loop = true;
    }
    */
    if(part.loop){
      part.loop = false;
      loopB.innerHTML = "Loop"
    } else {  
      loopB.innerHTML = "Looping";
      part.loop = true;
    }
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
/*    if(samplePlayers[i].reverse){
      samplePlayers[i].reverse = false;
      rev.innerHTML = "REV";
    } else {
      samplePlayers[i].reverse = true;
      rev.innerHTML = "FWD";
    }
    */
  });
  
  let d = document.getElementById("sampler");
  let s = document.createElement("div"); // new div for each sample
  s.id = "sample" + i;
  s.className = "sample";
  var sketch = new p5(sampleGUI, s);
  sketch.setPlayer(part, i);
  s.appendChild(document.createElement("br"));
  s.appendChild(b); // add play button to sampler div
  s.appendChild(loopB); // add play button to sampler div
  s.appendChild(rev);  // add reverse button
  d.appendChild(s);
}

//console.log("global data: " + data)

//import data from "./samples.json" assert { type: "json" };
//var str = JSON.parse(data);
//console.log(data);