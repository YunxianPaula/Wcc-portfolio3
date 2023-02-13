
let loadbar = 0;
let failedLoads = [];
let jsonDocuments = [
  "./json/nightmare.json",
  // "./json/Dickens.json",
  // "./NotARealJsonFile.json"
  // "./json/Short1.json"
];


let canvas;
let files = [];
let displayText = "";

//data structure
let phrases = []; // for cut up generator


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  canvas.mousePressed(handleCanvasPressed);

  loadFile(0);
}

function draw() {
  background(0);

 
  if(loadbar < jsonDocuments.length){

    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);

  }else{

    let fontSize = map(displayText.length,0,200,30,20,true);
    textSize(fontSize);
   
    textWrap(WORD);
    textAlign(CENTER);
  
    fill(255, 255,255, 95);
   
    text(displayText,windowWidth/2, windowHeight/2, 600);

  }

}

function handleCanvasPressed(){
  //original text
  displayText = "a nightmare, also known as a bad dream ";

  //generate cut up phrases
  displayText = generateCutUpPhrases(5);


  //show text in HTML
  showText(displayText);

}

function buildModel(){
  console.log("run buildModel()");
// create a store phese(1picture)

//text split and add “，”（2 picture）
//clean the text=punctuation，去掉所有的标点符号（3 ）
//lowercase（4）
//trimmed（5）左对齐
//store（6）




  //phrases
  for(let i = 0; i < files.length; i++){

    let textPhrases = files[i].text.split(/(?=[,.])/);
 
    for(let j = 0; j < textPhrases.length; j++){
      let phrase = textPhrases[j];
      let punctuationless = phrase.replace(/[^a-zA-Z- ']/g,"");//everything except letters, whitespace & '
      let lowerCase = punctuationless.toLowerCase()
      let trimmed = lowerCase.trim();
  
      phrases.push(trimmed);
    }

  }

}

//Text Generator Functions ----------------------------------

function generateCutUpPhrases(numPhrases){
  let output = "";//输出内容展示在灰色框里

  //implement your code to generate the output
  for(let i = 0; i < numPhrases; i++){

    let randomIndex = int(random(0,phrases.length));
    let randomPhrase = phrases[randomIndex];

    output += randomPhrase + ". ";//给含义的句子加标点符号

  }


  return output;
}


//Generic Helper functions ----------------------------------

function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {
    
      console.log(data);
      files.push(data);

      showText("Training text number " + (index+1));
      showText(data.text);
  
      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}

//add text as html element
function showText(text){

  let textContainer = select("#text-container");
//  textContainer.elt.innerHTML = "";//add this in if you want to replace the text each time

  let p = createP(text);
  p.parent("text-container");

}

  