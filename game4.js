document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const choice = document.getElementById('choice');
    const playerButton = document.getElementById('player-button');
    const botButton = document.getElementById('bot-button');
    const prevGameArrow = document.querySelector('.prev-game-arrow');
    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let gameMode = null;
    let botThinking = false;

    function handleCellClick(event) {
        if (!gameActive || botThinking) return;
        const cell = event.target;
        const index = cell.dataset.index;
        if (gameBoard[index] !== '') {
            return;
        }
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            showResultOnBoard(`Player ${currentPlayer} wins!`);
            return;
        }
         if (checkTie()) {
             message.textContent = 'It\'s a tie!';
             gameActive = false;
            showResultOnBoard('It\'s a tie!');
             return;
         }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
         message.textContent = `Player ${currentPlayer}'s turn`;
         if (gameMode === 'bot' && currentPlayer === 'O') {
           botTurn();
       }
    }
    function botTurn() {
       if (!gameActive || botThinking) return;
         botThinking = true;
         setTimeout(() => {
             const bestMove = getBestMove();
             gameBoard[bestMove] = 'O';
             cells[bestMove].textContent = 'O';
            if (checkWinner()) {
                message.textContent = 'Bot wins!';
                gameActive = false;
                showResultOnBoard('Bot wins!');
                 botThinking = false;
                 return;
            }
            if (checkTie()) {
               message.textContent = 'It\'s a tie!';
               gameActive = false;
                showResultOnBoard('It\'s a tie!');
                botThinking = false;
                return;
            }
             currentPlayer = 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
            botThinking = false;
         }, 1000);
    }
    function getBestMove() {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
           if (gameBoard[i] === '') {
                availableMoves.push(i);
            }
        }
      for (const move of availableMoves) {
            const tempBoard = [...gameBoard];
            tempBoard[move] = 'O';
            if (checkWinnerMinimax(tempBoard, 'O')) {
                return move;
           }
        }
         for (const move of availableMoves) {
           const tempBoard = [...gameBoard];
             tempBoard[move] = 'X';
             if (checkWinnerMinimax(tempBoard, 'X')) {
                 return move;
             }
        }
       if(availableMoves.length > 0) {
         const randomIndex = Math.floor(Math.random() * availableMoves.length);
            return availableMoves[randomIndex];
        }
    }
   function minimax(board, depth, isMaximizing) {
       if (checkWinnerMinimax(board, 'O')) {
            return 1;
        }
        if (checkWinnerMinimax(board, 'X')) {
           return -1;
       }
        if (checkTieMinimax(board)) {
           return 0;
       }
       if (isMaximizing) {
           let bestScore = -Infinity;
          for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                   let score = minimax(board, depth + 1, false);
                   board[i] = '';
                   bestScore = Math.max(score, bestScore);
                }
          }
            return bestScore;
       } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
               if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                     board[i] = '';
                   bestScore = Math.min(score, bestScore);
                }
           }
            return bestScore;
        }
   }
    function checkWinnerMinimax(board, player) {
         const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
           [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
       ];
        for (const combination of winningCombinations) {
           const [a, b, c] = combination;
           if (board[a] !== '' && board[a] === board[b] && board[a] === board[c] && board[a] === player) {
                return true;
            }
        }
         return false;
    }
    function checkTieMinimax(board) {
       return board.every(cell => cell !== '');
    }
    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
       ];
        for (const combination of winningCombinations) {
             const [a, b, c] = combination;
            if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return true;
            }
        }
       return false;
    }
    function checkTie() {
        return gameBoard.every(cell => cell !== '');
    }
    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
         gameActive = true;
       message.textContent = 'Player X\'s turn';
        cells.forEach(cell => cell.textContent = '');
        hideResultOnBoard();
   }
    function startGame(mode) {
        gameMode = mode;
       choice.style.display = 'none';
        board.style.display = 'grid';
        resetGame();
        gameActive = true;
        if (gameMode === 'bot' && currentPlayer === 'O') {
           botTurn();
        }
    }
   function showResultOnBoard(result) {
        message.textContent = result;
   }
   function hideResultOnBoard() {
       message.textContent = 'Player X\'s turn';
   }
    playerButton.addEventListener('click', () => startGame('player'));
    botButton.addEventListener('click', () => startGame('bot'));
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
   board.addEventListener('click', function() {
        if (!gameActive) {
            resetGame()
       }
   });
    prevGameArrow.addEventListener('click', function() {
        window.location.href = '#';
    });
});