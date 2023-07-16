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
      let m = document.getElementById("markov");
      let sketch = new p5(s, m); // invoke p5
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


/** Markov Generator GUI (P5 Instance)
*/
/*
const s = p => {
  var tButton, s1Button, s2Button, nodes, beatButton;
  var nButtons = new Array();
  var pitchSet = null, rhythmSet = null; // needs setter
  var loop = null;

  p.setLoop = function(obj){
    loop = obj; // reference to a Tone.loop 
  }
  
  p.setObj = function(obj){
    if(obj.hasOwnProperty("pitchSet")){
      pitchSet = obj.pitchSet;
      if(pitchSet.hasOwnProperty("matrix")){
        nodes = Object.keys(pitchSet.matrix); // array of nodes
      //console.log("nodes" + nodes);
        let slice = p.TWO_PI; // distribute nodes around a circle
        if (nodes.length > 0) {
          slice = p.TWO_PI / nodes.length; // divide the circle by number of nodes
        }
        for (let i = 0; i < nodes.length; i++) {
          let x = p.cos(slice * i) * 150 + (p.width / 2); // find a location
          let y = p.sin(slice * i) * 150 + (p.height / 2);

          nButtons[i] = new Button(p, x, y, p.color(p.random(250), p.random(250), p.random(250)), nodes[i]);
          nButtons[i].w = 40; // node button size
          nButtons[i].pitch = nodes[i]; // assign a pitch property
        }
      }

    }
    if(obj.hasOwnProperty("rhythmSet")){
      rhythmSet = obj.rhythmSet;
    }
  }

  p.setup = function() {
    p.createCanvas(400, 400);
    tButton = new Button(p, p.width / 2, p.height / 2, p.color(0, 200, 0), "start");
  }

  p.draw = function() {
    p.background(200);

    tButton.display(); // transport button

    p.drawConnections(); // arrows

    for (let i = 0; i < nButtons.length; i++) {
      nButtons[i].display(); // node buttons
    }
  }

// draw a transparent line between nodes with a connection
  p.drawConnections = function() {
    p.stroke(255, 0, 0, 30);
    p.strokeWeight(5);
    let obj = pitchSet.matrix;
    let keys = Object.keys(obj)
    //console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      let list = obj[keys[i]];
      //console.log(list);
      //draw a line for each element in the list
      let x = nButtons[i].x;
      let y = nButtons[i].y;
      //console.log("button " + i + ": " + x + ", " + y);
      for (let j = 0; j < list.length; j++) {
        //find the index in keys of an item in list
        let connect = keys.indexOf(list[j]);
        let x2 = nButtons[connect].x;
        let y2 = nButtons[connect].y;
        p.line(x, y, x2, y2);
        //use drawArrow() from p5.org lerp() reference
        let v1 = p.createVector(x, y);
        let v2 = p.createVector(x2, y2);
        let v3 = p5.Vector.lerp(v1, v2, 0.7);
        p.drawArrow(v1, v3, p.color(255, 0, 0, 30));
    }
  }
}

  p.drawArrow = function(base, vec, myColor) {
    p.push();
    p.stroke(myColor);
    p.strokeWeight(3);
    p.fill(myColor);
    vec.x = vec.x - base.x;
    vec.y = vec.y - base.y;
    p.translate(base.x, base.y);
    p.line(0, 0, vec.x, vec.y);
    p.rotate(vec.heading());
    let arrowSize = 7; // adjust to taste
    p.translate(vec.mag() - arrowSize, 0);
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    p.pop();
  }

  p.onButton = function(note) {
    for (let i = 0; i < nButtons.length; i++) {
      if (note == nButtons[i].pitch) {
        nButtons[i].playing = true;
      }
    }
  }

  p.offButton = function(note) {
    for (let i = 0; i < nButtons.length; i++) {
      if (note == nButtons[i].pitch) nButtons[i].playing = false;
    }
  }

  p.mousePressed = function() {
    if (p.dist(p.mouseX, p.mouseY, tButton.x, tButton.y) < tButton.w / 2) 
    {
      if (loop && loop.state == "stopped") {
        loop.start("4n+"); //start on the next downbeat
        tButton.col = p.color(0, 255, 0);
      } 
      else if (loop && loop.state == "started") {
        loop.stop();
        tButton.col = p.color(0, 200, 0);
      }
    }
  }
};

class Button {
  constructor(_p, X, Y, col, msg) {
    this.p = _p; // P5 object reference
    this.x = X;
    this.y = Y;
    this.w = 100;
    this.col = col;
    this.message = msg;
    this.playing = false;
    this.pitch = "C0";
  }

  display() {
    this.p.strokeWeight(1);
    this.p.stroke(0);
    let c = this.col;
    if (this.playing) {
      this.p.fill(this.p.red(this.col) * 2, this.p.green(this.col) * 2, this.p.blue(this.col) * 2)
    } else this.p.fill(this.col);
    this.p.ellipse(this.x, this.y, this.w);
    this.p.textAlign(this.p.CENTER);
    this.p.fill(255);
    this.p.text(this.message, this.x, this.y)
  }
}
*/