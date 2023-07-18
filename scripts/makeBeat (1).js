beatPatterns = 0;


function makeBeat(string, noteName){  /** 
  * makeBeat() takes in a string and builds a looping sequence with transport times
  * the string of characters generates a stream of sixteenth notes that will play when the transport is started and loop until the transport is stopped
  * a "1" character in the string will create a note. a '0' (zero) is interpreted as a rest
  */
  
  let drumPart = {
    duration : string.length,
    sequence : []
  } // creates an object with a duration equal to the length of the string in sixteenth notes. The sequence property starts as an empty array

  for(let i = 0; i < string.length; i++)
  { // step through the string
    if (string[i] === "1"){ // if a character in the string is a '1'
      let t = "0:0:" + i; // set the tranport time for a note
      drumPart.sequence.push({time: t, pitch: noteName, dur: "16n" })
      // add a note object to the drumPart.sequence array
    }
  } 
  console.log(drumPart); // let's see the drumPart object in the console

  //create a Tone.Part object with our drumPart
  const part = new Tone.Part(((time, note) => {    
    mySampler.triggerAttackRelease(Tone.Frequency(note.pitch), note.dur, time);
  }), drumPart.sequence).start();
  
  part.loopEnd = "0:0:" + drumPart.duration; // set the end point for the loop
  part.loop = true; // set this part to loop
  beatPatterns++; // global
  let btn = document.createElement('input');
  btn.type = "button";
  btn.id = "beat_" + beatPatterns;
  btn.className = "seq_player";
  btn.value = "Play Beat: " + string + ", " + noteName;
  document.body.appendChild(btn);
document.body.appendChild(document.createElement("p"));
  btn.addEventListener('mousedown', ()=> {
    if (Tone.Transport.state == "started"){
      if(part.state == "started"){
        part.stop();
      } else part.start();
    }
  })

  return part; // pass the part object back to the place where the makeBeat function is called
}
