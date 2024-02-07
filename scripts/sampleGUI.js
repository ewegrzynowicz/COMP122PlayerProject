const sampleGUI = p => {
  var partnum, fileName, title;
  var playButton, stopButton, loopButton, revButton, rmsMeter;
  var object, player, part, meter, bpm = 120;
  var ready = false, looping = false, reversed = false;

  p.setObj = function(_o, _i) {
    object = _o;
    partnum = _i;
    if(object.hasOwnProperty("name")){
      title = object.name;
    }
    if(object.hasOwnProperty("file")){
      fileName = object.file;
      meter = new Tone.Meter();
      player = new Tone.GrainPlayer(fileName, function(){
        //after the player has loaded:
        console.log("loaded sample " + fileName);
        console.log(player.buffer);
        console.log("duration " + player.buffer.duration);
  //          let event = makeEvent(player);
        part = new Tone.Part(() => {
          player.start();
        }, [0]);
        ready = true;
        if(object.hasOwnProperty("duration")){
          part.loopEnd = object.duration;      
        } else {  
          part.loopEnd = player.buffer.duration;
        }
      }).toDestination();
      player.fan(meter, Tone.Destination);
      if(object.hasOwnProperty("bpm")){
        // scale playback rate to tempo
        bpm = object.bpm;
      }
    }
  }

  p.setup = function(){
    p.createCanvas(400, 60);
    rmsMeter = new RMS_Meter(p, 10, p.height - 20);
    playButton = new SamplePlayButton(p, 150, p.height/2);
    stopButton = new SampleStopButton(p, 210, p.height/2);
    loopButton = new SampleLoopButton(p, 270, p.height/2);
    revButton = new SampleReverseButton(p, 330, p.height/2);
  }

  p.draw = function(){
    p.background(200);
    p.fill("white");
    p.textAlign(p.LEFT, p.TOP);
    p.text((partnum + 1) + ". " + title, 10, 5, 120, 40);
    playButton.display(ready);
    stopButton.display(ready);
    loopButton.display(looping);
    revButton.display(reversed);
    rmsMeter.display(meter.getValue());

  }

  p.mousePressed = function(){
    //button presses
    let d = document.getElementById("samples");
    if(ready && Tone.Transport.state == "started"){
      //play button
      if(p.dist(p.mouseX, p.mouseY, playButton.x, playButton.y) < 25){
        //play sample
        //set playback rate
        player.playbackRate = Tone.Transport.bpm.value / bpm;
        //get next measure
        let t = Tone.Transport.position;
        let times = t.split(':');
        times[2] = 0; // set to downbeat;
        times[1] = 0; // set to first beat
        times[0] = Number(times[0]) + 1; // move up to the next measure;
        t = times[0] + ":" + times[1] + ":" + times[2]; 
        // console.log("sample at " + t);
        part.stop();
        part.start(t);
      }
      //loop button
      if(p.dist(p.mouseX, p.mouseY, loopButton.x, loopButton.y) < 25){
        if(looping){
          looping = false;
          part.loop = false;
        } else {
          looping = true;
          part.loop = true;
        }
      }
      // reverse button
      if(p.dist(p.mouseX, p.mouseY, revButton.x, revButton.y) < 25){
        if(reversed){
          reversed = false;
          player.reverse = false;
        } else {
          reversed = true;
          player.reverse = true;
        }
      }
      // stop button
      if(p.dist(p.mouseX, p.mouseY, stopButton.x, stopButton.y) < 25){
        player.stop();
        part.stop();
      }
      
    }
  }
}

