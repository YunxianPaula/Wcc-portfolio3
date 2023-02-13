//no animation / interaction chart
//if you want to use animation or create a loading state look at the cat fact example from last week 
// use a boolean to control when your data is loaded

//data for this visualisation was copied from here as a csv (you can convert csv to JSON online):
//https://www.visualcrossing.com/weather/weather-data-services/London,UK/metric/last15days

let weather;

function setup() {
  createCanvas(500, 500);

  //no animation / interaction chart
  noLoop();
  angleMode(DEGREES); 

  fetch("./json/weather.json").then(function(response) {
    return response.json();
  }).then(function(data) {

    console.log(data);
    
    weather = data.weather;

    //using no Loop? you can just call your function once the data is loaded
    drawChart();
  
  }).catch(function(err) {
    console.log(`Something went wrong: ${err}`);
  });

}

function draw() {
  background(0);

}

function drawChart(){


  textAlign(CENTER, BOTTOM); 
  text("Temperature in "+weather[0].name,width/2,height-10);

  // Compute max and min (for normalization)
  let maxTemp = 0; 
  let minTemp = 0;
  for (let i=0; i<weather.length; i++) {
    if ( weather[i].temp > maxTemp) {
      maxTemp = weather[i].temp;
    }
    if ( weather[i].temp < minTemp) {
      minTemp = weather[i].temp;
    }
  }


  let tempStep = 5;
  maxTemp = Math.ceil(maxTemp / tempStep) * tempStep;//always round up the max temp to the next step in chart
  minTemp = Math.floor(minTemp / tempStep) * tempStep;//always round down the min temp to the next step in chart

  
  let colWidth = width/(weather.length+2); //add 2 so there is space either side of the chart
  let chartHeight = height-(colWidth*2);

  // Display temp labels
  for (let temp = minTemp; temp <= maxTemp; temp += tempStep) {
    
    let tempY =  map(temp, minTemp, maxTemp, chartHeight, colWidth); 

    fill(255); 
    textAlign(RIGHT, BOTTOM); 
    push();
    translate( colWidth, tempY);
    line(255,255,255,100);
    text(temp,-10,5);
    pop();

  }  

  // Display date labels
  for (let i=0; i<weather.length; i++) {
    let item = weather[i];
    
    let dateX = map(i, 0, weather.length, colWidth, width); //map range includes the space on either side
   
    let date = new Date(item.datetime);
    let dateString = date.toDateString().split(" ");//splits on space
    console.log(dateString);//logs out array
    dateString.pop();//discards the year because why not, you could add this to the chart title
    dateString = dateString.join(" ");// uses javascript array join functionatlity
    console.log(dateString);

    fill(255); 
    textAlign(LEFT, TOP); 
    push();
    translate( dateX, chartHeight);
    line(255,255,255,-(chartHeight-colWidth));
    rotate(45);
    text(dateString,10,0);
    pop();

  }  

  //Map line to chart
  strokeWeight(6);
  stroke(255,0,0);
  noFill(255,0,0,90);

  //this is a shape so we need two loops for the temperature
  beginShape();
  // Display temp
  for (let i=0; i<weather.length; i++) {
    let item = weather[i];
    
    let pX = map(i, 0, weather.length, colWidth, width); //map range includes the space on either side
    let pY = map(item.temp, minTemp, maxTemp, chartHeight, colWidth); //inverse mapping because our origin in p5 is in the top left

    vertex(pX, pY);
   text(item.temp,pX,pY);// to test
    
  }  
  endShape();


  //Code challenge... 
  //map the feelsLike property to the same graph (read the json file)
  //can you make the line plotting functionality more modular??
  //make a function that takes in the property to map and the color as parameters

}