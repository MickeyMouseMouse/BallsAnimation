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
balls.push(new Ball(90, 180, RADIUS, 2, 1, "LimeGreen"));
balls.push(new Ball(300, 150, RADIUS, -1, 2, "SteelBlue"));
balls.push(new Ball(600, 600, RADIUS, 2.5, 1, "Red"));
balls.push(new Ball(130, 630, RADIUS, -1.5, -1.5, "Yellow"));

// number of balls in the animation
var numberOfBalls;

var context = document.getElementById("field").getContext("2d");
var timer;
function start() {
	var info = document.getElementById('info');
	
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
    for (var number = 0; number < radios.length; number++)
    	if (radios[number].checked) {
    		if (number + 1 < numberOfBalls) {
    			numberOfBalls = number + 1;
    			info.value = "";
    			break;
    		}
    		else {
    			var overlay = false;
    			for (var i = 0; i < number; i++) {
    				for (var j = i + 1; j <= number; j++) {
    					if (i < numberOfBalls && j < numberOfBalls) continue;
    					if (overlayBalls(balls[i], balls[j])) {
    						overlay = true;
    						break;
    					}
    				}
    				if (overlay) break;
    			}
    			
    			if (overlay) {
    				radios[numberOfBalls - 1].click();
    				info.value = "Overlay balls. Try a few seconds later.";
    			}
    			else {
    				numberOfBalls = number + 1;
    				info.value = "";
    			}
    		}
    	}
    
    clearInterval(timer); // stop last timer
    timer = setInterval('animation();', 10); // delay = 10 milliseconds 
}

function animation() {
	for (var number = 0; number < numberOfBalls; number++) {
		eraseBall(number);

		balls[number].collisionsWithEdges(8, 902);
		balls[number].nextPosition();

		// collisions with other ball
		for (var i = 0; i < numberOfBalls; i++) {
			if (i == number) continue;
			
			if (overlayBalls(balls[number], balls[i])) {
				balls[number].previousPosition();	
				
				balls[number].deltaX *= -1;
				balls[number].deltaY *= -1;
				
				balls[number].collisionsWithEdges(8, 902);
				balls[number].nextPosition();
				
				break;
			}
		}
	    
	    drawBall(number);
	}
}

function overlayBalls(ball1, ball2) {
	// distance between centers of the balls < sum their radiuses
	return Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)) < ball1.radius + ball2.radius;
}

function eraseBall(number) {
	context.beginPath();
    context.arc(balls[number].x, balls[number].y, balls[number].radius, 0, 2 * Math.PI); // (x-center, y-center, radius, startAngle, endAngle [, counterclockwise])
	context.fillStyle = "#FFA07A";
	context.fill();
    context.strokeStyle = "#FFA07A";
    context.lineWidth = 3;
    context.stroke();
    context.closePath();	
}

function drawBall(number) {
	context.beginPath();
    context.arc(balls[number].x, balls[number].y, balls[number].radius, 0, 2 * Math.PI);
    context.fillStyle = balls[number].color;
    context.fill();
    context.strokeStyle = "Black";
    context.lineWidth = 1;
    context.stroke();
    context.closePath();	
}