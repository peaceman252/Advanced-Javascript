console.log('Client-side code running');

//set highscore 
let highScore = 0;

//highscore before user changes it
let highScoreStart;

//array for normal balloons
let balloons = [];

//array for bouncy balloons
let bounceBalloons = [];

//array for extra life balloons
let lifeBalloons = [];

//array for death balloons
let deathBalloons = [];

//max number of balloons
const numBalloons = 1000;

//variables for balloons arrays
let i = 0;
let j = 0;
let k = 0;
let l = 0;

//variables for images
let life;
let death;

//for extra life chance
let count = 1;

//user score variable
let score = 0;

//user's lives
let lives = 5;

//variable so user can only submit score once
let scoreSubmitted;

//shows lives and score
document.getElementById("lives").innerHTML =  'Lives left: ' + lives;
document.getElementById("score").innerHTML =  'Score: ' + score;

function setup() {

  //creates canvas
  createCanvas(640, 480);

  //set to false
  scoreSubmitted = false;

  //sets images
  life = loadImage("images/life.png");
  death = loadImage("images/death.jpg");

  //for loops for each balloon type
  for(let i = 0; i < numBalloons; i++) {
    balloons[i] = new Balloon(random(25,width), 480, random(20,50),'#'+(Math.random()*0xFFFFFF<<0).toString(16));
  }
  for(let j = 0; j < numBalloons; j++) {
    bounceBalloons[j] = new BounceBalloon(random(25,width), 480, random(20,50),'#'+(Math.random()*0xFFFFFF<<0).toString(16));
  }
  for(let k = 0; k < numBalloons; k++) {
    lifeBalloons[k] = new LifeBalloon(random(25,width), 480, random(20,50),'#'+(Math.random()*0xFFFFFF<<0).toString(16));
  }
  for(let l = 0; l < numBalloons; l++) {
    deathBalloons[l] = new DeathBalloon(random(25,width), 480, random(20,50),'#ffffff');
  }

  //highscore setup
  fetch('/highscore', {method: 'GET'})
  .then(function(response) {
    if(response.ok) return response.json();
      throw new Error('Request failed.');
  })
  .then(function(data) {
    //if there is a highscore in the database
    if(data) {
      //Display highscore
      highScore = data.score;
      highScoreStart = data.score;
      document.getElementById("highscore").innerHTML =  'Highscore: ' + highScore;
    }
    //else highscore starts at zero
    else {
      highScore = 0;
      document.getElementById("highscore").innerHTML =  'Highscore: ' + highScore;
    }
  })
  .catch(function(error) {
    console.log(error);
  });

  //leaderboard setup
  fetch('/leaderboard', {method: 'GET'})
  .then(function(response) {
    if(response.ok) return response.json();
      throw new Error('Request failed.');
  })
  .then(function(data) {
    //if there is a highscore in the database
    if(data) {
      let reverseData = data;//.reverse();
      let header = document.createElement("H1");
      let heading = document.createTextNode("Leaderboard");
        header.appendChild(heading);
        document.body.appendChild(header);
      for (let z = 0; z < reverseData.length; z++){

        let para = document.createElement("P");
        let text = document.createTextNode(`${z+1}. ${reverseData[z].name} : ${reverseData[z].score}`);
        para.appendChild(text);
        document.body.appendChild(para);
      }
    }
  })
  .catch(function(error) {
    console.log(error);
  });
}

//Balloon class
function Balloon(x = 50, y = 50, r = 100, col = '#f00') {
  this.x = x;
  this.y = y;
  this.r = r;
  this.col = col;
  this.vy = random(-1,-5);
}

Balloon.prototype.move = function() {
  this.y += this.vy;
  if (this.y-this.r/2<0 && lives>=1){
    if (i<numBalloons){
      balloons[i].draw();
      i++;
      lives--;
      document.getElementById("lives").innerHTML =  'Lives left: ' + lives;
    }
  }
};

Balloon.prototype.draw = function() {
  fill(this.col);
  ellipse(this.x,this.y,this.r);
};

//Bounce Balloon class
function BounceBalloon(x = 50, y = 50, r = 100, col = '#f00',vx =random(-5,-1), vy = random(-5,-1)){
  Balloon.call(this, x, y, r, col);
  this.vx = vx;
  this.vy = vy;
}

BounceBalloon.prototype = Object.create(Balloon.prototype);
BounceBalloon.prototype.constructor = Balloon;
BounceBalloon.prototype.move = function(){
  if (this.x+this.r/2>640){
      this.vx *= -1;
  }
  else if (this.x-this.r/2<0){
    this.vx *= -1;
  }
  this.x += this.vx;
  this.y += this.vy;
  if (this.y-this.r/2<0 && lives>=1){
    if (j<numBalloons){
      bounceBalloons[j].draw();
      j++;
      lives--;
      document.getElementById("lives").innerHTML =  'Lives left: ' + lives;
    }
  }
};

//Life balloon class
function LifeBalloon(x = 50, y = 50, r = 100, col = '#f00'){
  Balloon.call(this, x, y, r, col);
  this.vx =random(-5,-1)
  this.vy = random(-10,-20);
}

LifeBalloon.prototype = Object.create(Balloon.prototype);
LifeBalloon.prototype.constructor = Balloon;
LifeBalloon.prototype.move = function(){
  if (this.x+this.r/2>640){
    this.vx *= -1;
  }
  else if (this.x-this.r/2<0){
    this.vx *= -1;
  }
  this.x += this.vx;
  this.y += this.vy;
  if (this.y-this.r/2<0 && lives>=1){
    if (k<numBalloons){
      if (count%10==0){
        count++;
        lifeBalloons[k].draw();
        k++;
      }
    }
  }
};
LifeBalloon.prototype.draw = function(){
  image(life, this.x, this.y, this.r, this.r);
};

