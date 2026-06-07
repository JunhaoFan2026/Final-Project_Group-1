let grid;
let w = 4;
let cols, rows;
let noiseStep = 0;

let mic;
let fft;
let currentHue = 180;
let targetHue = 180;
let currentFreq = 0;

// User input,
let inputMode = "pour"; 
let brushSize = 5;//make brushsize as the globa variable

function make2DArray(cols, rows){
  let arr = new Array(cols);
  for (let i = 0;  i < arr.length; i++){
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++){
      arr[i][j] = 0;
    }
  }
  return arr;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  randomSeed(9103);
  noiseSeed(9103);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);
}

// User input
// Make mouse input send to usersTool(), so I can add different interaction modes such as pour, disturb, and erase.
function mouseDragged(){
  usersTool(mouseX,mouseY);
}

function mousePressed() {
  usersTool(mouseX, mouseY);
}

function usersTool(x ,y){
  addSand(x ,y);
}

function addSand(x, y) {
  let col = floor(x / w);
  let row = floor(y / w);
 
  //User input improvement:the brush becomes larger when the mouse move faster.
  let mouseSpeed = dist(mouseX,mouseY, pmouseX, pmouseY);
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
        grid[currentCol][currentRow] = currentHue;
      }
    }
  }
}

function draw() {
  background(0, 120);

  let spectrum = fft.analyze();
  let weightedSum = 0;
  let totalEnergy = 0;
  for (let i = 0; i < spectrum.length; i++){
    weightedSum += i * spectrum[i];
    totalEnergy += spectrum[i];
  }
  if (totalEnergy > 0){
    let centroid = weightedSum / totalEnergy;
    let nyquist = sampleRate() / 2;
    let centroidFreq = centroid * nyquist / spectrum.length;
    currentFreq = centroidFreq;
    targetHue = map(centroidFreq, 180, 400, 1, 360, true);
    currentHue = lerp(currentHue, targetHue, 0.05);
    noStroke();
  }

  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      let sandHue = grid[i][j];
      if (sandHue > 0){
        fill(sandHue, 100, 100);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }

  let nextGrid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      let state = grid[i][j];
      if (state > 0){
        if (j >= rows - 1) {
          nextGrid[i][j] = state;
          continue;
        }
        
        let below = grid[i][j + 1];

        let wind = noise(i * 0.1, j * 0.1, noiseStep);
        let dir = wind > 0.5 ? 1 : -1;
        if (random(1) < 0.1) dir = random(1) < 0.5 ? 1 : -1;

        let belowA, belowB;
        if (i + dir >= 0 && i + dir <= cols - 1){
          belowA = grid[i + dir][j + 1];
        }
        if (i - dir >= 0 && i - dir <= cols - 1){
          belowB = grid[i - dir][j + 1];
        }
        if (below === 0){
          nextGrid[i][j + 1] = state;
        } else if (belowA === 0) {
          nextGrid[i + dir][j + 1] = state;
        } else if (belowB === 0) {
          nextGrid[i - dir][j + 1] = state;
        } else {
          nextGrid[i][j] = state;
        }
      }
    }
  }
    grid = nextGrid;
    noiseStep += 0.01;

    drawInputInstructions();
    drawBrushPreview();

}

function drawInputInstructions() {
  fill(255);
  noStroke();
  textSize(12);
  text("Mode: " + inputMode, 20, 30);
  text("Brush size: " + brushSize, 20, 50);
  text("drag slowly for fine sand, quickly for heavier sand", 20, 70);
  text("Use + / - to change base brush size", 20, 90);
  text("Voice Frequency: " + floor(currentFreq) + " Hz", 20, 110);
  text("Current Hue: " + floor(currentHue), 20, 130);
}

function drawBrushPreview() {
  let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
  let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
  let dynamicBrushSize = brushSize + speedBoost;

  noFill();
  stroke(0, 0, 100, 50);
  strokeWeight(1);
  circle(mouseX, mouseY, dynamicBrushSize * w);
}

function keyPressed() {
  if (key === '+' || key === '=') {
    brushSize = min(brushSize + 1, 20);
  } else if (key === '-') {
    brushSize = max(brushSize - 1, 1);
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
      grid[i][j] = oldGrid[i][j];
    }
  }
}

