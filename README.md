# Final-Project_Group-1
# Dissolving Sandscape

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
