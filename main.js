const ccanvas = document.getElementById("canvas");
const mainControls = document.getElementById("mainControls");

const constrols = document.getElementById("constrols");
const results = document.getElementById("results");

var boxList = [];
var countBox = 0;

/* create a canvas and a button */
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
ccanvas.appendChild(canvas);
var button = document.createElement('button');
button.innerHTML = 'Create Screen';
mainControls.appendChild(button);

/* when clicked, creates a draggable box and add to a list and adds two range sliders that can be used to control the width and height of the box */
button.onclick = function() {
  var box = document.createElement('div');
  box.style.width = '100px';
  box.style.height = '100px';
  box.style.position = 'absolute';
  box.style.top = '0px';
  box.style.left = '0px';
  box.style.cursor = 'move';
  box.classList.add('box');
  
  var controller = document.createElement('div');
  
  var aspectRatioSelector = document.createElement('select');
var aspectRatios = ['16:9','4:3', '21:9', '16:10'];
for (var i = 0; i < aspectRatios.length; i++) {
  var option = document.createElement('option');
  option.innerHTML = aspectRatios[i];
  aspectRatioSelector.appendChild(option);
}

controller.appendChild(aspectRatioSelector);
  
/* Create radio's width, height, off labeled */
var widthRadio = document.createElement('input');
widthRadio.type = 'radio';
widthRadio.name = 'aspectRatio'+countBox;
widthRadio.id = 'width'+countBox;
controller.appendChild(widthRadio);
var widthLabel = document.createElement('label');
widthLabel.innerHTML = 'Width';
widthLabel.htmlFor = 'width'+countBox;
controller.appendChild(widthLabel);
var heightRadio = document.createElement('input');
heightRadio.type = 'radio';
heightRadio.name = 'aspectRatio'+countBox;
heightRadio.id = 'height'+countBox;
controller.appendChild(heightRadio);
var heightLabel = document.createElement('label');
heightLabel.innerHTML = 'Height';
heightLabel.htmlFor = 'height'+countBox;
controller.appendChild(heightLabel);
var offRadio = document.createElement('input');
offRadio.type = 'radio';
offRadio.name = 'aspectRatio'+countBox;
offRadio.id = 'off'+countBox;
  offRadio.checked = true;
controller.appendChild(offRadio);
var offLabel = document.createElement('label');
offLabel.innerHTML = 'Off';
offLabel.htmlFor = 'off'+countBox;
  
controller.appendChild(offLabel);
  controller.id = 'controller';
  
  var widthInput = document.createElement('input');
widthInput.type = 'number';
widthInput.value = '400';
controller.appendChild(widthInput);
widthInput.classList.add('input');
  
  boxList.push({
    ratio:'16:9',
    ratioLimit:'off',
    width:100,
    height:100,
  });
  
  document.body.appendChild(box);
  var widthSlider = document.createElement('input');
  widthSlider.type = 'range';
  widthSlider.min = '0';
  widthSlider.max = '4000';
  widthSlider.value = '100';
  widthSlider.classList.add('slider');
  
  controller.appendChild(widthSlider);
  var heightInput = document.createElement('input');
heightInput.type = 'number';
heightInput.value = '400';
controller.appendChild(heightInput);
  
  
  var heightSlider = document.createElement('input');
  heightSlider.type = 'range';
  heightSlider.min = '0';
  heightSlider.max = '4000';
  heightSlider.value = '100';
  heightSlider.classList.add('slider');
  
  var updateHeight = (value) => {
    if(heightRadio.checked){
      const ratio = aspectRatioSelector.value.split(":");
      const rh = ratio[0];
      const rw = ratio[1];
      
      var w = (value*rh)/rw;
      box.style.height = value + 'px'
      box.style.width = w + 'px'
      
      heightSlider.value = value;
      heightInput.value = value;
      
      widthSlider.value = w;
      widthInput.value = w;
    }else{
      offRadio.checked = true;
      heightSlider.value = value;
      heightInput.value = value;
      box.style.height = value + 'px'
    }
    //aspectRatioSelector.value;
    
  };
  var updateWidth = (value) => {
    if(widthRadio.checked){
      const ratio = aspectRatioSelector.value.split(":");
      const rh = ratio[0];
      const rw = ratio[1];
      var h = (value*rw)/rh;
      box.style.height = h + 'px'
      box.style.width = (value) + 'px'
      
      heightSlider.value = h;
      heightInput.value = h;
      
      widthSlider.value = value;
      widthInput.value = value;
    }else{
      offRadio.checked = true;
      widthSlider.value = value;
      widthInput.value = value;
      box.style.width = value + 'px'
    }    
  };
  
  heightSlider.oninput = () => updateHeight(heightSlider.value);
   
  widthSlider.oninput = () => updateWidth(widthSlider.value);

  heightInput.onchange = () => updateHeight(heightInput.value);
  
  widthInput.onchange = () => updateWidth(widthInput.value);
  
  controller.appendChild(heightSlider);
  var boxes = document.getElementsByTagName('div');
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].onmousedown = function(e) {
      var box = e.target;
      var startX = e.clientX;
      var startY = e.clientY;
      var origX = parseInt(box.style.left);
      var origY = parseInt(box.style.top);
      document.onmousemove = function(e) {
        box.style.left = (origX + e.clientX - startX) + 'px';
        box.style.top = (origY + e.clientY - startY) + 'px';
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  constrols.appendChild(controller);
  countBox++;
};

/* Add a button to upload an image */
var uploadButton = document.createElement('button');
uploadButton.innerHTML = 'Upload Image';
mainControls.appendChild(uploadButton);

var image = new Image();
var context = canvas.getContext('2d');
/* When the image is uploaded add to the background of the canvas */
uploadButton.onclick = function() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = function() {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataURL = e.target.result;
      image.src = dataURL;
      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
};

var link = document.createElement('button');

/* add a button that copy what is behind each box and insert below */
var copyButton = document.createElement('button');
copyButton.innerHTML = 'Copy';
mainControls.appendChild(copyButton);

copyButton.onclick = function() {
  var boxes = document.getElementsByClassName('box');

var maxHight = 0;
for (var i = 0; i < boxes.length; i++) {
  var box = boxes[i];
  var height = parseFloat(box.style.height);
  if(height > maxHight)
    maxHight = height;
}

var totalWidth = 0;
for (var i = 0; i < boxes.length; i++) {
  var box = boxes[i];
  var width = parseInt(box.style.width);
  var height = parseInt(box.style.height);
  totalWidth = totalWidth + ((width*maxHight)/height);
}



var canvasCopy = document.createElement('canvas');
var contextCopy = canvasCopy.getContext('2d');
canvasCopy.height = maxHight;
canvasCopy.width = totalWidth;

var cLeft = 0;

contextCopy.fillStyle = "white";
contextCopy.fillRect(0, 0, canvasCopy.width, canvasCopy.height);

document.body.appendChild(canvasCopy);
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var left = parseInt(box.style.left);
    var top = parseInt(box.style.top);
    var width = parseInt(box.style.width);
    var height = parseInt(box.style.height);
    
    var cWidth = ((width*maxHight)/height);

    contextCopy.drawImage(canvas, left, top, width, height, cLeft, 0, cWidth, maxHight);

    cLeft = cLeft + cWidth;
  }
  var img = document.createElement('img');

 link.onclick = () => downloadURI( canvasCopy.toDataURL(),generateId());

  img.src = canvasCopy.toDataURL();

canvasCopy.download ="img.png";
  results.appendChild(img);
  //canvasCopy.remove();
};

var slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 360;
slider.value = 0;
slider.oninput = function() {
  var angle = slider.value * Math.PI / 180;
  var width = image.width;
  var height = image.height;
  var newWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
  var newHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
  canvas.width = newWidth;
  canvas.height = newHeight;
  context.translate(newWidth / 2, newHeight / 2);
  context.rotate(angle);
  context.drawImage(image, -width / 2, -height / 2);
};

mainControls.appendChild(slider);
var clearButton = document.createElement('button');
clearButton.innerHTML = 'Clear Results';
mainControls.appendChild(clearButton);
clearButton.onclick = function() {
results.innerHTML = '';
};


function dec2hex (dec) {
  return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
function generateId (len) {
  var arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

  link.innerHTML = 'Download Image';
  mainControls.appendChild(link);
// var button = document.createElement('button');
// button.innerHTML = 'Join';
// document.body.appendChild(button);
// button.onclick = function() {
//   var canvas3 = document.createElement('canvas');
//   canvas3.width = 200;
//   canvas3.height = 100;
//   document.body.appendChild(canvas3);
//   var ctx3 = canvas3.getContext('2d');
//   ctx3.drawImage(canvas, 0, 0);
//   ctx3.drawImage(canvas2, 100, 0);
//   var img = document.createElement('img');
//   img.src = canvas3.toDataURL();
//   document.body.appendChild(img);
// };


/* add a button that copy what is behind each box and insert below */
// var copyButton = document.createElement('button');
// copyButton.innerHTML = 'Copy';
// mainControls.appendChild(copyButton);
// copyButton.onclick = function() {
//   var boxes = document.getElementsByTagName('div');
//   for (var i = 0; i < boxes.length; i++) {
//     var box = boxes[i];
//     var left = parseInt(box.style.left);
//     var top = parseInt(box.style.top);
//     var width = parseInt(box.style.width);
//     var height = parseInt(box.style.height);
//     var canvasCopy = document.createElement('canvas');
//     canvasCopy.width = width;
//     canvasCopy.height = height;
//     var contextCopy = canvasCopy.getContext('2d');
//     contextCopy.drawImage(canvas, left, top, width, height, 0, 0, width, height);
//     document.body.appendChild(canvasCopy);
//   }
// };

