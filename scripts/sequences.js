/** 
* Make a sequence player interface with Tone.js and P5.js
* July 16, 2023
*/
let sequencePromise = loadSequenceData("sequences.json")

// read in the JSON file with sampler meta-data
async function loadSequenceData(file) {
  const response = await fetch(file);
  const text = await response.text(); 
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    makeSeqPlayer(obj); // generate Markov player and GUI
    return obj;
  } 
  catch (error){
    let e = "error - invalid JSON file (sequences.json)<br /> copy and paste your JSON to <a href = 'https://jsonlint.com/' target='_blank'>jsonlint.com</a>";
    document.getElementById("sequences").innerHTML = e;
    console.log(e);
    return;
  }
  //console.log(JSON.stringify(data));
}

function makeSeqPlayer(obj){
  //document.getElementById("sequences").innerHTML = JSON.stringify(obj);
  if(Array.isArray(obj)){
    for(let i = 0; i < obj.length; i++){
      console.log(obj[i].name);
      let seqDiv = document.getElementById("sequences");
      let sketch = new p5(seqGUI, seqDiv); // invoke p5 and add it to the div
      sketch.setObj(obj[i]); // hand a refernce to the sequence to the sketch
    } 
  }  
}

function playSequence(seq) {
  //console.log(seq);
  if(Tone.Transport.state == "stopped") {
    console.log("start transport first");
    return; // put up an error message and quit the function
  }
  let t = Tone.Transport.position;

  let times = t.split(':');
  times[2] = 0; // set to downbeat;
  times[1] = Number(times[1]) + 1; // move up to the next downbeat;
  if (times[1] > 3) {
    times[1] = 0;
    times[0] = Number(times[0]) + 1;
  }
  t = times[0] + ":" + times[1] + ":" + times[2];
  
  const part = new Tone.Part(((time, note) => {
    // the notes given as the second element in the array
    // will be passed in as the second argument 
    synth.triggerAttackRelease(Tone.Frequency(note.pitch).transpose(seq.octave * 12), note.dur, time);
    console.log(note.pitch);
  }), seq.sequence).start(t);
  part.loopEnd = seq.duration;

  return part;
  
}

/**  
  // make buttons for each sequence in the array "sequences"
  for (let i = 0; i < sequences.length; i++) {
    //play button
    let btn = document.createElement('input');
    btn.type = "button";
    btn.id = "sequence_" + (i + 1);
    btn.className = "seq_player";
    btn.value = "Play Sequence " + (i + 1);
    document.body.appendChild(btn);
    //octave up button
    let octup = document.createElement('input');
    octup.type = "button";
    octup.id = "up8_" + (i+1);
    octup.className = "octup";
    octup.value = "8ve up";
    document.body.appendChild(octup);
    //octave down button
    let octdn = document.createElement('input');
    octdn.type = "button";
    octdn.id = "dn8_" + (i+1);
    octdn.className = "octdn";
    octdn.value = "8ve down";
    document.body.appendChild(octdn);
    let linebreak = document.createElement("p");
    document.body.appendChild(linebreak);
  }
  
  var parts = new Array(sequences.length); // make a set of parts
  
  // Attach actions to buttons 
  for (let i = 0; i < sequences.length; i++) {
    document.getElementById("sequence_" + (i + 1))?.addEventListener('mousedown', () => {
      if (Tone.Transport.state = "started") {
        parts[i] = playSequence(sequences[i]);
        if (parts[i]) parts[i].loop = true;
      } else console.log("start the transport first");
    });
    document.getElementById("sequence_" + (i + 1))?.addEventListener('mouseup', () => {
      if (parts[i]) parts[i].loop = 1;
    });
    document.getElementById("sequence_" + (i + 1))?.addEventListener('mouseleave', () => {
      if (parts[i]) parts[i].loop = 1;
    });
  
    document.getElementById("up8_" + (i + 1))?.addEventListener('click', () => {
      if (sequences[i].octave < 3) sequences[i].octave++;
    });
  
    document.getElementById("dn8_" + (i + 1))?.addEventListener('click', () => {
      if (sequences[i].octave > -3) sequences[i].octave--;
    });
  
  }
*/