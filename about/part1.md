## COMP 122 Project Part 1 - Sampler
*Play back recorded sounds interactively*

**Step 1** - Load your own sampled sounds into the "samples" folder on replit where your version of the project is hosted. 
- These sounds should be relatively short, cleanly edited, and balanced for volume if necessary ("normalized").
- They should be formatted as .wav or .mp3.
- File names should not have spaces in them. Use dashes or underscores if necessary.

**Step 2** - Create a JSON document describing your samples and the metadata that the sample player will need to process the sound files and play them in the context of the musical grid (the Tone Transpost). In this document, your data will take the form of an array of objects. In JSON, and array is notated with ["square" brackets], and an object is notated with {"curley" brackets}. An array is a list (of anything), while an object, in its simplest form, is a set of name-value pairs describing object properties.

For example, an array of three objects would have this structure:
```json
[
  {name : value},
  {name : value},
  {name : value}
]
```
For your project, you will need to describe a set of sound files in this format, with some specific properties notated.

Here's my demo file:
```json
[
  {
    "name" : "fear",
    "file" : "samples/FDR_fear_itself.mp3",
    "bpm" : 120,
    "duration" : "1m"
  },
  {
    "name" : "the only thing",
    "file" : "samples/FDR_the_only_thing.mp3",
    "bpm" : 120
  },
  {
    "name" : "Camden Rain Piano (ST)",
    "file" : "samples/Camden_Rain_piano.wav",
    "bpm" : 120,
    "duration" : "8m"
  }
]
```
For each sample (an {object} in the top-level [array]), there are properties for "name," "file" (a path to the sound file itself), "bpm" (beats per minute -- allows the sample to scale its speed at different tempos), and "duration" (length of the sample for looping purposes). The most important property is the file, followed by name. The other two are optional. Your list should be different from mine.