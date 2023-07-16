# COMP 122 Web Audio Player Project
This is a series of creative exercises designed to work together as a unified real-time interactive musical instrument implemented in the browser using Tone.js (for sound) and P5.js (for graphics).

Students will add their own content to the four sections of this project (sampler, synth, sequencer, generator) by uploading and editing media dependencies (sound files, etc.) and JSON data files describing the parameters for each section.

## Project 1 - Sampler

Students will locate and edit short soundfile samples to be triggerd at will within the project interface. Each sample will be described within a JSON file with a prescribed structure.

For example:
```json
{
  "samples" :
  [
    {
      "name" : "fear",
      "file" : "samples/FDR_fear_itself.mp3",
      "bpm" : 120
    },
    {
      "name" : "the only thing",
      "file" : "samples/FDR_the_only_thing.mp3"
    }
  ]
}
```

## Project 2 - Synthesizer
## Project 3 - Sequencer & Beat Generator
## Project 4 - Algorithmic Music Generator
Create a JSON describing Markov probability tables for both rhythm and pitch. The graph may be derived from an existing tune or may be entirely invented by the student. It is possible to create multiple Markov generators and to play them simultaneously (in time with the central Transport clock).

For example:
```json
[
  {
    "name" : "bass",
    "pitchSet" : {
    "state" : "C3",
    "matrix" : {
      "C3" : ["C3", "G3", "B2"],
      "G3" : ["C3", "G3", "B2"],
      "B2" : ["C3"]
      }
    },
    "rhythmSet" : {
      "state" : "4n",
      "staccato" : "true",
      "matrix" : {
        "4n" : ["4n", "16n"],
        "16n" : ["4n", "16n", "8n"],
        "8n" : ["4n", "16n", "8n"]
      }
    }
  },
  {
    "name" : "twinkle",
    "pitchSet" : {
    "state" : "C4",
    "matrix" : {
      "C4" : ["C4", "G4"],
      "G4" : ["G4", "A4", "F4"],
      "A4" : ["A4", "G4"],
      "F4" : ["F4", "E4"],
      "E4" : ["E4", "D4"],
      "D4" : ["D4", "C4"]
      }
    },
    "rhythmSet" : {
      "state" : "8n",
      "staccato": " true",
      "matrix" : {
        "8n" : ["8n", "8n", "8n", "2n"],
        "2n" : ["8n"]
      }
    }
  }
]
```