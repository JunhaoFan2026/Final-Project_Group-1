/**
 * PERLIN NOISE & RANDOMNESS MECHANIC
 * Creative Director: Drives sand physics, wind, and particle behavior
 * Utilizes Perlin noise AND random values or random seed to drive mechanics
 */

let noiseStep = 0;
let particles = [];
let explodeMode = false;

function initPerlinNoiseMechanic() {
  randomSeed(9103);
  noiseSeed(9103);
  noiseStep = 0;
  particles = [];
  explodeMode = false;
}

function resetNoiseState() {
  noiseStep = 0;
  particles = [];
  explodeMode = false;
}

function updateSandPhysics(grid, cols, rows, w) {
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

        // Perlin noise drives wind direction
        let heightFactor = map(j, 0, rows, 1.2, 0.8);
        let wind = noise(i * 0.03, j * 0.03, noiseStep);
        wind = (wind - 0.5) * heightFactor;

        let dir = 0;
        if (wind > 0.08){
          dir = 1;
        } else if (wind < -0.08){
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

        // Random chance for sand to fall
        if (isEmpty(below) && random(1) < 0.95){
          nextGrid[i][j + 1] = fadedCell;
        } else if (isEmpty(belowA)) {
          nextGrid[i + dir][j + 1] = fadedCell;
        } else if (isEmpty(belowB)) {
          nextGrid[i - dir][j + 1] = fadedCell;
        } else {
          // Random chance for sand to spill to side
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
  
  noiseStep += 0.008;
  return nextGrid;
}

function triggerExplosion(grid, cols, rows, w) {
  particles = [];
  explodeMode = true;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];

      if (!isEmpty(cell)) {
        let x = i * w;
        let y = j * w;

        // Random velocity for particle explosion
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

function updateExplosionParticles() {
  if (explodeMode) {
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

function isExploding() {
  return explodeMode;
}
