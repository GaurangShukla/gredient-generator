let body = document.querySelector('body');
let colorPickers = document.querySelectorAll('.color-picker');
let colorPicker1 = document.querySelector('.color-picker__container1').firstElementChild;
let colorPicker2 = document.querySelector('.color-picker__container2').firstElementChild;
let anglePicker = document.querySelector('.js-angle');
let gradientCode = document.querySelectorAll('.js-gradient-code');
let rgbCode = document.querySelectorAll('.js-rgb-code');
let backgroundCopy = document.querySelector('.js-background-copy');
let buttonCopy = document.querySelector('.js-copy');
let codeEditorTabs = document.querySelectorAll('.code-editor__tab');
let rgbCodeContainer = document.querySelector('.rgb-code');
let gradientCodeContainer = document.querySelector('.gradient-code');
let randomButton = document.querySelector('.svg-random');
let anglePickerCircle = document.querySelector('.angle-picker__circle');
let anglePickerRect = document.querySelector('.angle-picker__rectangle');




// Add degree here
const addStringToDegree = () => {
  return anglePicker.value + "deg";
};

const getGradientCode = () => {
  let angle = addStringToDegree();
  return "linear-gradient(" + angle + ", " + colorPicker1.value + ", " + colorPicker2.value + ")";
};

const hexToRgb = hex => {
 
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};


const getRgbCode = () => {
  let rgbColor1 = hexToRgb(colorPicker1.value);
  let rgbColor2 = hexToRgb(colorPicker2.value);
  return ([
    "rgb(" + rgbColor1.r + ", " + rgbColor1.g + ", " + rgbColor1.b + ");\n",
    "rgb(" + rgbColor2.r + ", " + rgbColor2.g + ", " + rgbColor2.b + ");\n"
  ]);
};

const changeColorPickerBackground = () => {
  colorPickers.forEach(picker => picker.parentElement.style.backgroundColor = picker.value);
};

const changeBodyBackground = () => {
  body.style.background = getGradientCode();
};

const changeGradientCode = () => {
  gradientCode.forEach(code => code.innerHTML = getGradientCode() + ';');
  backgroundCopy.style.background = getGradientCode();
};

const changeRgbCode = () => {
  let newRgbArray = getRgbCode();

  for(let i = 0; i < rgbCode.length; i++){
    rgbCode[i].innerHTML = newRgbArray[i];
  }
};

const changeColor = () => {
  changeColorPickerBackground();
  changeBodyBackground();
  changeGradientCode();
  changeRgbCode();
};

colorPickers.forEach(colorPicker => colorPicker.addEventListener('input', changeColor));





const changePickerColor = (color1, color2) => {
  colorPicker1.value = color1;
  colorPicker2.value = color2;
};

const changeWithRandomAngle = angle => {
  anglePicker.value = angle;
};

const createRandomGradient = () => {

  let hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];

  let populate = (a) => {
    for ( let i = 0; i < 6; i++ ) {
      let x = Math.round( Math.random() * 14 );
      let y = hexValues[x];
      a += y;
    }
    return a;
  };

  let newColor1 = populate('#');
  let newColor2 = populate('#');
  let angle = Math.round( Math.random() * 360 );
  let gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";

  return {newColor1, newColor2, gradient, angle};
};

const updateWithRandomGradient = () => {
  let randomGradient = createRandomGradient();
  body.style.background = randomGradient.gradient;
  changePickerColor(randomGradient.newColor1, randomGradient.newColor2);
  changeColorPickerBackground();
  changeWithRandomAngle(randomGradient.angle);
  let rotation = checkRotationDirection(randomGradient.angle);
  rotateCursor(rotation);
  changeGradientCode();
  changeRgbCode();
};

randomButton.addEventListener('click', updateWithRandomGradient);




const checkNumbersOnly = string => {
  let numbers = /^[0-9]*$/;
  return !string.match(numbers);
};

const newTypedAngle = event => {
  if(checkNumbersOnly(event.target.value)){
    anglePicker.value = NaN;
  } else {
    anglePicker.value = event.target.value;
    let rotation = checkRotationDirection(event.target.value);
    rotateCursor(rotation);
    changeBodyBackground();
    changeGradientCode();
  }
};

anglePicker.addEventListener('input', e => newTypedAngle(e));



const checkCoordIsZero = (x, y) => {

  // Check if angle is zero / 90° / 180° or 270°
  if(x === 0 && (y === 0 || Math.sign(y) === 1)){
    return 0;
  } else if(y === 0 && Math.sign(x) === 1){
    return 90;
  } else if(x === 0 && Math.sign(y) === -1){
    return 180;
  } else if(y === 0 && Math.sign(x) === -1){
    return 270;
  } else return false
};

// Get x and y coordinates of the click
const getCursorPosition = e => {

  // Get position related to viewport
  let circle = e.target.getBoundingClientRect();
  // Adding scroll top and left
  let scrollLeft = window.pageXOffset;
  let scrollTop = window.pageYOffset;
  // Get x & y coordinates of click
  let circleXaxis = e.pageX;
  let circleYaxis = e.pageY;

  let x = circleXaxis - (circle.left + scrollLeft + circle.width / 2);
  // y pos values = top | y neg values = bottom
  let y = (circle.top + scrollTop + circle.height / 2) - circleYaxis;

  let isZero = checkCoordIsZero(x, y);
  if(isZero !== false){
    return isZero;
  } else return {x, y}
};

