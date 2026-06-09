/**
 * USER INPUT MECHANIC
 * Creative Director: Drives interaction via mouse and keyboard
 * Incorporates mouse or keyboard inputs to drive painting and mode changes
 */

let inputMode = "pour"; 
let brushSize = 5;

function addSand(x, y, grid, cols, rows, w, currentHue, paintingActive) {
  if (!paintingActive) {
    return;
  }
  
  let col = floor(x / w);
  let row = floor(y / w);

  let mouseSpeed = dist(x, y, pmouseX, pmouseY);
  let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
  let dynamicBrushSize = brushSize + speedBoost;

  let extent = floor(dynamicBrushSize / 2);

  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      let currentCol = col + i;
      let currentRow = row + j;

      if (
        currentCol >= 0 &&
        currentCol < cols &&
        currentRow >= 0 &&
        currentRow < rows
      ) {
        grid[currentCol][currentRow] = { hue: currentHue, sat: 100, bri: 100 };
      }
    }
  }
}

function eraseSand(x, y, grid, cols, rows, w) {
  let col = floor(x / w);
  let row = floor(y / w);
  
  let extent = floor(brushSize / 2);
  
  for(let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      let currentCol = col + i;
      let currentRow = row + j;
    
      if (
        currentCol >= 0 &&
        currentCol < cols &&
        currentRow >= 0 &&
        currentRow < rows
      ){
        grid[currentCol][currentRow] = emptyCell();
      }
    }
  }
}

function disturbSand(x, y, grid, cols, rows, w) {
  let col = floor(x / w);
  let row = floor(y / w);

  let extent = floor(brushSize / 2);

  for (let i = -extent; i <= extent; i++){
    for (let j = -extent; j <= extent; j++){
      let currentCol = col + i;
      let currentRow = row + j;

      if (
        currentCol >= 0 &&
        currentCol < cols &&
        currentRow >= 0 &&
        currentRow < rows &&
        !isEmpty(grid[currentCol][currentRow])
      ){
        let sandCell = copyCell(grid[currentCol][currentRow]);
        let newCol = currentCol + floor(random(-3, 4));
        let newRow = currentRow + floor(random(-2, 3));

        if (
          newCol >= 0 &&
          newCol < cols &&
          newRow >= 0 &&
          newRow < rows &&
          isEmpty(grid[newCol][newRow])
        ){
          grid[currentCol][currentRow] = emptyCell();
          grid[newCol][newRow] = sandCell;
        }
      }
    }
  }
}

function usersTool(x, y, grid, cols, rows, w, paintingActive, currentHue) {
  if (!paintingActive) {
    return;
  }
  
  if (inputMode === "pour"){
    addSand(x, y, grid, cols, rows, w, currentHue, paintingActive);
  }
  else if (inputMode === "disturb"){
    disturbSand(x, y, grid, cols, rows, w);
  }
  else if (inputMode === "erase"){
    eraseSand(x, y, grid, cols, rows, w);
  }
}

function drawBrushPreview() {
  let previewBrushSize = brushSize;

  if (inputMode === "pour"){
    let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
    previewBrushSize += speedBoost;
  }
  
  noFill();
  strokeWeight(1);

  if (inputMode === "pour"){
    stroke(120, 30, 100);
  } else if (inputMode === "disturb"){
    stroke(45, 90, 100);
  } else if (inputMode === "erase"){
    stroke(0, 80, 100);
  }

  circle(mouseX, mouseY, previewBrushSize * w);
}

function displayInputInfo() {
  textSize(12);
  text("Mode: " + inputMode, 20, 100);
  text("Brush size: " + brushSize, 20, 120);
  text("1: Pour | 2: Disturb | 3: Erase", 20, 140);
  text("+ / -: change brush size", 20, 160);
  text("SPACE: end painting early | F: explode | R: restart", 20, 180);
}

function getInputMode() {
  return inputMode;
}

function setInputMode(mode) {
  inputMode = mode;
}

function getBrushSize() {
  return brushSize;
}

function setBrushSize(size) {
  brushSize = constrain(size, 1, 20);
}
