/**
 * @type HTMLCanvasElement
 */
var socket = io();
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const colorInput = document.getElementById("colorInput");
const toggleGuide = document.getElementById("toggleGuide");
const online = document.getElementById("online_mode");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const pixelHistory = [
    {x_pos: 0,y_pos: 0,colors: colorInput.value},
];

const CELL_SIDE_COUNT = 100;
const cellPixelLength = canvas.width / CELL_SIDE_COUNT;
const colorHistory = {};

let VarilableBrowser = 0;

// Set default color
colorInput.value = "#009578";

// Initialize the canvas background
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

// Setup the guide
{
  guide.style.width = `${canvas.width}px`;
  guide.style.height = `${canvas.height}px`;
  guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
  guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

  [...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
    guide.insertAdjacentHTML("beforeend", "<div></div>")
  );
  
}

function handleCanvasMousedown(e) {
  // Ensure user is using their primary mouse button
  if (e.button !== 0) {
    return;
  }

  const canvasBoundingRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasBoundingRect.left;
  const y = e.clientY - canvasBoundingRect.top;
  const cellX = Math.floor(x / cellPixelLength);
  const cellY = Math.floor(y / cellPixelLength);
  const currentColor = colorHistory[`${cellX}_${cellY}`];
  
  if (e.ctrlKey) {
    if (currentColor) {
      colorInput.value = currentColor;
    }
  } else {
    fillCell(cellX, cellY,colorInput.value);
    upload(cellX,cellY);
  }

  
}

function upload(x,y) {
    VarilableBrowser += 1;
    let notStaticVarilable = {x_pos: x,y_pos: y,colors: colorInput.value};
    pixelHistory.push(notStaticVarilable);
    socket.emit('pixel upload',pixelHistory);
}


socket.on('pixel upload', function(msg) {
    for(let i = 0; i < msg.length; i++) {
        if(pixelHistory.find(a => a.colors != msg[i].colors)) {
          pixelHistory.splice(i);
          pixelHistory.push({x_pos: msg[i].x_pos,y_pos: msg[i].y_pos,colors: msg[i].colors});
          pixelHistory.map === msg;
          fillCell(msg[i].x_pos,msg[i].y_pos,msg[i].colors);
        } else if(pixelHistory.find(a => a.colors != msg[i].colors)) {
          pixelHistory.map === msg;
          fillCell(msg[i].x_pos,msg[i].y_pos,msg[i].colors);
        }
    }
});


function handleClearButtonClick() {
  const yes = confirm("Are you sure you wish to clear the canvas?");

  if (!yes) return;

  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function handleToggleGuideChange() {
  guide.style.display = toggleGuide.checked ? null : "none";
}

function fillCell(cellX, cellY, color) {
  const startX = cellX * cellPixelLength;
  const startY = cellY * cellPixelLength;

  drawingContext.fillStyle = color;
  drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
  colorHistory[`${cellX}_${cellY}`] = color;
}

canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
