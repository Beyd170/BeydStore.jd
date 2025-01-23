document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
     const prevGameArrow = document.querySelector('.prev-game-arrow');
     const rows = 10;
    const cols = 10;
     const mines = 15;
     let gameBoard = [];
    let gameActive = true;
     function createBoard() {
         gameBoard = [];
         board.innerHTML = '';
         for (let i = 0; i < rows; i++) {
           gameBoard[i] = [];
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
               cell.classList.add('cell');
               cell.dataset.row = i;
                cell.dataset.col = j;
                 cell.addEventListener('click', handleCellClick);
                board.appendChild(cell);
                gameBoard[i][j] = { isMine: false, isRevealed: false, adjacentMines: 0 };
            }
        }
        placeMines();
         calculateAdjacentMines();
    }
    function placeMines() {
        let mineCount = 0;
        while (mineCount < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (!gameBoard[row][col].isMine) {
                 gameBoard[row][col].isMine = true;
                mineCount++;
            }
        }
    }
    function calculateAdjacentMines() {
         for (let i = 0; i < rows; i++) {
           for (let j = 0; j < cols; j++) {
                if (!gameBoard[i][j].isMine) {
                    let count = 0;
                    for (let x = -1; x <= 1; x++) {
                       for (let y = -1; y <= 1; y++) {
                            const newRow = i + x;
                           const newCol = j + y;
                            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && gameBoard[newRow][newCol].isMine) {
                                count++;
                            }
                       }
                   }
                     gameBoard[i][j].adjacentMines = count;
                }
           }
       }
   }
   function handleCellClick(event) {
        if (!gameActive) return;
         const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (gameBoard[row][col].isRevealed) {
           return;
        }
         if (gameBoard[row][col].isMine) {
           revealMines();
          cell.classList.add('mine');
            gameActive = false;
            message.textContent = 'Game Over!';
        } else {
             revealCell(row, col);
         if (checkWin()) {
                gameActive = false;
                 message.textContent = 'You Won!';
            }
        }
    }
   function revealCell(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || gameBoard[row][col].isRevealed) {
            return;
       }
      const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        gameBoard[row][col].isRevealed = true;
         cell.classList.add('revealed');
        if (gameBoard[row][col].adjacentMines > 0) {
           cell.textContent = gameBoard[row][col].adjacentMines;
       } else {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const newRow = row + x;
                    const newCol = col + y;
                     revealCell(newRow, newCol);
                }
            }
       }
   }
   function revealMines() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                 if (gameBoard[i][j].isMine) {
                   const cell = board.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                      cell.classList.add('mine')
                 }
           }
        }
    }

  function checkWin() {
        let unrevealedCount = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!gameBoard[i][j].isRevealed && !gameBoard[i][j].isMine) {
                    unrevealedCount++;
                }
            }
       }
         return unrevealedCount === 0;
  }
     board.addEventListener('click', function() {
        if(!gameActive)
        {
            createBoard();
            gameActive = true;
             message.textContent = '';
        }
    });
      prevGameArrow.addEventListener('click', function() {
         window.location.href = '#';
     });
  createBoard();
});