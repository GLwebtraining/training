window.onload = initialize;
var harr = [];
function initialize(){
  var h1 = createImage('img-gs', 'images/key.png');
  var h2 = createImage('field-gs', 'images/1.png');

  console.log(harr);
}

function createImage(holder, src){
  var img = new Image;
  img.onload = function(){
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 100;
    drawImage(holder, img);
    var h = Histogram(img);
    h.smooth(0).draw(canvas);
    harr.push(h.histogram());
    document.getElementById(holder + '-hist').appendChild(canvas);
  }
  img.src = src;

  return img;
}

function drawImage(holder, imageObj) {
    var canvas = document.getElementById(holder);
    var context = canvas.getContext('2d');
    var x = 10;
    var y = 10;

    context.drawImage(imageObj, x, y);

    var imageData = context.getImageData(x, y, imageObj.width, imageObj.height);
    var data = imageData.data;

    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness;
      // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness;
    }

    // overwrite original image
    context.putImageData(imageData, x, y);
}

