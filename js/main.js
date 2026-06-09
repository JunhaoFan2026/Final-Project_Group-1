/**
 * MAIN SKETCH
 * Orchestrates all mechanics: Audio, Time, Perlin Noise, and User Input
 * Combines all four creative mechanics into a cohesive sand drawing experience
 * * This system is inspired by The Coding Train tutorials:
// https://thecodingtrain.com/challenges/180-falling-sand/
 */

let grid;
let w = 4;
let cols, rows;

function preload() {
  // Load background image for time-based mechanic
  bgImage = loadImage('assets/sand-background.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  colorMode(HSB, 360, 100, 100);
  
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  
  // Initialize all mechanics
  initAudioMechanic();
  initTimeMechanic();
  initPerlinNoiseMechanic();
}

function draw() {
  let elapsed = millis() - startTime;
  let remaining = max(0, paintDuration - elapsed);

  if (paintingActive && remaining <= 0) {
    endPainting();
    triggerExplosion(grid, cols, rows, w);
  }

  drawTimeBasedBackground(elapsed);

  // Update audio-driven colors
  updateAudioColors();

  // Draw sand
  noStroke();
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      let sandCell = grid[i][j];
      if (!isEmpty(sandCell)){
        fill(sandCell.hue, sandCell.sat, sandCell.bri);
        let x = i * w;
        let y = j * w;
        rect(x, y, w, w);
      }
    }
  }

  // Update sand physics using Perlin noise
  grid = updateSandPhysics(grid, cols, rows, w);

  // Display UI
  fill(255);
  noStroke();
  displayTimerInfo(remaining);
  displayInputInfo();
  displayAudioInfo();

  drawBrushPreview();

  // Draw explosion particles
  updateExplosionParticles();
}

// Global utility functions
function emptyCell() {
  return { hue: 0, sat: 0, bri: 0 };
}

function copyCell(cell) {
  return { hue: cell.hue, sat: cell.sat, bri: cell.bri };
}

function isEmpty(cell) {
  return cell.bri === 0;
}

function make2DArray(cols, rows){
  let arr = new Array(cols);
  for (let i = 0;  i < cols; i++){
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++){
      arr[i][j] = emptyCell();
    }
  }
  return arr;
}

// Mouse input callbacks
function mouseDragged(){
  usersTool(mouseX, mouseY, grid, cols, rows, w, paintingActive, currentHue);
}

function mousePressed() {
  usersTool(mouseX, mouseY, grid, cols, rows, w, paintingActive, currentHue);
}

// Keyboard input callback
function keyPressed() {
  if (key === '+' || key === '=') {
    setBrushSize(getBrushSize() + 1);
  } else if (key === '-') {
    setBrushSize(getBrushSize() - 1);
  } else if (key === ' ' || keyCode === 32) {
    endPainting();
  }
  
  if (key === "1"){
    setInputMode("pour");
  } else if (key === "2"){
    setInputMode("disturb");
  } else if (key === "3"){
    setInputMode("erase");
  } else if (key === 'f' || key === 'F') {
    triggerExplosion(grid, cols, rows, w);
    endPainting();
    paintingEndTime = millis() - 25000;
  } else if (key === 'r' || key === 'R') {
    startTime = millis();
    resetTimerState();
    resetNoiseState();
    grid = make2DArray(cols, rows);
  }
}

function windowResized(){
  let oldGrid = grid;
  let oldCols = cols;
  let oldRows = rows;
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  for (let i = 0; i < min(oldCols, cols); i++){
    for (let j = 0; j < min(oldRows, rows); j++){
      grid[i][j] = copyCell(oldGrid[i][j]);
    }
  }
}
