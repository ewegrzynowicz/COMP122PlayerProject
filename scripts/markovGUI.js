/*
* P5.js functions for GUI
* Creates a user interface with a graphical representation of the Markov graph and connections between nodes
*/
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
    }
    if(obj.hasOwnProperty("rhythmSet")){
      rhythmSet = obj.rhythmSet;
    }
  }

  p.setup = function() {
    p.createCanvas(400, 400);
    tButton = new Button(p, p.width / 2, p.height / 2, p.color(0, 200, 0), "start");
    if(pitchSet){
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
        let v3 = p.p5.Vector.lerp(v1, v2, 0.7);
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
        loop.start();
        tButton.col = color(0, 255, 0);
      } 
      else if (loop && loop.state == "started") {
        loop.stop();
        tButton.col = color(0, 200, 0);
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
      fill(red(this.col) * 2, green(this.col) * 2, blue(this.col) * 2)
    } else fill(this.col);
    this.p.ellipse(this.x, this.y, this.w);
    this.p.textAlign(this.p.CENTER);
    this.p.fill(255);
    this.p.text(this.message, this.x, this.y)
  }
}
