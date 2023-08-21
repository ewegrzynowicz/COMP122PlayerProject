/**
 * This UI script uses P5.js to create an animated and interactive keyboard. 
 * It works in conjunction with the script "synth.js" that contains the noteOn() and noteOff() function definitions as well as definitions for synths using Tone.js
 *  - DB Wetzel, Feb. 2022
 */
var keyboard = []; // an array of keys
var whiteKeys = [0, 2, 4, 5, 7, 9, 11];
var size = 16; // how many keys?
var start = 57; // lowest key (MIDI note #57 is A3)
//QWERTY keymap
var keyMap = ['a', 'w', 's', 'd', 'r', 'f', 't', 'g', 'h', 'u', 'j', 'i', 'k', 'o', 'l', ';'];

function setup() {
  // P5 setup funciton (runs once on load)
  createCanvas(800, 400);
  let keypos = 0;
  for (let i = 0; i < size; i++) {
    // generate array of key objects
    let key = start + i; // starting note
    if (whiteKeys.indexOf(key % 12) < 0) { // black
      keyboard.push(new Key(60 + keypos * 40, 100, keyMap[i], key, false));
    } else { // white
      keyboard.push(new Key(80 + keypos * 40, 100, keyMap[i], key, true));
      keypos++;
    }
  }
}

//P5 event handler looks for key presses
function keyPressed() {

  let pressedKey = keyMap.indexOf(key); //is the key in the map?
  if (pressedKey >= 0) // if so, it's 0 or higher
    keyboard[pressedKey].press(); // call the key object's press() method

  return false;
}

//P5 event handler for the key release
function keyReleased() {
  let releasedKey = keyMap.indexOf(key);
  if (releasedKey >= 0)
    keyboard[releasedKey].release(); // key object release() method
  return false;
}


//P5 Event loop -- runs 60 times per second
function draw() {
  background(200);//medium grey background

  for (let i = 0; i < keyboard.length; i++) {
    keyboard[i].displayW(); //draw the white keys
  }
  for (let i = 0; i < keyboard.length; i++) {
    keyboard[i].displayB(); //draw the black keys
    if (mouseIsPressed) {
      keyboard[i].mousePressed(mouseX, mouseY, true);
    }
    else {
      keyboard[i].mousePressed(mouseX, mouseY, false);
    }
  }
}

/** Constructor function for individual keys un keyboard UI */
function Key(X, Y, QWERTY, note, isWhiteKey) {
  this.x = X; // screen position
  this.y = Y;
  this.white = isWhiteKey; //true or false (passed in)
  this.qwerty = QWERTY;
  this.px = X; // target for mouse press
  this.py = Y; // move these in .display() methods

  let noteNames = ['C', "C#", 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  this.noteNum = note; // MIDI note number passed in
  let letter = noteNames[note % 12];
  let octave = Math.trunc(note / 12) - 1;

  this.noteName = letter + octave.toString();

  this.pressed = false;

  this.size = 40;

  this.mousePressed = function(_x, _y, on) { // receives mouse coordinates + boolean "on"
    let d = dist(mouseX, mouseY, this.px, this.py);
    if (!this.pressed && d < 20 && on) {
      this.press();
      return [this.noteNum, 127];
    }
    else if (this.pressed && d < 20 && !on){
      this.release();
    }
  }

  this.press = function() {
    //console.log([this.noteName, 127]);
    this.pressed = true;
    if(typeof noteOn === 'function')
      noteOn(this.noteName);
  }

  this.release = function() {
    //console.log([this.noteName, 0]);
    this.pressed = false;
    if(typeof noteOff === 'function')
      noteOff(this.noteName);
  }

  this.displayW = function() {
    //display white keys
    if (this.white) {
      if (this.pressed) {
        fill(200);
      } else fill(255);
      let w = this.size;
      let h = this.size * 4.7;
      rect(this.x, this.y, w, h);
      //      fill(255, 0, 0, 100);
      this.px = this.x + w / 2;
      this.py = this.y + h - 40;
      //      ellipse(this.px, this.py, 40);
      textAlign(CENTER);
      fill(0)
      text(this.noteNum, this.x + 20, this.y + 140);
      text(this.noteName, this.x + 20, this.y + 155);
      text("(" + this.qwerty + ")", this.x + 20, this.y + 170);
    }
  }
  this.displayB = function() {
    //display black keys
    if (!this.white) {
      if (this.pressed) {
        fill(100); //grey
      } else fill(0);
      let w = this.size * 4 / 5;
      let h = this.size * 3;
      rect(this.x, this.y, w, h);
      fill(255, 0, 0, 100);
      this.px = this.x + w / 2;
      this.py = this.y + h - 30;
      //      ellipse(this.px, this.py, 40);
      textAlign(CENTER);
      fill(255);
      text(this.noteNum, this.x + 15, this.y + 80);
      text(this.noteName, this.x + 15, this.y + 95);
      text("(" + this.qwerty + ")", this.x + 15, this.y + 110);
    }
  }

}