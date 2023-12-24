## COMP 122 Project Part 4 - Generative Music
*Create one or more Markov graphs to guide a sequence generator*

For the final stage in this project, we will define a "graph" for a Markov chain that will generate music according to probabilities defined by the composer (that's you). This is an algorithm found in many applications in which computers make decisions based on probability or observed patterns. 

In this project, the machine won't do any learning or adapting, though that might be the next extension if we were to develop this application further. Instead, you will construct a probability table that will govern the behavior of your system. It's a form of composition in which you set the parameters and let the process determine the actual result. The player application will play a semi-random note sequence using your data file (markov.json) to choose the next note. Your file will define the probabilities of the transitions from one note to another as well as rhythmic values.

## Instructions

1. Go to **replit** and launch your own version of **Project 4** ("start project"). It will look identical to Projects 1-3, but there are some enhancements and bug fixes that will make this phase work better.
2. **Find the file "markov.json"** in the file list. It should have only an empty array for its contents:
``` 
[ ]
```
3. **Create two empty objects** inside those square brackets. Objects are contained in "curly" brackets. Make sure to separate multiple items with commas:
``` 
  [
    {},
    {}
  ]
```
4. **Run your sketch** and open the section labeled "Part 4 Music Generator." You should see two blocks, each with a green start button. It won't do anything yet, but if you see that, everything is correct so far. If you see a JSON error message, double check your JSON syntax and make sure it matches the example above exactly.
5. **Let's build** a Markov chain graph for music generation! It will have two main components for each object created in step 3 above: a pitchSet graph and a rhythmSet graph.
    1. **Give the generator a name** (call it whatever you like. I'm calling it "markov 1"), and add properties for "pitchSet" and "rhythmSet". The values for these last two are empty objects (we will fill them in at the next step) :
```  
[
  {
    "name" : "markov 1",
    "pitchSet" : {},
    "rhythmSet" : {}
  },
  {}
] 
```
    2. Next, **define the pitchSet object**. It needs properties for "state" and "matrix." "state" is the starting note, and "matrix" is the probability table that determines the next note in the sequence. Let's start by setting the first note ("state") to "C4" (using Tone.js "scientific" notation: note number and octave). Then, let's add a very simple matrix graph that will only play one note. We can't test it until we fill in the rhythmSet, so it's better to not get too complicated or fancy before testing to make sure it works. The matrix is a list of notes that are formatted as "object properties." Their values must be formatted as an array of possible next notes. We can develop this further, once we get it working, but let's do this for now: 
```
[
  {
    "name" : "markov 1",
    "pitchSet" : {
      "state" : "C4",
      "matrix" : {
        "C4" : ["C4"]
        }
      },
    "rhythmSet" : {}
    },
  {}
  ]
```
    3. Now we can **define the rhythmSet** in a similar fashion. Like the pitchSet, we have a starting state (the first note will have this value). Instead of a pitch value, we need a rhythmic duration value (in Tone.js notation: "4n", "8n", "2n", etc.)
``` 
[
    {
        "name": "markov 1",
        "pitchSet": {
            "state": "C4",
            "matrix": {
                "C4": ["C4"]
            }
        },
        "rhythmSet": {
            "state": "4n",
            "matrix": {
                "4n": ["4n"]
            }
        }
    },
    {}
]
```
    4. **Run your sketch.** Start the Transport and open up Part 4 Music Generator. You should see a single note "node" on the right-hand side of the generator's "start" button. The label on the button should match the "name" you gave the generator in step 5.1 above. Press the play button. It should play a repeating quarter note "C4" until you press the button to stop it again. Fix any syntax errors in your JSON formatting if necessary.
6. **Enhance** your music generator by adding more possibilities to your graph. In the pitchSet, you can extend the table by adding more "nodes" to the list (possible states, or notes). **Each node must be a unique value.** Duplicates will cause the current app version to crash. For each node, you must provide a list of possible next states, formatted as an array (square "[ ]" brackets). Like so (this is just the "pitchSet" object, not the complete code):
``` 
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
    }
```
7. You can **enhance the rhythmSet** the same way. Remember that for each possible next state (in the array contained in the square "[ ]" brackets), you should also define a "node." If the player chooses a possibility from your list that doesn't have a next step defined, the system will hang (and possibly crash). Here is a correct example:
``` 
    "rhythmSet" : {
      "state" : "4n",
      "matrix" : {
        "4n" : ["4n", "8n"],
        "8n" : ["8n", "8n.", "4n"],
        "8n." : ["8n.", "8n", "2n"],
        "2n" : ["4n", "8n"]
      }
    }
```
8. **Test your player.** You should see a colored circle (colors are random) with the name of each note node in your pitch set matrix. You should also see arrows indicating the possible connections from one note to the next. **Start the transport and press the play button** for your music generator. You should see and hear a Markov-generated note sequence. 
9. **Create a second music generator** as the second object in the top-level array. Maybe you want them to harmonize, and maybe you don't. You have total freedom in terms of what pitches and rhythms you choose, as long as you follow the syntax rules outlined above. Have fun!


