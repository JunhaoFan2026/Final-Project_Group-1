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

function usersTool(x ,y){ // To run different interaction
  if (inputMode === "pour"){
    addSand(x ,y);
  }
  else if (inputMode === "disturb"){
    disturbSand(x ,y);
  }
  else if (inputMode === "erase"){
      eraseSand(x ,y);
    }
}

//Pour tool: Slow mouse movement creates a finer sand stream, fast mouse movement increase poring area.
function addSand(x, y) {
  let col = floor(x / w);
  let row = floor(y / w);

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

//Erase tool：Removes sand inside the slected brush area.
function eraseSand(x, y){
  let col = floor(x / w);
  let row = floor(y / w);
  
  let extent = floor(brushSize / 2);
  
  for(let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      let currentCol = col + i;
      let currentRow = row + j;
    
    //Here is to check whether the slected cell is inside the frid.
    if (
      currentCol >= 0 &&
      currentCol < cols &&
      currentRow >= 0 &&
      currentRow < rows
    ){
      grid[currentCol][currentRow] = 0;//Here is to change selected cell to 0 to remove the sand.
      }
    }
  }
}



//Disturb tool: moves existing sand to nearby empty cellls.
function disturbSand(x, y){
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
        grid[currentCol][currentRow] > 0
      ){
        let sandHue = grid[currentCol][currentRow];//:to save the color of sands before moving.
        let newCol = currentCol + floor(random(-3, 4));
        let newRow = currentRow + floor(random(-2, 3));//These steps is to slect nearby random grid position.

        if (//only moving if the new position is empty& valid.
          newCol >= 0 &&
          newCol < cols &&
          newRow >= 0 &&
          newRow < rows &&
          grid[newCol][newRow] === 0
        ){
          grid[currentCol][currentRow] = 0;
          grid[newCol][newRow] = sandHue;
        }
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
    targetHue = map(centroidFreq, 180, 500, 1, 360, true);
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
  text("1: Pour | 2: Disturb | 3: Erase", 20, 70);
  text("Drag slowly for fine sand, quickly for heavier sand", 20, 90);
  text("Use + / - to change base brush size", 20, 110);
  text("Voice Frequency: " + floor(currentFreq) + " Hz", 20, 130);
  text("Current Hue: " + floor(currentHue), 20, 150);
}

function drawBrushPreview() {
  let previewBrushSize = brushSize;

  //These let the pour tool only becomes larger when mouse moves faster.
  if (inputMode === "pour"){
    let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let speedBoost = floor(constrain(mouseSpeed, 0, 30) / 6);
    previewBrushSize += speedBoost;
  }
  
  noFill();
  strokeWeight(1);

  //I wanna to use different colors to distinguish different tools.
  if (inputMode === "pour"){
    stroke(120, 30, 100);
  } else if (inputMode === "disturb"){
    stroke(45, 90, 100);
  } else if (inputMode === "erase"){
    stroke(0, 80, 100);
  }

  circle(mouseX, mouseY, previewBrushSize * w);
}

//Keyboard control:
function keyPressed() {
  if (key === '+' || key === '=') {
    brushSize = min(brushSize + 1, 20);
  } else if (key === '-') {
    brushSize = max(brushSize - 1, 1);
  }
  //Switch interaction modes:
  if (key === "1"){
    inputMode = "pour";
  } else if (key === "2"){
    inputMode = "disturb";
  } else if (key === "3"){
    inputMode = "erase";
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

