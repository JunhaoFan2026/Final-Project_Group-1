/**
 * TIME-BASED MECHANIC
 * Creative Director: Drives background reveal and painting duration timer
 * Employs timers and events to drive visual changes; background texture is "eroded" by time
 * p5.js millis(): https://p5js.org/reference/p5/millis/
 * - Used to measure elapsed time and control the two-minute drawing phase.
 *
 * p5.js preload(): https://p5js.org/reference/p5/preload/
 * - Used to load the background image before setup() and draw() run.
 *
 * p5.js loadImage(): https://p5js.org/reference/p5/loadImage/
 * - Used to load the sand texture image from the assets folder.
 *
 * p5.js image(): https://p5js.org/reference/p5/image/
 * - Used to draw the background image onto the canvas.
 *
 * p5.js constrain(): https://p5js.org/reference/p5/constrain/
 * - Used to keep progress values safely between 0 and 1.
 *
 * p5.js drawingContext: https://p5js.org/reference/p5/drawingContext/
 * - Used to access the underlying canvas context. Here, globalAlpha
 *   controls the transparency of the background image.
 */

let paintDuration = 120000; // 2 minutes in milliseconds
let paintingActive = true;
let startTime = 0;
let timerEnded = false;
let paintingEndTime = 0;
let bgTextureAlpha = 0;
let bgImage;


/**
 * Initializes the time-based mechanic at the beginning of the sketch.
 *
 * This function should be called in setup().
 * It sets the timer to the current moment and prepares the artwork
 * for a new two-minute drawing phase.
 */
function initTimeMechanic() {
  startTime = millis();
  paintingActive = true;
  timerEnded = false;
  paintingEndTime = 0;
  bgTextureAlpha = 0;
}

function preload() {
  bgImage = loadImage('assets/sand-background.jpg');
}

/**
 * Ends the painting phase.
 *
 * This function is called either when the two-minute timer reaches zero
 * or when the user presses Space to finish early.
 *
 * Once the painting ends:
 * - the user can no longer keep drawing in the same phase,
 * - the timer is marked as finished,
 * - the background texture continues to reveal more strongly.
 */
function endPainting() {
  if (paintingActive) {
    paintingActive = false;
    timerEnded = true;
    paintingEndTime = millis();
  }
}

/**
 * Resets the time-based mechanic.
 *
 * This function should be called when the user presses R.
 * It restarts the countdown, hides the background texture again,
 * and allows the user to begin a new sand painting from zero.
 */
function resetTimerState() {
  startTime = millis();
  paintingEndTime = 0;
  paintingActive = true;
  timerEnded = false;
  bgTextureAlpha = 0;
}

/**
 * Draws the time-based background layer.
 *
 * This function should be called near the beginning of draw(),
 * before the sand grid is drawn. That way, the background appears
 * underneath the sand and does not cover the main interaction.
 *
 * The background image becomes clearer in two stages:
 * 1. During the two-minute drawing phase, it slowly appears.
 * 2. After the painting ends, it reveals more strongly over 25 seconds.
 *
 * The background supports the concept that the digital sand painting
 * is being slowly absorbed back into a physical sand-like surface.
 */
function drawTimeBasedBackground(elapsed) {
  // base dark background to keep sand readable; will be layered over by image
  background(0, 0, 10, 0.12);

  if (!bgImage) return;

  // progress of the painting build [0..1]
  let buildProgress = constrain(elapsed / paintDuration, 0, 1);
  // start revealing later and ease in
  let buildReveal = smoothStep(0.25, 1.0, buildProgress);

  // after painting ends, the texture continues to reveal over ~25s
  let afterEndReveal = 0;
  if (!paintingActive && paintingEndTime > 0) {
    afterEndReveal = constrain((millis() - paintingEndTime) / 25000, 0, 1);
    afterEndReveal = easeOut(afterEndReveal);
  }

  // make initial image nearly invisible, but increase reveal strength so it's more obvious
  // base is lower (darker start), buildReveal and afterEndReveal have larger multipliers
  bgTextureAlpha = 0.02 + buildReveal * 0.20 + afterEndReveal * 0.40;

  // draw image with calculated alpha
  push();
  drawingContext.save();
  drawingContext.globalAlpha = bgTextureAlpha;
  imageCover(bgImage, 0, 0, width, height);
  drawingContext.restore();
  pop();

  // dark wash that fades as the image reveals to make the reveal more noticeable
  let washProgress = paintingActive ? buildReveal : afterEndReveal;
  let maxWash = paintingActive ? 0.14 : 0.06; // slightly stronger while painting
  let washAlpha = maxWash * (1 - washProgress);
  washAlpha = constrain(washAlpha, 0, maxWash);

  push();
  drawingContext.save();
  drawingContext.globalAlpha = washAlpha;
  noStroke();
  fill(0, 0, 0);
  rect(0, 0, width, height);
  drawingContext.restore();
  pop();
}

/**
 * Draws an image so it covers the entire canvas.
 *
 * This works like CSS background-size: cover.
 * It scales the image to fill the canvas while preserving the original
 * image ratio. If the image and canvas have different proportions,
 * the image is cropped from the sides or top/bottom instead of stretched.
 *
 * This is useful for the sand background because the canvas size changes
 * with the browser window.
 */
function imageCover(img, x, y, w, h) {
  let imgRatio = img.width / img.height;
  let canvasRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > canvasRatio) {
    sw = sh * canvasRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = sw / canvasRatio;
    sy = (img.height - sh) / 2;
  }

  image(img, x, y, w, h, sx, sy, sw, sh);
}

/**
 * Smooth interpolation function.
 *
 * This makes a transition feel gradual instead of linear or sudden.
 * In this project, it is used to make the background reveal feel more natural.
 *
 * edge0: the point where the transition starts.
 * edge1: the point where the transition is complete.
 * x: the current progress value.
 */
function smoothStep(edge0, edge1, x) {
  let t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Ease-out interpolation.
 *
 * This starts quickly and slows down near the end.
 * It is used after the painting ends, so the background reveal feels
 * like it is settling rather than changing suddenly.
 */
function easeOut(t) {
  return 1 - pow(1 - t, 3);
}

/**
 * Displays the countdown and ending instructions.
 *
 * This function should be called after the background and sand are drawn,
 * so the text appears on top of the artwork.
 *
 * remaining: the amount of time left in milliseconds.
 */
function displayTimerInfo(remaining) {
  if (!paintingActive) {
    remaining = 0;
  }
  textSize(12);
  text("Time left: " + nf(floor(remaining / 60000), 1) + ":" + nf(floor((remaining % 60000) / 1000), 2), 20, 30);
  if (!paintingActive) {
    text("PAINTING ENDED", 20, 50);
    text("Press R to restart from zero", 20, 70);
  }
}
