document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('arkanoidCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.querySelector('.score');
    const prevGameArrow = document.querySelector('.prev-game-arrow');
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let brickRowCount = 3;
    let brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let score = 0;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballDX = 0;
    let ballDY = 0;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let bricks = [];
    let level = 1;
    let lastPaddleHit = false;
    let bonusActive = false;
    let bonusX, bonusY, bonusDY = 2;
    let gameStarted = false;

    function initializeBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = '#0095dd';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const brick = bricks[c][r];
                if (brick.status === 1) {
                    if (
                        ballX > brick.x &&
                        ballX < brick.x + brickWidth &&
                        ballY > brick.y &&
                        ballY < brick.y + brickHeight
                    ) {
                        ballDY = -ballDY;
                         brick.status = 0;
                        score++;
                        scoreElement.textContent = `Score: ${score}`;
                       lastPaddleHit = false;
                    }
                }
            }
        }
    }
   function handlePaddleCollision() {
       if (ballY + ballDY > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                 const paddleCenter = paddleX + paddleWidth / 2;
                const distance = ballX - paddleCenter;
                ballDX = (distance * 0.1);
                 ballDY = -ballDY;
                 if(lastPaddleHit) {
                     createBonus()
                      lastPaddleHit = false
                }
               else {
                   lastPaddleHit = true
               }
            } else {
                alert(`Game Over! Your score: ${score}`);
                 resetGame();
            }
      }
    }
    function isLevelComplete() {
        let allBricksBroken = true;
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                     allBricksBroken = false;
                    break;
                }
            }
            if (!allBricksBroken) {
                break;
            }
        }
       return allBricksBroken;
    }
    function nextLevel() {
        level++;
       ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballDX = 0;
       ballDY = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        if (level > 2) {
             brickColumnCount = 6;
            brickRowCount = 4;
             ballDY = -2.5;
        }
         if (level > 3) {
            brickColumnCount = 7;
            brickRowCount = 5;
            ballDY = -3;
        }
        if (level > 4) {
           alert(`You Won! Your score: ${score}`);
             level = 1;
            resetGame();
            return;
       }
       initializeBricks();
   }
   function resetGame() {
        level = 1;
         score = 0;
        scoreElement.textContent = 'Score: 0';
       ballX = canvas.width / 2;
       ballY = canvas.height - 30;
         ballDX = 0;
        ballDY = 0;
       paddleX = (canvas.width - paddleWidth) / 2;
         brickColumnCount = 5;
         brickRowCount = 3;
         initializeBricks();
         gameStarted = false;
   }
  function createBonus() {
         bonusActive = true;
        bonusX = ballX;
        bonusY = ballY;
    }
    function drawBonus() {
      if (bonusActive) {
         ctx.beginPath();
          ctx.rect(bonusX - 10, bonusY - 10, 20, 20);
           ctx.fillStyle = '#ffff00';
          ctx.fill();
           ctx.closePath();
            bonusY += bonusDY;
             if (bonusY > canvas.height) {
               bonusActive = false;
             }
             if (ballX > bonusX - 10 && ballX < bonusX + 10 && ballY > bonusY - 10 && ballY < bonusY + 10) {
               ballDX *= 1.5;
              ballDY *= 1.5;
                bonusActive = false;
            }
      }
   }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
       drawBall();
        drawPaddle();
      drawBonus();
       collisionDetection();
     if (!gameStarted) {
           ballX = paddleX + paddleWidth / 2;
        } else {
          if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
               ballDX = -ballDX;
          }
            if (ballY + ballDY < ballRadius) {
               ballDY = -ballDY;
          }
           handlePaddleCollision();
          ballX += ballDX;
         ballY += ballDY;
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
             paddleX += 5;
       } else if (leftPressed && paddleX > 0) {
           paddleX -= 5;
        }

       if (isLevelComplete()) {
           nextLevel();
       }
        requestAnimationFrame(draw);
  }
    document.addEventListener('keydown', function(e) {
        if (e.code === 'ArrowRight') {
            rightPressed = true;
        } else if (e.code === 'ArrowLeft') {
            leftPressed = true;
       } else if (e.code === 'ArrowUp' && !gameStarted) {
           ballDX = 0;
           ballDY = -2;
          gameStarted = true;
       }
    });
   document.addEventListener('keyup', function(e) {
        if (e.code === 'ArrowRight') {
          rightPressed = false;
       } else if (e.code === 'ArrowLeft') {
           leftPressed = false;
       }
    });
   prevGameArrow.addEventListener('click', function() {
        window.location.href = '#';
   });
    initializeBricks();
    draw();
});