const beatPartGUI = p => {
  var beatSynth = drumSampler;//new Tone.Synth().toDestination();
  var obj;
  var beatButton, muteButton; // buttons
  var part; //Tone.js Part reference
  var loop; // Tone.js Loop reference
  var cells = []; // array of cell objects
  var cellCount = 0; // keep count of active cell
  var mute = false; // mute the pattern
  var margin = 50; // left padding
  var pitch = "C3"; // default pitch
  var div = document.getElementById("beatParts");

  p.setObj = function(_obj) {
    obj = _obj;
    if (obj.hasOwnProperty("pitch"))
      pitch = obj.pitch; //otherwise default "C3"
    let w = 15; // width of cell
    let plays = false;
    if (obj.hasOwnProperty("pattern")) {
      //p.text(obj.pattern, 100, p.height/2);
      for (let i = 0; i < obj.pattern.length; i++) {
        if (obj.pattern[i] == '1') {
          plays = true;
        } else plays = false;
        if (obj.pattern.length > 16) {
          w = 240 / obj.pattern.length;
        } else w = 15;
        cells.push(new Cell(p, 40 + i * w, 13, w));
        cells[i].w = w; // adjust as necessary
        cells[i].plays = plays;
      }
    }
    loop = new Tone.Loop((time) => {
      // triggered every sixteenth note.
      //console.log(time);
      p.playBeat(time);
    }, "16n")
    loop.stop();
    return loop; // return loop reference to beats.makeBeats()
  };

  p.getLoop = function(){
    return loop;
  }

  p.setup = function() {
    p.createCanvas(330, 40);
  }

  p.setSynth = function(_synth) {
    beatSynth = _synth;
  }

  p.draw = function() {
    p.background(200);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.text(obj.name + " (" + obj.pattern.length + ")", 5, 2);
    for (let i = 0; i < cells.length; i++) {
      cells[i].display(); // draw all the cells
    }
  }

  p.loopStart = function() {
//    if (loop.state == 'started') {
//      loop.stop();
//      cellCount = 0; // reset counter
//    } else {
      cellCount = 0;
      let t = Tone.Transport.position;
      let times = t.split(':');
      times[2] = 0; // set to downbeat;
      times[1] = 0; // set to first beat
      times[0] = Number(times[0]) + 1; // move up to the next measure;
      t = times[0] + ":" + times[1] + ":" + times[2];

      loop.start(t); // time in beats or seconds
//    }
  }

  p.loopStop = function() {
    loop.stop();
    cellCount = 0; // reset counter
  }

  p.playBeat = function(time) {
    cells[cellCount].on = true; // light it up!
    if (cells[cellCount].plays && !mute) {
      beatSynth.triggerAttackRelease(pitch, "16n", time);
      //play synth
    }

    //turn off adjacent cells
    if (cellCount == 0) {
      cells[cells.length - 1].on = false;
    } else cells[cellCount - 1].on = false;
    cellCount++;
    cellCount = cellCount % cells.length; //0%4==0, 4%4==0, 3%4==3
  }

  p.mousePressed = function() {
    if (p.mouseY < p.height && p.mouseY > 0 && div.style["display"] == "block") {
      if (loop.state == 'started') {
        loop.stop();
        cellCount = 0; // reset counter
      }
      else {
        let t = Tone.Transport.position;
        let times = t.split(':');
        times[2] = 0; // set to downbeat;
        times[1] = 0; // set to first beat
        times[0] = Number(times[0]) + 1; // move up to the next measure;
        t = times[0] + ":" + times[1] + ":" + times[2];
        loop.start(t); // time in beats or seconds
      }
    }
  }
}

const beatsGUI = p => {
  let menu, plusButton, playButton;
  let objs = [];
  let loops = []; // get loop sketches from each part and add to array
  var div = document.getElementById("part3-contents");

  p.setLoops = function(arr){
    loops = arr;
    console.log("loops array for big button: ");
    for(let i = 0; i < loops.length; i++){
      console.log(loops[i]);
      console.log(loops[i].state);
    }
  }
  
  p.setup = function() {
    p.createCanvas(350, 60);
    plusButton = new PlusButton(p, p.width * 11 / 12, p.height / 2);
    playButton = new PlayButton(p, p.width / 2, p.height / 2)
  }

  p.draw = function() {
    p.background(200);
    p.text("Beats", 20, p.height / 2);
    plusButton.display();
    playButton.display();
    for(let i = 0; i < loops.length; i++){
      state = loops[i].getLoop().state;
      if (state == "started")
        playButton.playing = true;
    }
  }

  p.nextMeasure = function(){
    let t = Tone.Transport.position;
    let times = t.split(':');
    times[2] = 0; // set to downbeat;
    times[1] = 0; // set to first beat
    times[0] = Number(times[0]) + 1; // move up to the next measure;
    t = times[0] + ":" + times[1] + ":" + times[2];    
    return t
  }

  p.mousePressed = function() {
    let partsDiv = document.getElementById("beatParts");
    if (p.dist(p.mouseX, p.mouseY, plusButton.x, plusButton.y) < plusButton.d / 2) {
      if (partsDiv.style.display === "none") {
        partsDiv.style.display = "block";
        plusButton.r = p.PI / 4
      } 
      else {
        partsDiv.style.display = "none";
        plusButton.r = 0;
      }
    }

    if (p.dist(p.mouseX, p.mouseY, playButton.x, playButton.y) < playButton.w / 2 && div.style["display"] == "block") {
      if (playButton.playing) {
        // stop the beat
        playButton.playing = false;
        for(let i = 0; i < loops.length; i++){
          loops[i].loopStop();
        }
      } 
      else {
        //start beat on next measure
        playButton.playing = true;

        for(let i = 0; i < loops.length; i++){
          loops[i].loopStart(); // P5 sketch for each loop handles timing and loop start/stop
//          console.log("starting beat" + i + " at " + t);
          console.log("loop progress: " + loops[i].progress)
        }
      }
    }
  }
}

class PlusButton {
  constructor(_p, _x, _y) {
    this.p = _p; // p5 instance
    this.x = _x;
    this.y = _y;
    this.r = 0; // rotation
    this.d = 30; // diameter
  }

  display() {
    //looks like a big plus sign
    //rotates into an X when clicked
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.rotate(this.r);
    this.p.strokeWeight(5);
    this.p.line(-this.d / 2, 0, this.d / 2, 0);
    this.p.line(0, -this.d / 2, 0, this.d / 2);
    this.p.pop();
  }
  click() {
    if (this.r > 0) {
      this.r = 0;
    } else {
      this.r = p.PI / 4;
    }
  }
}

class Cell {
  /** 
  individual cell in a beat pattern interface
  */
  constructor(_p, _x, _y, _w) {
    this.p = _p; // p5 instance
    this.x = _x;
    this.y = _y;
    this.w = _w; // width (default)
    this.h = 20; // height
    this.plays = false; // cell plays a note (default false)
    this.on = false; // is this cell the focus on this 16th note?
  }

  display() {
    if (this.on) {
      if (this.plays)
        this.p.fill(this.p.color("#4caf50")); // active player, green
      else
        this.p.fill(150) // non-player, active (gray)
    } else { // not on
      if (this.plays)
        this.p.fill(this.p.color("#ba64e8")); // non-active player, purple
      else
        this.p.fill(255); //non-player, not active (white)
    }
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.rect(0, 0, this.w, this.h, 2);
    this.p.fill(0);
    //this.p.text(Math.trunc(this.w), 0, 0);
    this.p.pop();

  }

}