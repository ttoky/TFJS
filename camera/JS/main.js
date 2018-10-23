//import * as tf from '@tensorflow/tfjs';

var img=new Image();
img.src="https://source.unsplash.com/random/";

var img = new Image();
var div = document.getElementById('foo');
 
img.onload = function() {
  div.appendChild(img);
};



    async function loadModel(){
    console.log("inside load model");
    const mod = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    //const mod = await tf.loadModel('https://foo.bar/tfjs_artifacts/model.json');
    document.getElementById('micro_out_div').innerText += mod;
  }

  loadModel();

  function loadMobilenet() {
  return tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
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
  return tf.image.resizeBilinear(image, [224, 224]);
}

function batchImage(image) {
  // Expand our tensor to have an additional dimension, whose size is 1
  const batchedImage = image.expandDims(0);

  // Turn pixel data into a float between -1 and 1.
  return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
}

function loadAndProcessImage(image) {
  const croppedImage = cropImage(image);
  const resizedImage = resizeImage(croppedImage);
  const batchedImage = batchImage(resizedImage);
  return batchedImage;
}

  loadMobilenet().then(pretrainedModel => {
  loadImage("safe_image.jpeg").then(img => {
    const processedImage = loadAndProcessImage(img);
    const prediction = pretrainedModel.predict(processedImage);

    // Because of the way Tensorflow.js works, you must call print on a Tensor instead of console.log.
    prediction.print();
    prediction.as1D().argMax().print();
    const labelPrediction = prediction.as1D().argMax().dataSync()[0];

  });
});





 var ChromeSamples = {
    log: function() {
      var line = Array.prototype.slice.call(arguments).map(function(argument) {
        return typeof argument === 'string' ? argument : JSON.stringify(argument);
      }).join(' ');

      document.querySelector('#log').textContent += line + '\n';
    },

    clearLog: function() {
      document.querySelector('#log').textContent = '';
    },

    setStatus: function(status) {
      document.querySelector('#status').textContent = status;
    },

    setContent: function(newContent) {
      var content = document.querySelector('#content');
      while(content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }
      content.appendChild(newContent);
    }
  };


var imageCapture;

function onGetUserMediaButtonClick() {
  navigator.mediaDevices.getUserMedia({video: true})
  .then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
  })
  .catch(error => ChromeSamples.log(error));
}

function onGrabFrameButtonClick() {
  imageCapture.grabFrame()
  .then(imageBitmap => {
    const canvas = document.querySelector('#grabFrameCanvas');
    drawCanvas(canvas, imageBitmap);
  })
  .catch(error => ChromeSamples.log(error));



//convert to tensor 
//const tensor = tf.fromPixels(imageData);
}

function onTakePhotoButtonClick() {
  imageCapture.takePhoto()
  .then(blob => createImageBitmap(blob))
  .then(imageBitmap => {
    const canvas = document.querySelector('#takePhotoCanvas');
    drawCanvas(canvas, imageBitmap);


  })

  .catch(error => ChromeSamples.log(error));

}


function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split('px')[0];
  canvas.height = getComputedStyle(canvas).height.split('px')[0];
  let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
      x, y, img.width * ratio, img.height * ratio);

var i = canvas.getContext('2d').getImageData(0,0,img.width * ratio, img.height * ratio);

loadMobilenet().then(pretrainedModel => {
  loadImage(i).then(img => {
    const processedImage = loadAndProcessImage(img);
    const prediction = pretrainedModel.predict(processedImage);

    // Because of the way Tensorflow.js works, you must call print on a Tensor instead of console.log.
    prediction.print();
    prediction.as1D().argMax().print();
    const labelPrediction = prediction.as1D().argMax().dataSync()[0];

  });
});

//{data: Uint8ClampedArray(120000)


}

document.querySelector('video').addEventListener('play', function() {
  document.querySelector('#grabFrameButton').disabled = false;
  document.querySelector('#takePhotoButton').disabled = false;
});



  document.querySelector('#getUserMediaButton').addEventListener('click', onGetUserMediaButtonClick);
  document.querySelector('#grabFrameButton').addEventListener('click', onGrabFrameButtonClick);
  document.querySelector('#takePhotoButton').addEventListener('click', onTakePhotoButtonClick);



//const example = tf.fromPixels(img);  // for example
//const prediction = model.predict(example);


	/*
	var cells = document.getElementById('Cells');
	console.log(cells.alt);
	
	const example = tf.fromPixels(cells);
        model.predict(example);
*/

/*
(async() => {
   const model = await tf.loadModel('model_101.json');
   console.log("test");
   //const example = tf.fromPixels(webcamElement);  // for example
   //const prediction = model.predict(example);

})();
*/
//console.log(model);
