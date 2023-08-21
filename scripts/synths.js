/** 
* Make a synth library interface with Tone.js and P5.js
* August 2, 2023
*/
let synthPromise = loadSynthData("synths.json");

//Global array of synths
var synthLibrary = [
  {
    name: "Default Synth",
    type: "Synth",
    settings: {},
    polyphonic: true
  },
  {
    name: "FM Synth Test",
    type: "FMSynth",
    settings: {},
    polyphonic: true
  },
  {
    name: "Default Drums",
    type: "Sampler",
    polyphonic: false,
    settings: {
      urls: {
        "A3": "drums/Kick.wav",
        "A#3": "drums/Kick.wav",
        "B3": "drums/Snare.wav",
        "C4": "drums/Claps.wav",
        "C#4": "drums/Shot1.wav",
        "D#4": "drums/Shot2.wav",
        "D4": "drums/WhiteNoise.wav",
        "E4": "drums/ReverseCymbal.wav",
        "F4": "drums/HiHat_Closed.wav",
        "F#4": "drums/HiHat_Open.wav"
      }
    }
  }
];

// read in the JSON file with synth library meta-data
async function loadSynthData(file) {
  const response = await fetch(file);
  const text = await response.text();
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    makeSynthPlayer(obj); // generate synth interface
    return obj;
  }
  catch (error) {
    let e = "error - invalid JSON file (synths.json)<br /> copy and paste your JSON to <a href = 'https://jsonlint.com/' target='_blank'>jsonlint.com</a>";
    document.getElementById("synths").innerHTML = e;
    console.log(e);
    return;
  }
  //console.log(JSON.stringify(data));
}

function makeSynthPlayer(obj) {
  console.log("Synth player:");
  document.getElementById("synths").innerHTML = JSON.stringify(obj);
//  console.log(obj);
  //synthLibrary.push(defaultSynth);
  for(let i = 0; i < synthLibrary.length; i ++){
    makeSynths(synthLibrary[i]); // generate Tone synths for each entry
  }
  
  if(Array.isArray(obj)){
    for(let i = 0; i < obj.length; i ++){
      makeSynths(obj[i]); //parse the objects, instantiate synths
      synthLibrary.push(obj[i]); // add to the library
    }
  }
  console.log("Synth Library: " + synthLibrary.length + " items")

  let s = document.getElementById("synths");
  let sketch = new p5(keyGUI, s); // invoke p5 and add it to the div
}

function makeSynths(obj){
  if(obj.hasOwnProperty("type")){
    switch (obj.type){
      case "Sampler":
        console.log("make a new Sampler: " + obj.name);
        obj.synth = new Tone.Sampler(obj.settings).toDestination();
        break;
      case "FMSynth":
        console.log("make a new FM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.FMSynth).toDestination();
        obj.synth.set(obj.settings);
        break;
      case "AMSynth":
        console.log("make a new AM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
        obj.synth.set(obj.settings);
        break;
      case "PluckSynth":
        console.log("make a new Plucked Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.PluckSynth).toDestination();
        obj.synth.set(obj.settings);
        break;  
      default :
        console.log("make a new Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        obj.synth.set(obj.settings);   
    }
  }
}

// Create a default instrument (sequences and markov)
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
// Create a default instrument (sequences and markov)

/**Define a default polyphonic drum sampler */
const drumSampler = new Tone.Sampler(
  {
    urls: {
      "A3": "drums/Kick.wav",
      "A#3": "drums/Kick.wav",
      "B3": "drums/Snare.wav",
      "C4": "drums/Claps.wav",
      "C#4": "drums/Shot1.wav",
      "D#4": "drums/Shot2.wav",
      "D4": "drums/WhiteNoise.wav",
      "E4": "drums/ReverseCymbal.wav",
      "F4": "drums/HiHat_Closed.wav",
      "F#4": "drums/HiHat_Open.wav"
    },
  }
).toDestination();

