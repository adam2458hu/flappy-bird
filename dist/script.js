const screenHeight = 600;

let score;
let highScore=0;
let state = "stopped";
let t;
let z;
let pipes;
let game = document.getElementById("game");
let bird = document.getElementById("bird");
let infoBox = document.getElementById("info-box");
let scoreDiv = document.getElementById("score");
let birdBottom;
let birdRight;
let birdSpeed=0;
let xCoordinateOfPipes = [];
infoBox.innerHTML = "Try to avoid hitting the pipes.<br>Use your spacebar to jump.<br>Press SPACE to start";

window.onload = function() {
	setTimeout(()=>{
		game.classList.remove("preload");
	});
}

this.addEventListener("keydown",(event)=>{
	switch (event.key) {
		case " " : {
			if (state==="running") {
				jump();
			} else if (state==="stopped") {
				startGame();
			}
			break;
		}
	}
})

function update(){
	if (state==="running") {
		if (birdBottom>100) {
			if (birdSpeed<3) {
				console.log(birdSpeed)
				birdSpeed+=0.05;
			}
			birdBottom-=birdSpeed;
			bird.style.bottom = birdBottom+"px";

			pipes = document.getElementsByClassName("pipe");
			if ((xCoordinateOfPipes[0]+40)<0) {
				xCoordinateOfPipes.shift();
				xCoordinateOfPipes.shift();
				game.removeChild(pipes[0]);
				game.removeChild(pipes[0]);
			}

			pipes = Array.from(document.getElementsByClassName("pipe"));
			if (pipes.length>0) {
				//ütközés vizsgálata
				xCoordinateOfPipes.every((coord,index,arr)=>{
					//felső cső
					if (index%2==1 && (birdRight+60)>=arr[index] && (birdRight<=arr[index]+40) && (birdBottom+40)>=(screenHeight-(pipes[index].style.height.replace("px","")))) {
						state="died";
						return false;
					}//alsó cső
					else if (index%2==0 && (birdRight+60)>=arr[index] && (birdRight<=arr[index]+40) && (birdBottom<=pipes[index].style.height.replace("px","")))  {
						state="died";
						return false;
					}
					return true;
				})

				xCoordinateOfPipes.forEach((coord,index,arr)=>{
					if (birdRight==arr[index]+40) {
						score+=0.5;
						scoreDiv.innerHTML = Math.floor(score);
					}
				})

				xCoordinateOfPipes.forEach((coord,index,arr)=>{
					arr[index]-=1;
					pipes[index].style.left=arr[index]+"px";
				})
			}
		} else {
			endGame();
		}
	} else if (state==="died") {
		if (birdBottom>100) {
			birdBottom-=5;
			bird.style.bottom = birdBottom+"px";
		} else {
			state="stopped";
			endGame();
		}
	}
}

function jump() {
	birdBottom+=50;
	birdSpeed=0;
	bird.classList.remove("falling");
	bird.classList.add("jumping");
	setTimeout(()=>{
		bird.classList.remove("jumping");
		bird.classList.add("falling");
	});
	
}

function generatePipes() {
	let pipeDown = document.createElement("div");
	let pipeAbove = document.createElement("div");
	xCoordinateOfPipes.push(440);
	xCoordinateOfPipes.push(440);
	let heightOffset = Math.floor(Math.random()*150);
	pipeDown.style.height = 220+heightOffset+"px";
	pipeAbove.style.height = 220+(heightOffset*-1)+"px";
	pipeDown.style.left = "440px";
	pipeAbove.style.left = "440px";
	pipeDown.classList.add("pipe","down");
	pipeAbove.classList.add("pipe","above");
	game.appendChild(pipeDown);
	game.appendChild(pipeAbove);
}

function startGame() {
	score=0;
	scoreDiv.innerHTML = 0;
	infoBox.classList.remove("opened");
	birdBottom=280;
	birdRight=170;
	bird.style.bottom = birdBottom+"px";
	bird.style.right = birdRight+"px";
	bird.classList.remove("falling");
	setTimeout(()=>{
	bird.classList.add("falling");},100);
	pipes = document.getElementsByClassName("pipe");
	[...pipes].forEach(pipe=>{
		game.removeChild(pipe)
	})
	xCoordinateOfPipes = [];
	state="running";
	game.classList.add("running");
	t = setInterval(update,10);
	z = setInterval(generatePipes,2000);
}

function endGame() {
	state="stopped";
	birdBottom+=50;
	if (score>highScore) {
		highScore = score;
	}
	infoBox.style.display = "block";
	infoBox.classList.add("opened");
	infoBox.innerHTML = "You died.<br>Your high score is: "+highScore+"<br>Press SPACE to restart.";
	game.classList.remove("running");
	clearInterval(t);
	clearInterval(z);
}