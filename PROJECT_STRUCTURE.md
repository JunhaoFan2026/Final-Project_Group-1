# Sand Drawing - Group 1 Final Project

## Project Overview
A creative sand drawing experience that combines four distinct mechanics, each driven by different forces:

## Mechanics & Creative Directors

### 1. **Audio Mechanic** (`js/audio-mechanic.js`)
**Creative Director**: Audio Input Specialist  
**Driver**: Frequency content of microphone input  
**Effect**: Changes the hue/color of sand based on the spectral centroid of the audio input. Higher frequencies shift colors towards different hues on the HSB spectrum.

**Key Variables**:
- `currentHue` - Current sand color
- `currentFreq` - Detected frequency centroid
- `fft` - Fast Fourier Transform analyzer

---

### 2. **Time-Based Mechanic** (`js/time-mechanic.js`)
**Creative Director**: Time & Atmosphere Director  
**Driver**: 2-minute painting timer and elapsed time events  
**Effect**: Controls the reveal of a background texture over time, creating an "erosion" effect where the hidden landscape gradually becomes visible. This is both the painting duration constraint and the visual atmosphere.

**Key Variables**:
- `paintDuration` - 120 seconds for active painting
- `paintingActive` - Whether user can still draw
- `bgTextureAlpha` - Background image opacity driven by time

**Controls**:
- **SPACE**: End painting early → background reveals faster
- **F**: Trigger explosion + force full background reveal
- **R**: Reset everything

---

### 3. **Perlin Noise & Randomness Mechanic** (`js/perlin-noise-mechanic.js`)
**Creative Director**: Physics & Chaos Specialist  
**Drivers**: Perlin noise for wind, random values for particle behavior  
**Effects**: 
- Sand falls according to physics influenced by Perlin-based wind
- Sand gradually desaturates and brightens as it settles
- Explosion particles fly with random velocities

**Key Behaviors**:
- `wind = noise(i * 0.03, j * 0.03, noiseStep)` - Wind direction changes smoothly
- `random(-2, 2)` - Particle velocities during explosion
- `random(1) < 0.95` - Probability-based sand falling

---

### 4. **User Input Mechanic** (`js/user-input-mechanic.js`)
**Creative Director**: Interaction Designer  
**Drivers**: Mouse and keyboard inputs  
**Effects**:
- **Mouse Dragging**: Paint with three tools
  - **1 (Pour)**: Paint where you drag, speed affects brush size
  - **2 (Disturb)**: Move existing sand to nearby empty cells
  - **3 (Erase)**: Clear sand in brush area
- **Keyboard**:
  - **+/-**: Adjust brush size
  - **1/2/3**: Switch tools
  - **SPACE**: End painting
  - **F**: Explode (combined with audio color)
  - **R**: Reset

---

## Project Structure

```
Final-Project_Group-1/
├── index.html              # Main HTML file (loads all scripts)
├── style.css               # Canvas styling
├── js/
│   ├── audio-mechanic.js       # Audio-driven colors
│   ├── time-mechanic.js        # Timer + background reveal
│   ├── perlin-noise-mechanic.js # Physics + particles
│   ├── user-input-mechanic.js   # Mouse/keyboard input
│   └── main.js                 # Main setup() and draw() loop
├── assets/
│   └── sand-background.jpg     # Background texture (optional)
├── libraries/
│   ├── p5.min.js              # p5.js library
│   └── p5.sound.min.js        # p5.sound library
├── README.md               # This file
```

## How to Run

1. **Ensure `sand-background.jpg` is in place**:
   ```
   assets/sand-background.jpg
   ```
   If this file doesn't exist, the sketch will still run but without background texture.

2. **Open `index.html` in a web browser**:
   - Use Live Server or any local HTTP server
   - Or simply drag `index.html` into your browser (note: may have CORS issues with image loading)

3. **Allow Microphone Access**:
   - The browser will ask for microphone permission
   - Click "Allow" to enable audio-driven color changes

## Interaction Flow

1. **Start**: Canvas appears with faint background texture
2. **Paint**: 
   - Use mouse to draw with sand
   - Sound frequencies change sand color
   - Sand falls via Perlin noise wind
3. **Time Elapses**: 
   - Background gradually becomes visible (over 2 minutes)
   - Sand settles and desaturates
4. **End Painting**:
   - Press SPACE: Normal ending (background continues revealing)
   - Press F: Instant explosion + full background reveal
5. **Reset**: Press R to start over

## Technical Details

- **Grid Size**: 4×4 pixels per cell (configurable via `w`)
- **Color Model**: HSB (Hue, Saturation, Brightness) - allows smooth color transitions
- **Sand Physics**: 
  - Falls down, influenced by Perlin noise wind
  - Randomly settles sideways if blocked
  - Gradually fades to gray-white (desaturation + brightening)
- **Explosion**: Converts all sand cells to particles with random velocities

## Notes

- Each script file is independent and can be modified without affecting others
- The `main.js` orchestrates all mechanics in the `draw()` loop
- Backup of original monolithic sketch: `sketch.js` (kept for reference)
