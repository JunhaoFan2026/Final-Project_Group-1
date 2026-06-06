let grid;
let w = 4;
let cols, rows;
let noiseStep = 0;

let mic;
let fft;
let currentHue = 0;
let targetHue = 0;

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
  createCanvas(600, 800);
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

function mouseDragged(){
  addSand(mouseX,mouseY);
}

function mousePressed() {
  addSand(mouseX, mouseY);
}

function addSand(x, y) {
  let col = floor(x / w);
  let row = floor(y / w);

  let brushSize = 5;
  let extent = floor(brushSize / 2);

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
    targetHue = map(centroid, 0, spectrum.length, 0, 360);
    targetHue = constrain(targetHue, 0, 360);
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
}
