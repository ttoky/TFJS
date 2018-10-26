//---- P5.js ------

var capture;
var c;
var myCanvas;

function setup() {
  myCanvas = createCanvas(390, 240);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  //capture.hide();
}

function draw() {
  background(255);
  image(capture, 0, 0, 320, 240);


 

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

});


}
