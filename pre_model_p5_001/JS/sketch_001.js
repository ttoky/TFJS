
//////////////////////////////////////////////////

//---- P5.js ------

var capture;
var c;
var myCanvas;

function setup() {
 createCanvas(390, 240);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  //capture.hide();
}

function draw() {
  background(255);
  image(capture, 0, 0, 320, 240);


 

}

function mouseReleased() {

 //new Promise((resolve, reject) => {
    const img = capture;
    console.log(capture);
    const processedImage = loadAndProcessImage(capture);
    //img.onload = () => resolve(tf.fromPixels(img));
    //img.onerror = (err) => reject(err);
  //});
}


