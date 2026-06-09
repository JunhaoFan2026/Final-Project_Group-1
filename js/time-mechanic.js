/**
 * TIME-BASED MECHANIC
 * Creative Director: Drives background reveal and painting duration timer
 * Employs timers and events to drive visual changes; background texture is "eroded" by time
 */

let paintDuration = 120000; // 2 minutes in milliseconds
let paintingActive = true;
let startTime = 0;
let timerEnded = false;
let paintingEndTime = 0;
let bgTextureAlpha = 0;
let bgImage;

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

function endPainting() {
  if (paintingActive) {
    paintingActive = false;
    timerEnded = true;
    paintingEndTime = millis();
  }
}

function resetTimerState() {
  startTime = millis();
  paintingEndTime = 0;
  paintingActive = true;
  timerEnded = false;
  bgTextureAlpha = 0;
}

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

function smoothStep(edge0, edge1, x) {
  let t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function easeOut(t) {
  return 1 - pow(1 - t, 3);
}

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
