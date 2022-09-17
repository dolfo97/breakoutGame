const canvas = document.getElementById("breakout");
const ctx = canvas.getContext('2d');
const paddleHeight = 15; 
const paddleWidth = 155;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 4;
let dy = -4;
let ballRadius = 30;
let rightPressed = false;
let leftPressed = false;
let score = 0;
const scoreboard = document.querySelector('.scoreboard');


const brick = {
    row: 5,
    column: 6,
    width: 80,
    height: 25,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: 'black',
    image: 'KrappyPatty.webp'
}

let bricks = [];
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            if(bricks[r][c].status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor; 
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
}


function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.width + brick.offSetLeft ) + brick.offSetLeft,
                y: r * (brick.height + brick.offSetTop ) + brick.offSetTop + brick.marginTop,
                status: true
            }   
        }
    }
}













document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



let ball = new Image();
let background = new Image();

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



function brickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height) {
                        score++;
                        scoreboard.innerHTML = `Score: ${score}`;
                        b.status = false;
                        ball.dy =- ball.dy;
                
                }
            }
        }
    }
}



function drawBall() {
    ctx.beginPath();
    ball.src = 'KrappyPatty.webp';
    ball.width = 700;
    ball.height = 700;
    ball.radius = 30;
    ctx.drawImage(ball, 330, 600, 70, 70);
    ctx.arc(x, y, 15, 0, Math.PI*2);
    ctx.fillStyle = "#0044CC";
    ctx.fill();
    ctx.closePath();
}

function drawBackGround() {
    background.src = 'BikiniBottom.png';
    background.width = 700;
    background.height = 700;
    ctx.drawImage(background, 0, 0, 700, 700);
}

function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
        ctx.closePath();
    }

// function drawBricks() {
//     for (let c = 0; c < brickCloumnCount; c++) {
//         for (let r = 0; r < brickRowCount; r++) {
//             if (bricks[c][r].status === 1) {
//                 let brickX = c * (brickWidth + brickPadding + brickOffsetLeft);
//                 let brickY = r * (brickHeight + brickPadding + brickOffsetTop);
//                 bricks[c][r].x = brickX;
//                 bricks[c][r].y = brickY;
//                 ctx.beginPath();
//                 ctx.rect(brickX, brickY, brickWidth, brickHeight);
//                 ctx.fillStyle = 'black';
//                 ctx.fill();
//                 ctx.closePath;
//             }
//         }
//     }
// }
 




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackGround();
    drawBall();
    createBricks();
    drawBricks();
    drawPaddle();
    brickCollision();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("YOU LOSE");
            document.location.reload();
            clearInterval(interval); 
        }
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 5;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 5;
    }

    x += dx;
    y += dy;
}

let interval = setInterval(draw, 10);
