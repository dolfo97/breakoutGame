const canvas = document.getElementById("breakout");
const ctx = canvas.getContext('2d');
const paddleHeight = 15; 
const paddleWidth = 155;
const paddleMarginBottom = 15;
let paddleZ = (canvas.width - paddleWidth) / 2;
let x = canvas.width/2;
let y = canvas.height-30;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let background = new Image();
const scoreboard = document.querySelector('.scoreboard');
const ballRadius = 15;


const sounds = {
    youWin: new Audio('youWin.mp3'),
    bounce: new Audio('bounce.mp3'),
    breakBreak: new Audio('pop.mp3'),
    sfx: new Audio('space.mp3'),
}

const paddle = {
    x: canvas.width/2 - paddleWidth/2,
    y: canvas.height - paddleHeight - paddleMarginBottom,
    width: paddleWidth,
    height: paddleHeight,
    dx: 4
}
ctx.lineWidth = 3;

function drawPaddle() {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


function movePaddle() {
    if(rightPressed && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    } else if(leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}


const ball = {
    x: canvas.width/2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
}


function drawBackGround() {
    background.src = 'rocket.png';
    background.width = 700;
    background.height = 700;
    ctx.drawImage(background, 0, 0, 700, 700);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}


function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}


 function resetball() {
    ball.x = canvas.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3; 
 }


 const brick = {
    row: 5,
    column: 6,
    width: 80,
    height: 25,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: 'gold',
}

let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.width + brick.offSetLeft ) + brick.offSetLeft,
                y: r * (brick.height + brick.offSetTop ) + brick.offSetTop + brick.marginTop,
                status: true,
            }   
        }
    }
}

createBricks();

function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if(b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor; 
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

function brickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height) {
                        ball.dy = -ball.dy;
                        b.status = false;
                        sounds.breakBreak.play();
                        scoreboard.innerHTML = `Score: ${score}`;
                        score++;
                        ball.fillStyle = '#' + Math.floor(Math.random()*16777214);
                        if (score === brick.row * brick.column) {
                            sounds.sfx.pause();
                            sounds.youWin.play();
                            
                            alert('You Win!!');
                            document.location.reload();
                            clearInterval(interval);
                        }
                }
            }
        }
    }
}









function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBackGround();
    drawBall();
    drawPaddle();
    drawBricks();
    movePaddle();
    moveBall();
    sounds.sfx.play();
    brickCollision();
    //paddleCollision();

    if(x + ball.dx > canvas.width-ballRadius || x + ball.dx < ballRadius) {
        ball.dx = -ball.dx;
        sounds.bounce.play();
    }
    if(y + ball.dy < ballRadius) {
        ball.dy = -ball.dy;
        sounds.bounce.play();
    }
    else if(y + ball.dy > canvas.height-ballRadius) {
        if(x > paddle.x && x < paddle.x + paddleWidth) {
            ball.dy = -ball.dy;
            sounds.bounce.play();
        } else {
            sounds.sfx.pause();
            alert('Game Over You lose!');
            document.location.reload();
            clearInterval(interval);
        }
    }

    x += ball.dx;
    y += ball.dy;
}

let interval = setInterval(draw,10);
