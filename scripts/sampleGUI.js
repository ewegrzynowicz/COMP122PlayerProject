const sampleGUI = p => {
  var thisPart;
  var partnum;

  p.setPlayer = function(part, i){
    thisPart = part;
    partnum = i;
  }

  p.setup = function(){
    p.createCanvas(400, 60);
  }
  p.draw = function(){
    p.background(200);
    p.textAlign(p.CENTER);
    p.text("Sample " + partnum, p.width/2, p.height/2)
  }
}
