document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.querySelector('.score');
     const prevGameArrow = document.querySelector('.prev-game-arrow');
    const grid = 20;
    let count = 0;
    let snake = {
        x: grid * 5,
        y: grid * 5,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    let apple = {
        x: grid * 10,
        y: grid * 10
    };
     let score = 0;
    let gameSpeed = 20; // Уменьшили скорость
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function resetGame() {
        snake.x = grid * 5;
        snake.y = grid * 5;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
         score = 0;
        scoreElement.textContent = 'Score: 0';
       apple.x = getRandomInt(0, 20) * grid;
       apple.y = getRandomInt(0, 20) * grid;
    }
    function loop() {
         requestAnimationFrame(loop);
         if (++count < gameSpeed) {
            return;
        }
        count = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) {
            snake.x = canvas.width - grid;
        } else if (snake.x >= canvas.width) {
           snake.x = 0;
       }
        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        } else if (snake.y >= canvas.height) {
           snake.y = 0;
        }
        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
       ctx.fillStyle = 'red';
       ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);
        ctx.fillStyle = 'green';
        snake.cells.forEach(function(cell, index) {
             ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
             if (cell.x === apple.x && cell.y === apple.y) {
                 snake.maxCells++;
                score += 10;
                 scoreElement.textContent = `Score: ${score}`;
                 apple.x = getRandomInt(0, 20) * grid;
               apple.y = getRandomInt(0, 20) * grid;
           }
             for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                  resetGame(); // Змейка умерла, сбрасываем игру
                  return;
                }
             }
       });
   }
  document.addEventListener('keydown', function(e) {
      if (e.which === 37 && snake.dx === 0) {
          snake.dx = -grid;
          snake.dy = 0;
      } else if (e.which === 38 && snake.dy === 0) {
         snake.dy = -grid;
         snake.dx = 0;
      } else if (e.which === 39 && snake.dx === 0) {
          snake.dx = grid;
          snake.dy = 0;
      } else if (e.which === 40 && snake.dy === 0) {
          snake.dy = grid;
          snake.dx = 0;
       }
    });
      prevGameArrow.addEventListener('click', function() {
        window.location.href = '#'; // Замените на ссылку на предыдущую игру
    });
    loop();
});