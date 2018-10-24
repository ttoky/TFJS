//import * as tf from '@tensorflow/tfjs';

var img=new Image();
img.src="https://source.unsplash.com/random/";

//--------loadModel

  function modelLoad() {
  return tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
}

var model = modelLoad();

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(tf.fromPixels(img));
    img.onerror = (err) => reject(err);
  });
}

//--------img preprocessing [ 224 x 224 for now]
function cropImage(img) {
  const width = img.shape[0];
  const height = img.shape[1];


  const shorterSide = Math.min(img.shape[0], img.shape[1]);
  const startingHeight = (height - shorterSide) / 2;
  const startingWidth = (width - shorterSide) / 2;
  const endingHeight = startingHeight + shorterSide;
  const endingWidth = startingWidth + shorterSide;


  return img.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
}

function resizeImage(image) {
  return tf.image.resizeBilinear(image, [224, 224]);
}

function batchImage(image) {
  const batchedImage = image.expandDims(0);
  return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
}

//--------loadImage pipeline
function loadAndProcessImage(image) {
  const croppedImage = cropImage(image);
  const resizedImage = resizeImage(croppedImage);
  const batchedImage = batchImage(resizedImage);
  return batchedImage;
}


//--------model prediction 
var imgsrc ="./DATA/0.jpg";

  model.then(pretrainedModel => {
    loadImage(imgsrc).then(img => {
    const processedImage = loadAndProcessImage(img);
    const prediction = pretrainedModel.predict(processedImage);
    prediction.print();
    prediction.as1D().argMax().print();
    const labelPrediction = prediction.as1D().argMax().dataSync()[0];

  });
});


