let grid;
let w = 4;
let cols, rows;
let noiseStep = 0;

let mic;
let fft;
let currentHue = 180;
let targetHue = 180;
let currentFreq = 0;
let particles = [];
let explodeMode = false;

// User input,
let inputMode = "pour"; 
let brushSize = 5; // make brushsize as the global variable
let paintDuration = 120000; // 2 minutes in milliseconds
let paintingActive = true;
let startTime = 0;
let timerEnded = false;

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  randomSeed(9103);
  noiseSeed(9103);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  startTime = millis();
  paintingActive = true;
  timerEnded = false;

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
  if (!paintingActive) {
    return;
  }
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
        grid[currentCol][currentRow] = { hue: currentHue, sat: 100, bri: 100 };
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
        grid[currentCol][currentRow] = emptyCell(); //Here is to change selected cell to 0 to remove the sand.
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
        !isEmpty(grid[currentCol][currentRow])
      ){
        let sandCell = copyCell(grid[currentCol][currentRow]); // save the color and brightness of sands before moving.
        let newCol = currentCol + floor(random(-3, 4));
        let newRow = currentRow + floor(random(-2, 3));//These steps is to select nearby random grid position.

        if (//only moving if the new position is empty & valid.
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

function draw() {
  background(0, 0, 10, 0.12);

  let elapsed = millis() - startTime;
  let remaining = max(0, paintDuration - elapsed);
  if (paintingActive && remaining <= 0) {
    paintingActive = false;
    timerEnded = true;
  }

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
      let sandCell = grid[i][j];
      if (!isEmpty(sandCell)){
        fill(sandCell.hue, sandCell.sat, sandCell.bri);
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
      if (!isEmpty(state)){
        if (j >= rows - 1) {
          nextGrid[i][j] = copyCell(state);
          nextGrid[i][j].sat = max(nextGrid[i][j].sat - 0.033, 0);
          nextGrid[i][j].bri = min(nextGrid[i][j].bri + 0.017, 90);
          continue;
        }
        
        let below = grid[i][j + 1];

        let heightFactor = map(j, 0, rows, 1.5, 0.3);

        let wind = noise(i * 0.03, j * 0.03, noiseStep);

        wind *= heightFactor;

        let dir = 0;

        if (wind > 0.55){
          dir = 1;
        } else if (wind < 0.45){
          dir = -1;
        }

        let belowA = emptyCell();
        let belowB = emptyCell();
        if (i + dir >= 0 && i + dir <= cols - 1){
          belowA = grid[i + dir][j + 1];
        }
        if (i - dir >= 0 && i - dir <= cols - 1){
          belowB = grid[i - dir][j + 1];
        }

        let fadedCell = copyCell(state);
        fadedCell.sat = max(fadedCell.sat - 0.033, 0);
        fadedCell.bri = min(fadedCell.bri + 0.017, 90);

        if (isEmpty(below)){
          nextGrid[i][j + 1] = fadedCell;
        } else if (isEmpty(belowA)) {
          nextGrid[i + dir][j + 1] = fadedCell;
        } else if (isEmpty(belowB)) {
          nextGrid[i - dir][j + 1] = fadedCell;
        } else {
            if (
              random(1) < 0.03 &&
              dir !== 0 &&
              i + dir >= 0 &&
              i + dir < cols &&
              isEmpty(grid[i + dir][j])
            ) {
              nextGrid[i + dir][j] = fadedCell;
            } else {
              nextGrid[i][j] = fadedCell;
            }
        }
      }
    }
  }
    grid = nextGrid;
    noiseStep += 0.003;

    drawInputInstructions(remaining);
    drawBrushPreview();

    if (explodeMode) {

      background(0, 0, 10, 0.2);

      for (let i = particles.length - 1; i >= 0; i--) {

        let p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 1.2;

        noStroke();
        fill(p.hue, 100, 100, p.life);
        circle(p.x, p.y, 3);

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }

}

function drawInputInstructions(remaining) {
  if (!paintingActive) {
    remaining = 0;
  }
  fill(255);
  noStroke();
  textSize(12);
  text("Time left: " + nf(floor(remaining / 60000), 1) + ":" + nf(floor((remaining % 60000) / 1000), 2), 20, 30);
  if (!paintingActive) {
    text("PAINTING ENDED", 20, 50);
    text("Press R to restart from zero", 20, 70);
  }
  text("Mode: " + inputMode, 20, 100);
  text("Brush size: " + brushSize, 20, 120);
  text("1: Pour | 2: Disturb | 3: Erase", 20, 140);
  text("+ / -: change brush size", 20, 160);
  text("SPACE: end painting early | F: explode | R: restart", 20, 180);
  text("Voice Frequency: " + floor(currentFreq) + " Hz", 20, 200);
  text("Current Hue: " + floor(currentHue), 20, 220);
}

function triggerExplosion() {
  particles = [];
  explodeMode = true;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let cell = grid[i][j];

      if (!isEmpty(cell)) {

        let x = i * w;
        let y = j * w;

        particles.push({
          x: x,
          y: y,
          vx: random(-2, 2),
          vy: random(-3, 1),
          hue: cell.hue,
          life: 255
        });

        grid[i][j] = emptyCell();
      }
    }
  }
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

//User input:keyboard control:
function keyPressed() {
  if (key === '+' || key === '=') {
    brushSize = min(brushSize + 1, 20);
  } else if (key === '-') {
    brushSize = max(brushSize - 1, 1);
  } else if (key === ' ' || keyCode === 32) {
    paintingActive = false;
    timerEnded = true;
  }
  // Switch interaction modes:
  if (key === "1"){
    inputMode = "pour";
  } else if (key === "2"){
    inputMode = "disturb";
  } else if (key === "3"){
    inputMode = "erase";
  } else if (key === 'f' || key === 'F') {
    triggerExplosion();
  } else if (key === 'r' || key === 'R') {
    startTime = millis();
    paintingActive = true;
    timerEnded = false;
    explodeMode = false;
    particles = [];
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

