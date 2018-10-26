 function loadMobilenet() {
  return tf.loadModel('./JS/model.json');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(tf.fromPixels(img));
    img.onerror = (err) => reject(err);
  });
}


function cropImage(img) {
  const width = img.shape[0];
  const height = img.shape[1];

  // use the shorter side as the size to which we will crop
  const shorterSide = Math.min(img.shape[0], img.shape[1]);

  // calculate beginning and ending crop points
  const startingHeight = (height - shorterSide) / 2;
  const startingWidth = (width - shorterSide) / 2;
  const endingHeight = startingHeight + shorterSide;
  const endingWidth = startingWidth + shorterSide;

  // return image data cropped to those points
  return img.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
}


function capture() {
  return tf.tidy(() => {
    const webcamImage = tf.fromPixels(this.webcamElement);
    const croppedImage = this.cropImage(webcamImage);
    const batchedImage = croppedImage.expandDims(0);

    return batchedImage.toFloat().div(oneTwentySeven).sub(one);
  });
}


function resizeImage(image) {
  return tf.image.resizeBilinear(image, [128, 128]);
}

function batchImage(image) {
  const batchedImage = image.expandDims(0);
  return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
}

function loadAndProcessImage(image) {
  const croppedImage = cropImage(image);
  const resizedImage = resizeImage(croppedImage);
  const batchedImage = batchImage(resizedImage);
  return batchedImage;
}

function predict(imgsrc){

  loadMobilenet().then(pretrainedModel => {
    loadImage(imgsrc).then(img => {
    const processedImage = loadAndProcessImage(img);
    const prediction = pretrainedModel.predict(processedImage);
    prediction.print();
    prediction.as1D().argMax().print();
    const labelPrediction = prediction.as1D().argMax().dataSync()[0];

  });
});
  
}
predict("./DATA/safe_image.jpeg");