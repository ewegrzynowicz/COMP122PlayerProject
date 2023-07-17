let beatPromise = loadBeatData("beats.json");

// read in the JSON file with sampler meta-data
async function loadBeatData(file) {
  const response = await fetch(file);
  const text = await response.text(); 
  try {
    let obj = JSON.parse(text); // if JSON is valid, make an object
    makeBeats(obj); // generate Markov player and GUI
    return obj;
  } 
  catch (error){
    let e = "error - invalid JSON file (beats.json)<br /> copy and paste your JSON to <a href = 'https://jsonlint.com/' target='_blank'>jsonlint.com</a>";
    document.getElementById("beats").innerHTML = e;
    console.log(e);
    return;
  }
  //console.log(JSON.stringify(data));
}

function makeBeats(obj){
  document.getElementById("beats").innerHTML = JSON.stringify(obj);
}
