class Ball {
	constructor(x, y, radius, deltaX, deltaY, color) {
		this.x = x; // center
		this.y = y; // center
		this.radius = radius;
		this.deltaX = deltaX; // shift
		this.deltaY = deltaY; // shift
		this.color = color;
	}
	
	collisionsWithEdges(edge1, edge2) {
		if (this.x + this.radius + this.deltaX >= edge2 || this.x - this.radius + this.deltaX <= edge1)
			this.deltaX *= -1;
		
		if (this.y + this.radius + this.deltaY >= edge2 || this.y - this.radius + this.deltaY <= edge1)
			this.deltaY *= -1;
	}
	
	nextPosition() {
		this.x += this.deltaX;
		this.y += this.deltaY;
	}
	
	previousPosition() {
		this.x -= this.deltaX;
		this.y -= this.deltaY;		
	}
}

// all balls has the same radius
var RADIUS = 45;

var balls = [];
balls.push(new Ball(0, 0, RADIUS, 2, 1, "LimeGreen"));
balls.push(new Ball(0, 0, RADIUS, -1, 2, "SteelBlue"));
balls.push(new Ball(0, 0, RADIUS, 2.5, -1, "Red"));
balls.push(new Ball(0, 0, RADIUS, -1.5, -1.5, "Yellow"));

// number of balls in the animation
var numberOfBalls = 0;

var context = document.getElementById("field").getContext("2d");
var timer;
function start() {
	// draw border
	context.beginPath();
	context.strokeStyle = "Black";
	context.lineWidth = 3;
	context.strokeRect(5, 5, 900, 900);

	// draw background
	context.fillStyle = "#FFA07A";
	context.fillRect(7, 7, 896, 896);
	context.closePath();

	var radios = document.getElementsByName('numberOfBalls');
	for (var num = 0; num < radios.length; num++) {
		if (radios[num].checked) {
			var tmp = numberOfBalls;
			numberOfBalls = num + 1;
			if (num + 1 >  tmp) {
				// add balls
				for (var i =  tmp; i <= num; i++)
					do {
						balls[i].x =  getRandomInt(150, 500); 
						balls[i].y = getRandomInt(150, 500); 
					} while (overlayBalls(i) != -1);
			}
		}
	}

	clearInterval(timer); // stop last timer
	timer = setInterval('animation();', 10); // delay = 10 milliseconds 
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animation() {
	for (var num = 0; num < numberOfBalls; num++) {
		eraseBall(num);

		balls[num].collisionsWithEdges(8, 902);
		balls[num].nextPosition();

		if (overlayBalls(num) != -1) {
				balls[num].previousPosition();	
		
				balls[num].deltaX *= -1;
				balls[num].deltaY *= -1;
				
				balls[num].collisionsWithEdges(8, 902);
				balls[num].nextPosition();
		}
    
	    drawBall(num);
	}
}

function overlayBalls(num) {
	for (var i = 0; i < numberOfBalls; i++) {
		if (i == num) continue;

		// distance between centers of the balls < sum their radiuses	
		if (Math.sqrt(Math.pow(balls[num].x - balls[i].x, 2) + Math.pow(balls[num].y - balls[i].y, 2)) < balls[num].radius + balls[i].radius)
			return i;
	}
	
	return -1;
}

function eraseBall(num) {
	context.beginPath();
	context.arc(balls[num].x, balls[num].y, balls[num].radius, 0, 2 * Math.PI); // (x-center, y-center, radius, startAngle, endAngle [, counterclockwise])
	context.fillStyle = "#FFA07A";
	context.fill();
	context.strokeStyle = "#FFA07A";
	context.lineWidth = 3;
	context.stroke();
	context.closePath();	
}

function drawBall(num) {
	context.beginPath();
	context.arc(balls[num].x, balls[num].y, balls[num].radius, 0, 2 * Math.PI);
	context.fillStyle = balls[num].color;
	context.fill();
	context.strokeStyle = "Black";
	context.lineWidth = 1;
	context.stroke();
	context.closePath();	
}