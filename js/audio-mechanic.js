/**
 * AUDIO MECHANIC
 * Creative Director: Drives color/hue based on audio frequency content
 * Uses the level or frequency content of an audio track to drive color changes
 */

let mic;
let fft;
let currentHue = 180;
let targetHue = 180;
let currentFreq = 0;

function initAudioMechanic() {
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);
}

function updateAudioColors() {
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
  }
}

function displayAudioInfo() {
  text("Voice Frequency: " + floor(currentFreq) + " Hz", 20, 200);
  text("Current Hue: " + floor(currentHue), 20, 220);
}
