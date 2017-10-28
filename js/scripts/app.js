console.log("Loading...")
var detector = new affdex.PhotoDetector();

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();

detector.start();

detector.addEventListener("onInitializeSuccess", function() {
  console.log("Done!");
  var load = document.getElementById('loading');
  load.parentNode.removeChild(load);
  $("#toshow").css("visibility", "visible");
});


function log(node_name, msg) {
  $(node_name).append("<p>" + msg + "</p><br />")
}

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
  $('#results').html("");
  log('#results', "Número de rostos detectados: " + faces.length);
  if (faces.length > 0) {
    log('#results', "Emoções: " + JSON.stringify(faces[0].emotions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }));
    drawFeaturePoints(image, faces[0].featurePoints);
  }
});

//Add a callback to notify if failed receive the results from processing an image.
detector.addEventListener("onImageResultsFailure", function(image, timestamp, error) {
  log('#logs', 'Failed to process image err=' + error);
});

//Draw the detected facial feature points on the image
//Não consegui fazer funcionar com a imagem carregada
function drawFeaturePoints(img, featurePoints) {
  var contxt = $('#face_canvas')[0].getContext('2d');

  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();
  }
}

//Once the image is loaded, pass it down for processing
function imageLoaded(event) {
  var contxt = document.createElement('canvas').getContext('2d');
  contxt.canvas.width = this.width;
  contxt.canvas.height = this.height;
  contxt.drawImage(this, 0, 0, this.width, this.height);

  // Pass the image to the detector to track emotions
  if (detector && detector.isRunning) {
    detector.process(contxt.getImageData(0, 0, this.width, this.height), 0);
  }
}

function showImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#face')
      .attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function loadFile(event, input) {
  showImage(input);
  $('#results').html("");
  var img = new Image();
  var reader = new FileReader();
  reader.onload = function() {
    img.onload = imageLoaded;
    img.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('./service-worker.js')
     .then(function() { console.log('Service Worker Registered'); });
  }
