const beatPartGUI = p => {
  p.setup = function(){
    p.createCanvas(400, 60);
  }
  p.draw = function(){
    p.background(200);
    p.textAlign(p.CENTER);
    p.text("Sample", p.width/2, p.height/2)
  }
}
