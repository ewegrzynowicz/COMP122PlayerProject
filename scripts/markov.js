/** 
* Make a markov chain player interface with Tone.js and P5.js
* July 5, 2023
*/
let markovPromise = loadMarkovData("markov.json")

// read in the JSON file with sampler meta-data
async function loadMarkovData(file) {
  const response = await fetch(file);
  const text = await response.text(); 
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    makeGraph(obj); // generate Markov player and GUI
    return obj;
  } 
  catch (error){
    let e = "error - invalid JSON file (markov.json)<br /> copy and paste your JSON to <a href = 'https://jsonlint.com/' target='_blank'>jsonlint.com</a>";
    document.getElementById("markov").innerHTML = e;
    console.log(e);
    return;
  }
  //console.log(JSON.stringify(data));
}

/** Generate a Markov graph from the JSON object
*/
function makeGraph(obj){
  console.log("make graph!");
  if(Array.isArray(obj)){
    for(let i = 0; i < obj.length; i++){
      console.log(obj[i].name);
      let mDiv = document.getElementById("markov");
      let sketch = new p5(mGUI, mDiv); // invoke p5
      //console.log ("sketch width: " + sketch.width);
      sketch.setObj(obj[i]); // pass an object to a sketch
      let pitchSet = {};
      let rhythmSet = {};
      if(obj[i].hasOwnProperty("pitchSet") && obj[i].hasOwnProperty("rhythmSet")){
        pitchSet = obj[i].pitchSet;
        //console.log("pitchSet set!");
        rhythmSet = obj[i].rhythmSet;
        //console.log("rhythmSet set!");
      }
      const loop = new Tone.Loop(time => {
  //in this loop, the markov() function will choose the next pitch  and rhythmic value based on the matrix defined in your pitchSet and rhythmSet objects
      let r = markov(rhythmSet); // get the next duration value
      let p = markov(pitchSet); // get the next pitch value
      let dur;
      if(staccato){
        dur = "16n";
      } else dur = r;
      let v = sketch.getVol();
      synth.triggerAttackRelease(p, dur, time, v);
      Tone.Transport.schedule
      loop.interval = r; // set the interval to a new value
      sketch.onButton(p);
      let offTime = "+" + (0.9 * Tone.Time(r).toSeconds());
      Tone.Transport.schedule((time) => {sketch.offButton(p)}, offTime);
  
    }, rhythmSet.state);
      loop.state = "stopped";
      sketch.setLoop(loop); //hand reference to the loop to P5 sketch    
    } 
  }  
}

const staccato = false; // play all notes short? or not?


//the markov() function chooses a new value from the ".graph" object based on the current value of the ".next" property of a given graph object
function markov(obj){
  //console.log(obj.state); // show the next value in the console
  let values = Object.keys(obj.matrix); // get a list of possible values in the matrix
  let i = values.indexOf(obj.state); // find the position current state in the matrix list
  
  let possibilities = obj.matrix[values[i]]; // get all the possible next values for a given state as an array

  obj.state = possibilities[Math.floor(Math.random() * possibilities.length)];
  // choose a value at random from the list & assign it as the next ".state"

  return obj.state; // return the value chosen
}

// Create an nistrument to play the Markov-generated tune
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
