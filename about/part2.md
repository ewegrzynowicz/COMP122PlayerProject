## COMP 122 Project Part 2 - Synthesis
*Design synthesizer presets*
Create a set of synthsizer preset sounds using Tone.js

The synth presets in this project are based on prototypes available in the Tone.js library. Although there are a few more sophisticated synth types available, we will stick to a handful of basic types:

* **Synth** - a simple oscillator routed through an envelope generator. As simple as it gets. This is the default sound for the sequencer and the algorithmic music generator.
*  **FMSynth** - a Frequency Modulation synthesizer with one operator. This FM Synth has two oscillators. One is designated as the "carrier" with a frequency controlled by the keyboard (pitches in the standard scale). The second oscillator, the "modulator", affects the frequency component of the carrier. The effect at low modulator frequencies (~1 or 2 Hz) and low amplitude is a *vibrato,* or subtle fluctuation in pitch. At higher modulation frequencies and amplitudes, the timber of the carrier oscillator is transformed and rich timbres emerge.
*  **AMSynth** - Amplitude Modulation Synthesis, as with FM Synthesis, generates rich timbres when one ocsillator modulates the other. In this case, the modulator affects the *amplitude* of the carrier oscillator, rather than the frequency. At low levels and speeds, this sounds like a *tremolo,* or a subtle variation in volume.
*  **Sampler** - a sampling synthesizer, or just "Sampler", is an instrument that uses short audio recordings for each note played on the keyboard. Therefore, the computer's processor does less work, since it is not generating sound mathematically (as with oscillator-based instruments), but there is more data involved (both storage and throughput). In most samplers, a set of sound files (.wav, .mp3, etc.) are stored and mapped across the keyboard so that they play back in response to user actions. Individual samples may be associated with a single note, or may be mapped across a range of keys with its pitch transposed relative to its normal pitch.
*  **PluckSynth** - this instrument mimics a plucked string instrument using the Karplus-Strong string synthesis algorithm. In this technique, a short burst of noise is fed through a filter and a repeating delay to approximate the physics of a plucked string instrument <a href="https://en.wikipedia.org/wiki/Karplus%E2%80%93Strong_string_synthesis" target="_blank">Wikipedia: Karplus-Strong synthesis</a>

Your project will consiste of a JSON document called "synths.json" that describes at least two synthesizer presets. Your project should go beyond the default settings, changing key parameters to achieve a unique synthesizer timbre. Also, you get to name it! 

Here's a sample:
```json
[
  {
    "name" : "megasynth",
    "type" : "AMSynth",
    "settings" : {}
  },
  {
    "name" : "FM Aliens",
    "type" : "FMSynth",
    "settings" : {}
  }
]
```