//Death balloon class
function DeathBalloon(x = 50, y = 50, r = 100, col = '#f00'){
  Balloon.call(this, x, y, r, col);
  this.vx =random(-5,-1)
  this.vy = random(-1,-2);
}

DeathBalloon.prototype = Object.create(Balloon.prototype);
DeathBalloon.prototype.constructor = Balloon;
DeathBalloon.prototype.move = function(){
  if (this.x+this.r/2>640){
    this.vx *= -1;
  }
  else if (this.x-this.r/2<0){
    this.vx *= -1;
  }
  this.x += this.vx;
  this.y += this.vy;
  if (this.y-this.r/2<0 && lives>=1){
    if (l<numBalloons){
      deathBalloons[l].draw();
      l++;
    }
  }
};
DeathBalloon.prototype.draw = function(){
  image(death, this.x, this.y, this.r, this.r);
};


//Draw function
function draw() {
  background(0);
  balloons[i].move();
  balloons[i].draw();
  bounceBalloons[j].move();
  bounceBalloons[j].draw();
  lifeBalloons[k].move();
  lifeBalloons[k].draw();
  deathBalloons[l].move();
  deathBalloons[l].draw();
}

//Mouse pressed function
function mousePressed(){
  //clicking normal balloon
  //if statement for balloon area
	if (mouseX>(balloons[i].x - balloons[i].r) && mouseX<(balloons[i].x + balloons[i].r)){
    if (mouseY<(balloons[i].y + balloons[i].r) && mouseY>(balloons[i].y - balloons[i].r)){
      //increase i, score and count
      i++;
      score++;
      count++;
      //Update displayed score
      document.getElementById("score").innerHTML =  'Score: ' + score;
      //if the score is greater than the highscore update the display
      if (score>highScore){
        highScore = score;
        document.getElementById("highscore").innerHTML =  'Highscore: ' + highScore;
      }
		  fetch('/canvasclicked', {method: 'POST'})
    	.then(function(response) {
    		if(response.ok) {
        		return;
      	}
      	throw new Error('Request failed.');
    	})
    	.catch(function(error) {
      		console.log(error);
    	});
	 }
  }

  //clicking bounce balloon
  if (mouseX>(bounceBalloons[j].x - bounceBalloons[j].r) && mouseX<(bounceBalloons[j].x + bounceBalloons[j].r)){
    if (mouseY<(bounceBalloons[j].y + bounceBalloons[j].r) && mouseY>(bounceBalloons[j].y - bounceBalloons[j].r)){
      j++;
      score++;
      count++;
      document.getElementById("score").innerHTML =  'Score: ' + score;
      if (score>highScore){
        highScore = score;
        document.getElementById("highscore").innerHTML =  'Highscore: ' + highScore;
      }
      fetch('/canvasclicked', {method: 'POST'})
      .then(function(response) {
        if(response.ok) {
          return;
        }
        throw new Error('Request failed.');
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

  //clicking life balloon
  if (mouseX>(lifeBalloons[k].x - lifeBalloons[k].r) && mouseX<(lifeBalloons[k].x + lifeBalloons[k].r)){
    if (mouseY<(lifeBalloons[k].y + lifeBalloons[k].r) && mouseY>(lifeBalloons[k].y - lifeBalloons[k].r)){
      k++;
      //Add extra life and update display
      lives++;
      document.getElementById("lives").innerHTML =  'Lives left: ' + lives;
      fetch('/canvasclicked', {method: 'POST'})
      .then(function(response) {
        if(response.ok) {
          return;
        }
        throw new Error('Request failed.');
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

  //clicking death balloon
  if (mouseX>(deathBalloons[l].x - deathBalloons[l].r) && mouseX<(deathBalloons[l].x + deathBalloons[l].r)){
    if (mouseY<(deathBalloons[l].y + deathBalloons[l].r) && mouseY>(deathBalloons[l].y - deathBalloons[l].r)){
      //Remove lives and update display
      lives = 0;
      l++
      document.getElementById("lives").innerHTML =  'Lives left: ' + lives;
      fetch('/canvasclicked', {method: 'POST'})
      .then(function(response) {
        if(response.ok) {
          return;
        }
        throw new Error('Request failed.');
      })
      .catch(function(error) {
          console.log(error);
      });
    }
  }
}

//button
const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  //user can only submit score if they have no lives
  if (lives == 0){
    //User can only submit score once
    if (scoreSubmitted == false){
      let name = document.getElementById('name').value;
      scoreSubmitted = true;
      //If user achieves new highscore
      if (highScore>highScoreStart){
        console.log(name);
        console.log(score);
        console.log(JSON.stringify({name:name, score:score}));
        fetch('/highscore', {
          method: 'PUT',
          body: JSON.stringify({name:name, score:score}),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
          if(response.ok) {
            console.log('score was sent to the highscore DB.');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
        fetch('/leaderboard', {
          method: 'PUT',
          body: JSON.stringify({name:name, score:score}),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
          if(response.ok) {
            console.log('score was sent to the leaderboard DB.');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
      }
        else{
        fetch('/leaderboard', {
          method: 'PUT',
          body: JSON.stringify({name:name, score:score}),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
          if(response.ok) {
            console.log('score was sent to the leaderboard DB.');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
      }
      
    }
  }
  else{
    console.log("lives not depleted");
  }
});