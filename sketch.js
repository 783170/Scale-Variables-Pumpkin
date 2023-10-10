let p; // scalar value
let stemCol = [];
let leaf = []; 
let numLeaf = 10;
let shift = 0; // shift sky color
let time = 0; // increments by PI/width each frame to make one cycle 2PI
let dayNight = 1; // flips from day to night

function setup() {
  // sets up canvas to scale based on the size of the window
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  if(width>height)
    p = height/100;
  else
    p = width/100;
  
  // sets the random shades of green for the stem
  for(let i=0; i<p*24; i++)
    stemCol[i] = random(20);
  
  // sets up a 2D array to hold all values associated with all leaves 
  // x, y, speed, red, green
  for (let i = 0; i<5; i++)
    leaf[i] = [];
  for (let i = 0; i<numLeaf; i++){
    leaf[0][i] = random(-180,180);
    leaf[1][i] = -1*random(height/400,height/100);
    leaf[2][i] = random(1,width/100);
    leaf[3][i] = random(110,200);
    leaf[4][i] = random(10,150);
  }
}

function draw() {
  noStroke();
  
  // sets the sky
  background(100*shift/width-20,100*shift/width+50,100*shift/width+80);
  celestial();
  
  // grass
  fill(25+40*shift/width,50+40*shift/width,0);
  rect(0, height/1.5, width, height);
  pumpkin(width/2, height/1.4);
  for(let i=0; i<numLeaf; i++)
    fall(i);
  if((shift >= width)||(shift <= 0))
    dayNight = dayNight * -1;
}

function celestial (){
  ellipseMode(CORNER);
  // moon - shifted back PI/2 to be opposite of sun
  fill(255,254,122);
  ellipse(width/2+(width/2+p*17)*cos(time-PI/2), height/2+p*2+height/2*sin(time-PI/2), p*16, p*16);
  fill(100*shift/width-20,100*shift/width+50,100*shift/width+80);
  ellipse(width/2+(width/2+p*17)*cos(time-PI/2), height/2+p*2+height/2*sin(time-PI/2), p*10, p*10);
  // sun - shifted forward PI/2 to be opposite of moon
  fill(255,205,40);
  ellipse(width/2+(width/2+p*17)*cos(time+PI/2), p*50+p*2+height/2*sin(time+PI/2), p*16, p*16);

  // shift controls the brightness of the sky based on if its day or night
  shift+=dayNight;
  // increments by PI/width each frame to make one cycle 2PI
  time+=PI/width;
}

function fall (i){
  // sets the stroke/fill colors using stored values in array and a less sensitive shift
  let leafShift = shift/10;
  fill(leaf[3][i]+leafShift,leaf[4][i]+leafShift,0);
  stroke(leaf[3][i]+leafShift-20,leaf[4][i]+leafShift-20,0);
  strokeWeight(p/12);
  // sets new x using the current x plus a step with a cosine function to create sweaping motion
  // then multiply by (width/2) so x has a range of -width/2 to width/2, then add width/2 to center
  let x = cos(leaf[0][i]+=0.01)*(width/2)+width/2;
  // sets new y using the current y plus a step proportional to the canvas height and leaf speed
  let y = (leaf[1][i]+=0.01)*height/leaf[2][i];
  quad(p*2.5+x,p*5+y, p*1.2+x,p*2.8+y, p*8.8+x,p*2.8+y, p*7.5+x,p*5  +y);
  quad(p*5  +x,p*7+y, p*6.7+x,p*2.8+y, p*5  +x,p*0.6+y, p*3.3+x,p*2.8+y);
  quad(p*2.5+x,p*5+y, p*2.3+x,p*5.5+y, p*7.7+x,p*5.5+y, p*7.5+x,p*5  +y);
  // if the leaf's next step if pasted height, reset the leaf
  if ((leaf[1][i]+=0.01)*height/leaf[2][i] - 30 > height){
    leaf[1][i] = -1;
    leaf[2][i] = random(1,width/100);
    leaf[3][i] = random(110,200);
    leaf[4][i] = random(10,150);
  }
}

function pumpkin (x, y) {
  ellipseMode(CENTER);
  x-=p*20;
  y-=p*4;
  cell(95,  p*20+x,     y, p*40);
  cell(100, p*10+x, p*2+y, p*42);
  cell(100, p*30+x, p*2+y, p*42);
  cell(100,      x, p*4+y, p*44);
  cell(100, p*40+x, p*4+y, p*44);
  stem(x-p*20, y-p*36);
  cell(100, p*10+x, p*6+y, p*42);
  cell(100, p*30+x, p*6+y, p*42);
  cell(105, p*20+x, p*8+y, p*40);
}

function stem (x, y) {
  let stemShift = 40*shift/windowWidth-20;
  noFill();
  strokeWeight(p/0.8);
  // draws a series of curves for the left edge of the stem
  for(let i=1; i<=p*4; i++){
    stroke(stemCol[i]+20+stemShift,stemCol[i]+40+stemShift,0);
    curve(p*14+x,y, p*28+i*3+x,p*22+i*2+y, p*33+i+x,p*6+i/2+y, p*14+x,y);
  }
  // draws a series of curves for the right edge of the stem
  for(let i=1; i<=p*4; i++){
    stroke(stemCol[i]+30+stemShift,stemCol[i]+60+stemShift,0);
    curve(p*52+x,y, p*40+i*2+x,p*30-i*2+y, p*37+i+x,p*8-i/2+y, p*52+x,y);
  }
  // draws the top of the stem
  strokeWeight(p*0.7);
  stroke(35+stemShift,60+stemShift,0);
  fill(35+stemShift,60+stemShift,0);
  quad(p*33+x, p*6+y, p*37+x, p*8+y, p*41+x, p*6+y, p*37+x, p*4+y);
}

function cell(numSteps, x, y, ellipseHeight) {
  let count=0;
  let pumpShift=80*shift/width+60;
  noFill();
  strokeWeight(p/2);
  for(let i=0; i<numSteps; i++){
    stroke(pumpShift, pumpShift/2, 0);
    ellipse(x, y, (ellipseHeight/1.5)+count, ellipseHeight+count);
    // makes each ellipse fill a little brighter
    pumpShift+=0.5;
    // makes each ellipse slightly smaller
    count-=p/3.8;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
