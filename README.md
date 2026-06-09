# Final-Project_Group-1
# Dissolving Sandscape
**GitHub Repository:** [Final Project Group 1](https://github.com/JunhaoFan2026/Final-Project_Group-1)
> The user can create, but cannot keep it.
## Project Overview

**Dissolving Sandscape** is an interactive p5.js artwork about impermanence. The audience creates a digital sand image by pouring, disturbing, and erasing particles, but the work is never meant to remain fixed. Audio shifts the sand’s colour, time fades the image toward grey-white, a sand-texture background slowly emerges, and Perlin-driven motion eventually dissolves the landscape back into dust.

![Dissolving-Sandscape](/assets/Dissolving-Sandscape.jpg)
---

## Inspiration

Our project is inspired by the idea that beautiful things are temporary. Tibetan sand mandalas shaped the conceptual direction: they are carefully made from coloured sand, then intentionally dismantled as a reminder of impermanence. teamLab’s *Flowers and People – A Whole Year per Hour* also influenced our time-based structure, where life, blooming, scattering, and decay happen continuously through real-time computation. Technically, we were influenced by The Coding Train’s *Falling Sand* challenge, which helped us understand grid-based pixel simulation, and Max Bittker’s *Sandspiel*, which shows how simulated materials can become playful and expressive. In our own code, these ideas become a shared sand grid: mouse and keyboard input create or disturb particles, audio frequency changes their hue, a timer controls fading and background reveal, and Perlin noise/randomness produces the final erosion. We also use a real sand-texture image as a background source to connect the digital system back to physical material.

![Tibetan-sand-mandala-reference](/assets/Tibetan-sand-mandala-reference.png)

## Techniques
This project combines audio, time-based systems, Perlin noise, randomness, and user input to create an interactive sand painting experience. Microphone input is analysed using p5.AudioIn and p5.FFT, allowing voice frequencies to control the colour of newly generated sand. A timer-driven system limits the drawing phase and gradually reveals the background image over time, reinforcing the theme of impermanence. Perlin noise and random values influence sand movement, wind behaviour, erosion, and particle explosions, creating more natural and dynamic motion. Mouse and keyboard interactions allow users to pour, disturb, and erase sand, switch tools, and adjust brush size. Together, these mechanics create a generative artwork where sound, time, movement, and user actions continuously shape the visual outcome.

## Mechanic Ownership

### User Input Mechanic — Jialu Li
My work began by improving the basic sand drawing interaction.
I created a reusable addSand() function, added brush-size-based sand placement, supported mouse clicking, and used floor() to convert mouse positions into grid cells. I then reorganized the input structure through usersTool(), made brushSize global, and added visual feedback for mode and brush size. 
Later, I developed three tools: Pour, Disturb, and Erase. Pour responds to mouse speed, Disturb moves existing sand while keeping its hue, and Erase removes sand cells. I also polished on-screen instructions, keyboard controls, restart behavior, and brush preview.

### Audio Mechanic — Junhao fan
I was responsible for the Audio mechanic, which uses voice frequency to drive visual changes. Specifically, I implemented microphone input, FFT frequency analysis, and the mapping of audio frequencies to sand colour values, allowing users to influence the visual output through sound. In addition, I developed the initial sand simulation framework, including the particle grid structure, basic falling-sand behaviour, and parts of the main program integration. My contribution focused on connecting audio input with the particle system to enhance interactivity and enable users to participate in the generative artwork through their voice.

### Time-Based Mechanic — Jiajun Zhao
My mechanic controls the lifecycle of the sand painting through time. I set the main drawing phase to last for two minutes, giving the audience a limited amount of time to create the sand image. During this phase, the user can still interact with the sand through the shared tools, but the countdown makes the artwork feel temporary rather than endless. I also added the option to press the spacebar to end the drawing phase early.

Once the painting phase ends, the artwork is no longer treated as a permanent image. The sand gradually loses saturation and fades toward a grey-white colour, suggesting that the image is losing energy over time. I also added a background image that becomes clearer as the timer progresses, making the passage of time visible in the environment itself. Pressing `R` resets the timer, clears the state, and allows the user to begin a new sand painting. This mechanic supports our project theme: beautiful things can be created, but they cannot be held forever.


### Perlin Noise and Randomness Mechanic — Runcheng Tian
I was responsible for the Perlin noise and randomness mechanic.
My contribution included:
- creating the Perlin noise wind field for natural sand movement
- improving dune-like sand stacking and erosion behaviour
- controlling movement variation using random values and randomSeed()
- developing the final dissolve and particle explosion effect
- creating coloured particle fading and gravity movement helping connect the erosion mechanic to the project theme of impermanence and temporary digital sand art

## AI Acknowledgement
Our team used ChatGPT as a supplementary learning and troubleshooting tool throughout the development of this project. It supported our understanding of p5.js concepts, including user interaction, audio input and frequency analysis, Perlin noise, particle systems, timers, easing functions, and visual effects. We also used it to identify syntax and logic errors, explore possible solutions, and improve project documentation. All code was independently written, tested, modified, reviewed, and integrated by the team. ChatGPT did not directly produce the final project, and all suggestions were carefully verified and adapted to meet the project goals and course requirements.

## External References

### Perlin Noise / Natural Movement

- The Coding Train — [*Perlin Noise Tutorial*](https://codingtrain.github.io/website-archive/learning/noise/)
- Raging Nexus — [*Perlin Noise Flow Field*](https://ragingnexus.com/creative-code-lab/experiments/perlin-noise-flow-field/)

### Falling Sand Simulation

- The Coding Train — [*Coding Challenge #180: Falling Sand*](https://thecodingtrain.com/challenges/180-falling-sand/)
- The Coding Train — [*Falling Sand Video*](https://www.youtube.com/watch?v=L4u7Zy_b868)
- Max Bittker — [*Sandspiel*](https://sandspiel.club/)

### Particle Explosion / Dissolve Effect

- p5.js Example — [*Particle System*](https://archive.p5js.org/examples/simulate-particle-system.html)
- p5.js Example — [*Smoke Particle System*](https://p5js.org/examples/math-and-physics-smoke-particle-system/)
- teamLab — [*Universe of Water Particles*](https://www.teamlab.art/w/uowp/)

### Audio Control and Sound Analysis

- The Coding Train — [*Microphone Input*](https://thecodingtrain.com/tracks/sound/sound/8-microphone-input)
- The Coding Train — [*Sound Visualization*](https://thecodingtrain.com/tracks/sound/sound/9-sound-visualization)
- The Coding Train — [*Sound Visualization: Radial Graph*](https://thecodingtrain.com/tracks/sound/sound/10-sound-visualization-radial-graph)
- The Coding Train — [*Sound Visualization: Frequency Analysis*](https://thecodingtrain.com/tracks/sound/sound/11-sound-visualization-frequency-analysis)

### Time-Based and Temporary Artwork Inspiration

- Minneapolis Institute of Art — [*The Tibetan Sand Mandala: A Short History*](https://new.artsmia.org/hub/programming-events/tibetan-sand-mandala-history)
- teamLab — [*Flowers and People – A Whole Year per Hour*](https://www.teamlab.art/w/flowersandpeople-hour/)

### General p5.js References

- [*p5.js Reference*](https://p5js.org/reference/)
- p5.js Reference — [*millis()*](https://p5js.org/reference/p5/millis/)
- p5.js Reference — [*loadImage()*](https://p5js.org/reference/p5/loadImage/)
- p5.js Reference — [*preload()*](https://p5js.org/reference/p5/preload/)
- p5.js Reference — [*image()*](https://p5js.org/reference/p5/image/)
- p5.js Reference — [*constrain()*](https://p5js.org/reference/p5/constrain/)

## Interaction Instructions
Click on the canvas to begin interacting with the artwork and use the mouse to pour sand. Press keys 1, 2, and 3 to switch between three modes: Pour, Disturb, and Erase. The + and - keys can be used to adjust brush size, allowing users to control the scale and density of sand generation. In Pour mode, faster mouse movement produces a larger sand spread, making the interaction more dynamic and responsive.
Users can also speak or make sounds into the microphone. The system analyses real-time audio frequency and maps it to the colour of newly generated sand, enabling voice-driven visual changes throughout the artwork. The drawing phase lasts approximately two minutes, during which users can freely create and modify the sand composition.
Once the timer ends, the painting mode automatically stops. The sand gradually breaks apart into particles and fades away, while the background image slowly becomes visible. Users can press F to trigger the final explosion effect early or press R to restart the experience, allowing them to re-engage with the generative process from the beginning.

## Repository Structure 

| File / Folder | Purpose |
|---|---|
| `index.html` | Loads the p5.js project and connects the JavaScript, CSS, and library files. |
| `style.css` | Controls the webpage layout and visual presentation outside the canvas. |
| `sketch.js` | Main project sketch and early shared development file where mechanics were first tested together. |
| `js/` | Organised JavaScript files separated by mechanic or project function after the prototype was developed. |
| `libraries/` | Contains p5.js and related library support files needed to run the project. |
| `assets/` | Contains supporting visual materials, including the time-based background image and README images. |
| `README.md` | Documents the project concept, inspiration, techniques, mechanic ownership, AI acknowledgement, references, and interaction instructions. |
