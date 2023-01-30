// create our creature class
class Creature {
  // this constructor is called when we define new Creature(...)
  constructor(_x, _y) {
    this.location = new createVector(_x, _y);  // Location of shape
    this.velocity = new createVector(random(-2,2),random(-2,2));  // Velocity of shape
    this.friction = new createVector(0, 0); 
    this.desired = new createVector(0, 0); 
    this.diameter = random(10,90);
    this.speedLimit = random(1,this.diameter/10);
    this.full = 0;
  }

  moveToFood(x, y){

    if(this.full>0){
      return false;
    }

    this.desired.x = x;
    this.desired.y = y;
    let direction = p5.Vector.sub(this.desired, this.location);

    if (direction.mag() < this.diameter/2){
      this.full = 1000;
      return true;
    } 
  
    if(direction.mag() < 200){
      direction.normalize();
      this.velocity.add(direction);
    }

    return false;
  } 

 
  update() {

    if(this.full<20){
      this.friction.x = this.velocity.x * -1;
      this.friction.y = this.velocity.y * -1;
      this.friction.normalize();
      this.friction.mult(0.01);
      this.velocity.add(this.friction);
    }

    this.velocity.limit(this.speedLimit);
    // Add velocity to the location.
    this.location.add(this.velocity);

  
    // Bounce off edges
    if (this.location.x > width){
      this.location.x = width;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.x < 0) {
      this.location.x = 0;
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y < 0) {
      this.location.y = 0;
      this.velocity.y = this.velocity.y * -1;
    }
    if (this.location.y > height) {
      this.location.y = height;
      this.velocity.y = this.velocity.y * -1; 
    }

    if(this.full > 0){
      this.full--;
    }
  
    // Display circle at location vector
    noStroke();
    fill(map(this.full,0,100,0,255),0,255);
    circle(this.location.x,this.location.y,this.diameter);
  }
}

//Main sketch below
// an array to store the creatures
let creatures = [];
let food1 = [];
let food2 =[];

function setup() {
  // createCanvas(400, 400);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  addGUI();

  for(let i = 0; i < 100; i++){
    let c = new Creature(random(width), random(height));
    creatures.push(c);
  }
}

function draw() {
  background(200);
  
  // loop through all the creatrure and animate them each frame by accessing their update function
  for (let c of creatures) {
    c.update();
    if(food1.length > 0){

      if(c.moveToFood(food1[food1.length-1].x,food1[food1.length-1].y)){
        food1.pop();
      }
    } 
  }

  if(food2.length > 0){
    for(let i = 0; i < 0.01; i++){
      let c = new Creature(random(width), random(height));
      creatures.push(c);
    }

    // if(c.moveToFood(food2[food2.length+1].x,food2[food2.length+1].y)){
    //   food2.pop();
    // }
  } 
}
  updateFood1();
  updateFood2();

  if(button1.hasClass("inactive") && food1.length == 0){
    button1.html("Catch");
    button1.removeClass("inactive");
  }

  if(button2.hasClass("inactive") && food2.length == 0){
    button2.html("Release");
    button2.removeClass("inactive");
  }


function updateFood1(){
  for(let i = food1.length-1; i >= 0 ; i--){
    fill(100);
    circle(food1[i].x,food1[i].y,food1[i].d);
    food1[i].y += 1;
    if(food1[i].y > height){
      food1.splice(i,2);//remove one from array at index i
    }
  }
}

function updateFood2(){
  for(let i = food2.length+1; i >= 0 ; i++){
    fill(0,0,255);
    circle(food2[i].x,food2[i].y,food2[i].d);
    // food2[i].y -= 1;
    // if(food2[i].y > height){
    //   food2.splice(i, -1);//remove one from array at index i
    // }
  }
}

function addGUI()
{

  //add a button
  button1 = createButton("Catch");

 button2 = createButton("Release");

  button1.addClass("button1");

  button2.addClass("button2");

  //Add the play button to the parent gui HTML element
  button1.parent("gui-container");
 button2.parent("gui-container");
  
  //Adding a mouse pressed event listener to the button 
  button1.mousePressed(handleButtonPress1); 

  button2.mousePressed(handleButtonPress2); 

}

function handleButtonPress1()
{
    if(food1.length == 0 && !button1.hasClass("inactive")){
      food1.push({
          x:random(width),
          y:random(height/2),
          d:random(5,100)
        });
    }

    if(food1.length > 20){
      button1.html("Catching");
      button1.addClass("inactive");
    }

}


function handleButtonPress2()
{

    if(food2.length == 0 && !button2.hasClass("inactive")){
      food2.push({
          x:random(width),
          y:random(height/2),
          d:random(5,100)
        });
    }

    if(food2.length > 0){
      button2.html("Releasing");
      button2.addClass("inactive");
    }
  
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}