const getCircleQuarter = (x, y) => {
  if(Math.sign(x) === 1 && Math.sign(y) === 1){
    // First Quarter (0° to 90°)
    return {x, y, quarter: 1}
  } else if(Math.sign(x) === 1 && Math.sign(y) === -1){
    // Second Quarter (90° to 180°)
    return {x, y, quarter: 2}
  } else if(Math.sign(x) === -1 && Math.sign(y) === -1) {
    // Third Quarter (180° to 270°)
    return {x, y, quarter: 3}
  } else if(Math.sign(x) === -1 && Math.sign(y) === 1) {
    // Fourth Quarter (270° to 0°)
    return {x, y, quarter: 4}
  } else {
    console.log('error: parameters of the function are not valid coordinates')
  }
};

const calcAngleDegrees = (x, y) => {
  return Math.round(Math.atan2(y, x) * 180 / Math.PI);
};

const getNewAngle = (e) => {

  let cursorPosition = getCursorPosition(e);
  // Case where no 0 in coordinates => return an object with the coordinates
  if(isNaN(cursorPosition)) {
    let angleInfos = getCircleQuarter(cursorPosition.x, cursorPosition.y);
    let angle;
    angle = calcAngleDegrees(angleInfos.y, angleInfos.x);

    if(angleInfos.quarter === 1 || angleInfos.quarter === 2){
      return angle;
    } else {
      return 360 + angle;
    }

  } else {
    // Case where there was a 0 in the coordinates => return the angle
    return cursorPosition;
  }
};

const changeInputAngle = angle => {
  anglePicker.value = angle;
};

// Change dot position in the circle corresponding to the angle
const checkRotationDirection = (angle) => {
  if(90 < angle < 270){
    return angle - 90
  } else {
    return -angle - 90;
  }
};

const rotateCursor = rotation => {
  let rectangleRotation = "rotate(" + rotation + "deg);";
  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.rotate-rect { transform:' + rectangleRotation + '}';
  document.getElementsByTagName('head')[0].appendChild(style);

  anglePickerRect.classList.add('rotate-rect');
};

const updateAngle = e => {
  let angle = getNewAngle(e);
  changeInputAngle(angle);
  changeBodyBackground();
  changeGradientCode();
  let rotation = checkRotationDirection(angle);
  rotateCursor(rotation);
};

anglePickerCircle.addEventListener('click', e => updateAngle(e));





const switchActiveCode = tab => {
  if(tab.classList.contains('rgb')){
    gradientCodeContainer.classList.remove('js-code-active');
    rgbCodeContainer.classList.add('js-code-active');
  } else {
    rgbCodeContainer.classList.remove('js-code-active');
    gradientCodeContainer.classList.add('js-code-active');
  }
};

const changeActiveTab = tab => {
  codeEditorTabs.forEach(tab => tab.classList.remove('is-active'));
  tab.classList.add('is-active');
  switchActiveCode(tab);
};

codeEditorTabs.forEach(tab => tab.addEventListener('click', e => changeActiveTab(e.target)));





const getTextNodesIn = (elem) => {
  let textNodes = [];
  if (elem) {
    for (let nodes = elem.childNodes, i = nodes.length; i--;) {
      let node = nodes[i], nodeType = node.nodeType;
      if (nodeType === 3) {
          textNodes.push(node);
      }
      else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        textNodes = textNodes.concat(getTextNodesIn(node));
      }
    }
  }
  return textNodes;
};


const getString = () => {
  let showedLinesCode = document.querySelector('.js-code-active');
  let textNodes = getTextNodesIn(showedLinesCode);
  let bgCodeString = [];
  let finalTextArray = [];
  let codeText;

  for(let i = 0; i < textNodes.length; i++) {
    if(textNodes[i].wholeText.trim().length !== 0){
      bgCodeString.push(textNodes[i].wholeText.replace(/\s+/g, ' '));
      finalTextArray = [].concat(bgCodeString).reverse();
    }
  }
  codeText = finalTextArray.join('').replace(/;/g, ';\n');

  return codeText;
};

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


buttonCopy.addEventListener('click', () => copyToClipboard(getString()));



const translation = () => {
  let colorPickers = document.querySelectorAll('.color-picker__container');
  colorPickers.forEach(colorPicker => colorPicker.classList.add('js-translate-done'));
  let anglePickers = document.querySelectorAll('.js-angle-picker');
  anglePickers.forEach(anglePicker => anglePicker.classList.add('js-translate-done'));
  let infoContainers = document.querySelectorAll('.info__container');
  infoContainers.forEach(infoContainer => infoContainer.classList.add('info__container--showed'))
};

let delayInMilliseconds = 700;

window.addEventListener('DOMContentLoaded', () => setTimeout(() => {
  translation();
}, delayInMilliseconds));
