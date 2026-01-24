# Interactive_FFT-Lab

Interactive aducational WebApp for explaining and visualizing the Fourier-Transform und the Inverse Fourier Transform.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## About The Project

This project was developed as a didactic prototype to bridge the gap between abstract signal processing concepts and intuitive auditory/visual experience. 

In the field of **Computer Music** and **Music Information Retrieval (MIR)**, understanding the Fourier Transform is fundamental. This application serves as an interactive playground where students can explore the duality of time and frequency domains in real-time.

It demonstrates two core concepts:
1.  **Construction (Inverse FFT):** How complex waveforms are built from simple sine waves (Additive Synthesis).
2.  **Deconstruction (FFT):** How a complex signal is decomposed back into its constituent frequencies.

## Pedagogical Approach (Didactic Statement)

This tool addresses the common hurdle in teaching Digital Signal Processing (DSP): the abstraction of the frequency domain.

* **Visualizing the Invisible:** By using a dual-view approach (Oscilloscope vs. Spectrogram), users can immediately see how adding a harmonic "bends" the waveform in the time domain while creating a distinct peak in the frequency domain.
* **Interactive Learning:** Instead of static textbook diagrams, users manipulate the parameters (Harmonics) themselves. This "Learning by Doing" approach reinforces the understanding of the Harmonic Series.
* **Real-time Feedback loop:** The immediate auditory and visual feedback helps to build an intuition for the spectral content of sounds.

## 🛠 Technical Implementation

This project is built with **Vanilla JavaScript (ES6+)** and relies heavily on the **Web Audio API** for high-precision audio processing.

### Key Technologies:
* **Web Audio API:**
    * `OscillatorNode`: Generates precise sine waves for additive synthesis.
    * `AnalyserNode`: Performs the real-time Fast Fourier Transform (FFT) to extract time-domain and frequency-domain data (`getByteTimeDomainData`, `getByteFrequencyData`).
    * `GainNode`: Handles amplitude mixing and smoothing to prevent audio artifacts (zipper noise).
* **HTML5 Canvas:**
    * Used for high-performance rendering of the oscilloscope and spectrum analyzer at 60fps.
* **CSS3:**
    * Modern, responsive layout with a focus on readability (Academic Dark Mode).

### Code Highlight: The Visualization Loop
The application separates the audio processing thread from the visual rendering loop to ensure smooth performance. The FFT size is set to `2048` to balance temporal resolution and frequency precision.

```javascript
// Example: Drawing the Frequency Spectrum
const bufferLength = analyser.frequencyBinCount;
const freqData = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(freqData);

// The visualization logic maps the linear FFT bins to 
// the canvas, applying color coding for fundamental vs. harmonics.

## Getting Started

### Prerequisites

You need a modern web browser (Chrome, Firefox, Safari, Edge) that supports the Web Audio API.

### Installation

Since this is a client-side web application, no build process or server installation is required.

1. Clone the repository:

``` bash
git clone [https://github.com/YOUR_USERNAME/interactive-fft-explainer.git](https://github.com/YOUR_USERNAME/interactive-fft-explainer.git)
```

2. Open `index.html` in your browser.

*Note: For the best experience, run it through a local server (e.g., VS Code Live Server) to avoid CORS policy restrictions on some browsers, although this project uses no external assets.*

## Future Roadmap

* [ ] Implementation of different waveforms (Square, Sawtooth) to visualize their specific harmonic spectra.

* [ ] Toggle between Linear and Logarithmic frequency scaling.

* [ ] Microphone input to analyze external sound sources.

## Author

**Malte Mittrowann**

* **[Portfolio](maltemittrowann.com/#portfolio)**

* **Focus:** Creative Coding, Music Informatics, HCI

*Developed for a Research & Teaching Demonstration.*