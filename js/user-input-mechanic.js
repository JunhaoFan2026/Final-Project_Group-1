/**
 * USER INPUT MECHANIC
 * Jialu Li
 * Creative Director: Drives interaction via mouse and keyboard
 * Incorporates mouse or keyboard inputs to drive painting and mode changes
 */

let inputMode = "pour"; 
let brushSize = 5;// make brushsize as the global variable

// POUR TOOL
// Adds new sand cells around the mouse position.
function addSand(x, y, grid, cols, rows, w, currentHue, paintingActive) {
  // Stop new sand from being added after the painting phase has ended.
  if (!paintingActive) {
    return;
  }
  
  // Convert the mouse position from canvas pixels into grid coordinates.
  // Use p5.js for floor() reference:https://p5js.org/reference/
  // floor() ensures the column and row are whole numbers.
  let col = floor(x / w);
  let row = floor(y / w);

  let mouseSpeed = dist(x, y, pmouseX, pmouseY);
  // Compare the current mouse position with the previous one.
  // Use p5.js for dist() reference:https://p5js.org/reference/

  let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
  // Limit the speed value and convert it into a small brush-size increase.
  let dynamicBrushSize = brushSize + speedBoost;
  // Slow movement creates fine traces; fast movement creates heavier sand flow.
  let extent = floor(dynamicBrushSize / 2);
  // This calculate how far the brush extends from its centre.

  // Use nested loops to fill a square area around the mouse position.
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      let currentCol = col + i;
      let currentRow = row + j;

      // Only add sand when the selected cell is inside the grid boundaries.
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

// ERASE TOOL
// Removes sand cells inside the selected brush area.
function eraseSand(x, y, grid, cols, rows, w) {
  // Convert the mouse position into gtid coordinates.
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
        // Replace the selected sand cell with an empty cell.
        // emptyCell() reference:https://thecodingtrain.com/challenges/180-falling-sand/
        grid[currentCol][currentRow] = emptyCell();
      }
    }
  }
}

// DISTURB TOOL
// Moves existing sand into nearby random empty cells.
// The original sand colour is preserved during the movement.
function disturbSand(x, y, grid, cols, rows, w) {
  // Convert the mouse position into grid coordinates.
  let col = floor(x / w);
  let row = floor(y / w);

  let extent = floor(brushSize / 2);

  for (let i = -extent; i <= extent; i++){
    for (let j = -extent; j <= extent; j++){
      let currentCol = col + i;
      let currentRow = row + j;

       // Only disturb cells that are inside the grid and contain sand.
      if (
        currentCol >= 0 &&
        currentCol < cols &&
        currentRow >= 0 &&
        currentRow < rows &&
        !isEmpty(grid[currentCol][currentRow])
      ){
        // Copy the complete sand object so its hue, saturation,and brightness remain unchanged after movement.
        let sandCell = copyCell(grid[currentCol][currentRow]);
        // These are for selecting a nearby random destination.
        let newCol = currentCol + floor(random(-3, 4));
        let newRow = currentRow + floor(random(-2, 3));

        //// Move the sand only when the destination is inside the grid and empty.
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

// TOOL ROUTER
// Sends mouse input to the function that matches the selected mode.

function usersTool(x, y, grid, cols, rows, w, paintingActive, currentHue) {
  // Disable all user tools after the painting phase ends.
  if (!paintingActive) {
    return;
  }

  // Use conditional logic to run the selected interaction tool.
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

// BRUSH PREVIEW
// Displays the current interaction area around the mouse.
// And different colours identify the three tools.

function drawBrushPreview() {
  let previewBrushSize = brushSize;

  // Only Pour mode responds to mouse movement speed.
  if (inputMode === "pour"){
    let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
    previewBrushSize += speedBoost;
  }
  
  noFill();
  strokeWeight(1);

  // Use a different HSB stroke colour for each interaction mode.
  if (inputMode === "pour"){
    stroke(120, 30, 100);
  } else if (inputMode === "disturb"){
    stroke(45, 90, 100);
  } else if (inputMode === "erase"){
    stroke(0, 80, 100);
  }

  circle(mouseX, mouseY, previewBrushSize * w);
}

// ON-SCREEN INSTRUCTIONS
// Shows the current mode, brush size, and keyboard controls.

function displayInputInfo() {
  textSize(12);
  text("Mode: " + inputMode, 20, 100);
  text("Brush size: " + brushSize, 20, 120);
  text("1: Pour | 2: Disturb | 3: Erase", 20, 140);
  text("+ / -: change brush size", 20, 160);
  text("SPACE: end painting early | F: explode | R: restart", 20, 180);
}

// GETTER AND SETTER FUNCTIONS
// These functions allow the main sketch to read or update the private

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
  // Keep the brush size within a usable range.
  brushSize = constrain(size, 1, 20);
}
