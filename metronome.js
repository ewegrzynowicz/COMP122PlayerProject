/** 
* This script sets up a basic metronome click with tempo and sync adjustment
* Also creates a transport start/stop button
*/

var bpm = 120; // default tempo

console.log("default tempo: " + bpm + " bpm");

Tone.Transport.bpm.value = bpm;

// default click tone for metronome
const metroClick = new Tone.Synth().toDestination();

var metro = "off"; // metronome state

let m = document.getElementById("metronome");
//'metronome' div is in the Start menu

// transport button
let transport = document.createElement("button");
transport.innerHTML = "Transport";
transport.className = "metro-button";
transport.id = "transport";
transport.addEventListener('click', () => {
  startTransport();
});
function startTransport(){
  //make this function accessible from other buttons
  switch (Tone.Transport.state) {
    case "stopped":
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start();
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#4caf50';
      transport.innerHTML = "Stop";
      break;
    case "started":
      Tone.Transport.stop();
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#a8a8a8';
      transport.innerHTML = "Start";
      break;
    default:
      Tone.Transport.start();
  }
}

// Tempo number box
let tempoLabel = document.createElement('label');
tempoLabel.innerHTML = " tempo: ";

let tempo = document.createElement('input');
tempo.type="number";
tempo.value = bpm;
tempo.className = "tempo-box";
tempo.addEventListener('change', () => {
  console.log("new tempo: " + tempo.value);
  bpm = tempo.value;
  Tone.Transport.bpm.value = bpm;
});

// Metronome click
let click = document.createElement("button");
click.innerHTML = "Click";
click.className = "metro-button";
click.id = "click";
click.addEventListener('click', () => {
  startClick();  
});

const clickLoop = new Tone.Loop((time) => {
	// triggered every eighth note.
	console.log(time);
  metroClick.triggerAttackRelease(500, "128n", time);
}, "4n");

function startClick(){
    switch(metro){
    case "off":
      metro = "on";
      console.log("click " + metro);
      click.style.background = '#4caf50'; 
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }
      clickLoop.start("+4n");
      break;
    case "on":
      metro = "off";
      console.log("click " + metro);
      click.style.background = '#a8a8a8';
      clickLoop.stop();
      break;
    default:
      Tone.Transport.start();
  }
}

// Adjust metronome sync
// speed up/slow down metronome by 5% to get in phase with external clicks
let tempoSync = document.createElement('input');
tempoSync.type = 'range';
tempoSync.min = -5.0;
tempoSync.max = 5.0;
tempoSync.step = 0.1;
tempoSync.id = "tempoSync";
tempoSync.value = 0;

tempoSync.addEventListener('input', function() {
  // adjust tempo +/- 5%
  //console.log(this.value * 0.01 + 1);
  Tone.Transport.bpm.value = bpm * (this.value * 0.01 + 1);
  console.log(Tone.Transport.bpm.value);
  tempo.value = Tone.Transport.bpm.value;
}, false);

tempoSync.addEventListener('change', function() {
  // snap back to original bpm on release
  this.value = 0;
  Tone.Transport.bpm.value = bpm;
  tempo.value = Tone.Transport.bpm.value;

}, false);

m.appendChild(transport);
m.appendChild(tempoLabel);
m.appendChild(tempo);
m.appendChild(click);
let br = document.createElement("br")
m.appendChild(br);
m.appendChild(tempoSync);