
//////////////////////////////////////////////////


var w = window.innerWidth;
var h = window.innerHeight;

const constraints = window.constraints = {
  audio: false,
  video: true
};

//--------preload font --------------------------------------
function preload() {
 font_keywords = loadFont('font/cmb10.ttf'); 
//font_keywords = loadFont('http://www.ttokypj.com/1805_AI.ON.Us/dev/font/NotoSansCJKtc-Medium.ttf'); 
}

//-------- EVENT--------------------------------------------
function windowResized() {
w = window.innerWidth;
h = window.innerHeight;

/*
var hh = h*0.7;

  ms = height * ceil(sqrt(w / (1.0*hh))) / floor(sqrt(N));
  wn= Math.ceil(w / ms);
  hn= Math.ceil(hh / ms);
  w_half=floor(wn/2);
  h_half=ceil(hn/2);
  
  for (var i=0;i<N; i++) {
    var x=floor(i%(wn));
   var y=floor((i/(wn)));
   eachs[i].x=x*ms;
   eachs[i].y=y*ms;
   eachs[i].ms=ms;

}
*/

//resizeCanvas(w, h);
}

//-------- p5.js--------------------------------------------


var capture;
var mycanvas;
var captured_img;

//----bg pattern
var N = 600;
var ms;
var wn, hn, w_half, h_half;
var eachs =[];
var grades = [];
var mygrade;
var g_text=["A", "B", "C", "D", "F"];

//----main------------------

function setup() {
 //---- main canvas set
  mycanvas=createCanvas(800,600);
  mycanvas.parent('div_main');
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
  pixelDensity(1);

  captured_img = createImage(capture.width,capture.height);

  background(255,0,0);


  //---bg pushing each
  ms = height * ceil(sqrt(width / (1.0*height))) / floor(sqrt(N));
  wn= Math.ceil(width / ms);
  hn= Math.ceil(height / ms);
  w_half=floor(wn/2);
  h_half=ceil(hn/2);
  
  for (var i=0;i<N; i++) {
    var x=floor(i%(wn));
   var y=floor((i/(wn)));
   var interval = random(30,60);

    var e = new each(x*ms, y*ms, i, interval);
     eachs.push(e);

}

for (var i=0; i<5; i++){
  var cp = width/6;
  var g = new grade(i*cp+cp*0.5,400,cp*0.7,cp,i);
  grades.push(g);
}

}

function draw() {
  background(0,0,255);


     image(capture, width*0.5-capture.width*0.5,50, 320,250);
 
  noStroke();
  for (var j=0; j<hn; j++){
    for (var i=0; i<wn;i++){
      var number = i+j*wn;

       if(j<(h_half-2)){
        //   eachs[number].draw();

      }


      if((j<(h_half-5))|| (j > (h_half-1))){
           eachs[number].draw();

      } else{

      if(i>(w_half+1)){
       eachs[number].draw();
      }
      if(i<(w_half-2)){
        eachs[number].draw();
     
      }

      }  
      
    }

for(var i=0; i<grades.length; i++){
  grades[i].draw();
  }
}





}

function updateImage(){

  captured_img.loadPixels();
  var a = capture.loadPixels();
  var a_pixels=a.pixels;

  for( var j=0; j<captured_img.height; j++){
    for( var i=0; i<captured_img.width; i++){
      var index = (i)+j*captured_img.width;
      var r = a_pixels[index];
      var g = a_pixels[index+1];
      var b = a_pixels[index+2];
      var ap = a_pixels[index+3];
      captured_img.set(i, j, color(r,g,b,ap));
  }

  }

   captured_img.updatePixels();
}

function mouseReleased() {

  var a = capture.loadPixels();
  var capturedPixels = tf.fromPixels(a.imageData);


  load_model().then(pretrainedModel => {
    const processedImage = loadAndProcessImage(capturedPixels);
    const prediction = pretrainedModel.predict(processedImage);
    prediction.print();
    prediction.as1D().argMax().print();
    const labelPrediction = prediction.as1D().argMax().dataSync()[0];
    mygrade=labelPrediction;

});

  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
}


function each(_x,_y,_index, _interval){
  this.x=_x;
  this.y=_y;
  this.index=_index;
  this.half =ms*0.5;
  this.toggle = [0,0,1,0];
  this.tgStep;
  this.interval=_interval;

  this.dimension=[this.x, this.y, ms];
  this.stage=0;
  this.count=0;

  this.points =[
  [this.dimension[0]+this.dimension[2]*0.5, this.dimension[1]+this.dimension[2]*0.5],
  [this.dimension[0]+this.dimension[2], this.dimension[1]+this.dimension[2]],
  [this.dimension[0], this.dimension[1]+this.dimension[2]],
  [this.dimension[0], this.dimension[1]],
  [this.dimension[0]+this.dimension[2], this.dimension[1]]
  ];


  this.draw=function(){
    fill(0,random(255),random(255));
    //rect(this.x,this.y,ms,ms);
   this.update();
   this.firstTg();
   this.secondTg();
   this.thirdTg();
   this.forthTg();


  }

  this.update=function(){
      this.count++;

      if (this.count > this.interval) {
        for (var i=0; i<this.toggle.length-1; i++) {
          this.toggle[i]=this.toggle[i+1];
        }
        this.toggle[this.toggle.length-1]=floor(random(0, 2));
        this.count=0;
      }
    } 


    this.firstTg=function(){

      if (this.toggle[0]==0) {
        //strokeWeight(3);
        //stroke(0,0,255);
         fill(0,0,255);
    } else if (this.toggle[0]==1) {
         fill(0,255,255);
         //stroke(0,255,255);
         //strokeWeight(1);
    }
  
     beginShape();
     vertex(this.x+this.half, this.y+this.half);
    vertex(this.x+ms, this.y+ms);
    vertex(this.x, this.y+ms);

    endShape(CLOSE);

    }

    this.secondTg=function(){

      if (this.toggle[1]==0) {
         fill(0,100,255);
            //strokeWeight(2);
        //stroke(0,100,255);
    } else if (this.toggle[1]==1) {
         fill(200,255,255);
         //strokeWeight(0.5);
         //stroke(200,255,255);
    }
  
     beginShape();
     vertex(this.x+this.half, this.y+this.half);
    vertex(this.x, this.y+ms);
        vertex(this.x, this.y);

    endShape(CLOSE);

    }

   this.thirdTg=function(){

      if (this.toggle[2]==0) {
         fill(0,200,255);
    } else if (this.toggle[2]==1) {
         fill(255,255,255);
    }
  
     beginShape();
     vertex(this.x+this.half, this.y+this.half);
     vertex(this.x, this.y);
     vertex(this.x+ms, this.y);

    endShape(CLOSE);

    }

    this.forthTg=function(){

      if (this.toggle[3]==0) {
         fill(0,0,200);
    } else if (this.toggle[3]==1) {
         fill(0,255,200);
    }
  
     beginShape();
     vertex(this.x+this.half, this.y+this.half);
     vertex(this.x+ms, this.y);
     vertex(this.x+ms, this.y+ms);

    endShape(CLOSE);

    }


}


function grade(_x, _y, _w, _h, _index){
  this.x=_x;
  this.y=_y;
  this.w=_w;
  this.h=_h;
  this.index=_index;

  this.draw=function(){
    if(mygrade==this.index){
      fill(255,0,0);
    } else{
      fill(255);
    }
    rect(this.x, this.y, this.w,this.h);
    fill(0);
    textSize(80);
    textAlign(CENTER, BASELINE);
    text(g_text[this.index],this.x+this.w*0.5,this.y+this.h*0.75);


  }
}
