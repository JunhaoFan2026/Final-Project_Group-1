/**
 * PERLIN NOISE & RANDOMNESS MECHANIC
 * Mechanic Director: Runcheng Tian
 * 
 * This mechanic controls:
 * - Perlin-noise-based wind movement
 * - random sand movement variation
 * - dune-like sand stacking
 * - particle dissolve / explosion effects
 * 
 * AI Acknowledgement:
 * Some logic was developed with the help of ChatGPT for understanding
 * Perlin noise movement, sand physics behaviour, and particle dissolve systems.
 * All code was manually tested, modified, and integrated into the final project.
 * 
 * External References:
 * Perlin Noise Tutorial:
 * https://codingtrain.github.io/website-archive/learning/noise/
 * 
 * Falling Sand Simulation:
 * https://thecodingtrain.com/challenges/180-falling-sand/
 * 
 * Particle System Reference:
 * https://archive.p5js.org/examples/simulate-particle-system.html
 */

let noiseStep = 0;
let particles = [];
let explodeMode = false;

// Use fixed randomSeed() and noiseSeed()
// to keep Perlin noise movement visually consistent
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

        // Perlin noise creates smooth wind-like movement.
        // Unlike pure random motion, neighbouring values are connected,
        // making the sand drift feel more natural and organic.
        // Upper sand particles receive stronger wind influence,
        // while lower sand settles more stably into dune-like shapes.
        // Perlin noise technique inspired by
        // The Coding Train noise tutorial
        let heightFactor = map(j, 0, rows, 1.2, 0.8);
        // Sample Perlin noise field using grid position and time
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

        // Small random variation prevents movement
        // from looking too mechanical
        if (isEmpty(below) && random(1) < 0.95){
          nextGrid[i][j + 1] = fadedCell;
        } else if (isEmpty(belowA)) {
          nextGrid[i + dir][j + 1] = fadedCell;
        } else if (isEmpty(belowB)) {
          nextGrid[i - dir][j + 1] = fadedCell;
        } else {
          // Random side slipping helps create more natural
          // dune stacking and erosion behaviour
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
  
  // Slowly move through the Perlin noise field over time
  // to create evolving wind motion
  noiseStep += 0.008;
  return nextGrid;
}

// Adapted from p5.js particle system examples
// and modified for coloured sand dissolve behaviour
function triggerExplosion(grid, cols, rows, w) {
  particles = [];
  explodeMode = true;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];

      if (!isEmpty(cell)) {
        let x = i * w;
        let y = j * w;

        // Each sand cell becomes an individual particle
        // with random velocity for dissolve/explosion motion
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
      // Gravity slowly pulls particles downward
      p.vy += 0.05;
      // Gradually fade particles over time
      p.life -= 1.2;

      noStroke();
      fill(p.hue, 100, 100, p.life);
      // Draw dissolve particles using original sand colour
      circle(p.x, p.y, 3);

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
}

// Helper function used by the main sketch
// to check whether dissolve mode is active
function isExploding() {
  return explodeMode;
}
