/** 
* Make a sample player interface with Tone.js and P5.js
* January 31, 2024
*/
var samplePlayers = []; // store sample players globally
var sampleParts = [];

let promise = loadSamplerData("JSON/samples.json");
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
    let samplerDiv = document.getElementById("sampler");
  if(Array.isArray(obj)){
    //console.log("obj.samples is an array");
    for(let i = 0; i < obj.length; i ++){
        let sDiv = document.createElement("div");
        sDiv.id = "sample" + i;
        sDiv.className = "sample";
        let sketch = new p5(sampleGUI, sDiv);
        sketch.setObj(obj[i], i);
        samplerDiv.appendChild(sDiv);

/*
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
*/
    }
  }
}