class SamplePlayButton {
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
  }
  display(ready){
    this.p.push();
    this.p.translate(this.x, this.y);
    if(ready){
      this.p.fill("green");
    } else {
      this.p.fill("gray");
    }
    this.p.stroke("white");
    this.p.strokeWeight(3);
    this.p.ellipse(0, 0, 40);
    this.p.fill("white");
    this.p.strokeJoin(this.p.ROUND);
    this.p.beginShape();
    this.p.vertex(this.p.cos(0) * 10, this.p.sin(0) * 10);
    this.p.vertex(this.p.cos(this.p.PI - 1) * 12, this.p.sin(this.p.PI - 1) * 12);
    this.p.vertex(this.p.cos(this.p.PI + 1) * 12, this.p.sin(this.p.PI + 1) * 12);
//    this.p.vertex(20, 0);
//    this.p.vertex(-20, 20);
    this.p.endShape(this.p.CLOSE);
//    this.p.triangle(-20, -20, 20, 0, -20, 20, 10);
    this.p.pop();
  }
}

class SampleStopButton {
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
  }
  display(ready){
    this.p.push();
    this.p.translate(this.x, this.y);
    if(ready){
      this.p.fill("red");
    } else {
      this.p.fill("gray");
    }
    this.p.stroke("white");
    this.p.strokeWeight(3);
    this.p.ellipse(0, 0, 40);
    this.p.fill("white");
    this.p.strokeJoin(this.p.ROUND);
    this.p.beginShape();
    this.p.vertex(-7, -7);
    this.p.vertex(7, -7);
    this.p.vertex(7, 7);
    this.p.vertex(-7, 7);
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }
}


class SampleLoopButton {
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
  }
  display(looping){
    this.p.push();
    this.p.translate(this.x, this.y);
    if(looping){
      this.p.fill("green");
    } else {
      this.p.fill("gray");
    }
    this.p.stroke("white");
    this.p.strokeWeight(3);
    this.p.ellipse(0, 0, 40);
    this.p.noFill();
    this.p.arc(0, 0, 25, 25, 0, this.p.PI + this.p.HALF_PI);
    let ax = this.p.cos(- this.p.HALF_PI) * 25/2;
    let ay = this.p.sin(- this.p.HALF_PI) * 25/2;
    ax += 3;
    this.p.line(ax, ay, ax - 5, ay - 2);
    this.p.line(ax, ay, ax - 5, ay + 2);
    //this.p.ellipse(ax, ay, 10);
    this.p.noStroke();
    this.p.fill("white");
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text("L", 0, 0);
    this.p.pop();
  }
}

class SampleReverseButton {
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
  }
  display(reversed){
    this.p.push();
    this.p.translate(this.x, this.y);
    if(reversed){
      this.p.fill("green");
    } else {
      this.p.fill("gray");
    }
    this.p.stroke("white");
    this.p.strokeWeight(3);
    this.p.ellipse(0, 0, 40);
    this.p.noFill();
    this.p.arc(5, 0, 20, 20, 0, this.p.PI/2)
    let ax = -10;
    let ay = 10;
    this.p.line(ax, ay, ax + 5, ay - 2);
    this.p.line(ax, ay, ax + 5, ay + 2);
    this.p.line(ax, ay, ax + 15, ay);
    this.p.noStroke();
    this.p.fill("white");
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text("Rev", 0, 0);
    this.p.pop();
  }
}

class RMS_Meter{
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
  }

  display = function(value){
    this.p.push();
    this.p.translate(this.x, this.y);
    let rms = this.p.map(value, -96, 0, 0, 100);
    if(rms < 0){
      rms = 0;
    }
    this.p.fill("gray");
    this.p.rect(0, 0, 100, 15); // meter background
    let blocks = Math.ceil(rms / 5); // 5px meter segments
    //this.p.stroke("white");
    for(let i = 0; i < blocks; i++){
      if(i < 15){
        this.p.fill("green");
      } else if (i >= 15 && i < 18) {
       this.p.fill("yellow");
      }
      else if (i >= 18) {
        this.p.fill("red");
      }
      this.p.rect(i * 5, 0, 5, 15);
    }

    let mval = value;
    if(mval < -96){
      mval = "-∞ ";
    } else {
      mval = mval.toFixed(0); // truncate
    }
    this.p.textAlign(this.p.LEFT, this.p.CENTER);
    this.p.fill("white");
    this.p.text(mval + " dB", 0, 7);
    this.p.pop();

  }
}