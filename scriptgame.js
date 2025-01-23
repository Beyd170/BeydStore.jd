document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const scoreDisplay = document.getElementById('score');
    const nextGameArrow = document.querySelector('.next-game-arrow');
    let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    let score = 0;

    function updateBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                if (grid[row][col]) {
                    tile.classList.add(`tile-${grid[row][col]}`);
                    tile.textContent = grid[row][col];
                }
                board.appendChild(tile);
            }
        }
        scoreDisplay.textContent = score;
    }

    function addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        const nonZero = row.filter(val => val !== 0);
        const zeros = Array(4 - nonZero.length).fill(0);
        return nonZero.concat(zeros);
    }

    function combine(row) {
        for (let i = 0; i < 3; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function move(direction) {
        let moved = false;
        const tempGrid = JSON.parse(JSON.stringify(grid)); // Создаем копию для сравнения

        if (direction === 'up' || direction === 'down') {
            for (let col = 0; col < 4; col++) {
                const column = [];
                for (let row = 0; row < 4; row++) {
                    column.push(grid[row][col]);
                }
                if (direction === 'down') {
                    column.reverse();
                }
                const slided = slide(column);
                const combined = combine(slided);
                const final = slide(combined);
                if (direction === 'down') {
                    final.reverse();
                }
                for (let row = 0; row < 4; row++) {
                    if (grid[row][col] !== final[row]) {
                        moved = true;
                    }
                    grid[row][col] = final[row];
                }
            }
        } else if (direction === 'left' || direction === 'right') {
            for (let row = 0; row < 4; row++) {
                const originalRow = [...grid[row]];
                if (direction === 'right') {
                    grid[row].reverse();
                }
                const slided = slide(grid[row]);
                const combined = combine(slided);
                const final = slide(combined);
                if (direction === 'right') {
                    final.reverse();
                }
                if (JSON.stringify(originalRow) !== JSON.stringify(final)) {
                    moved = true;
                }
                grid[row] = final;
            }
        }

        if (moved) {
            // Анимация перемещения
            const tiles = board.querySelectorAll('.tile');
            tiles.forEach((tile, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;

                const newRow = grid.findIndex(r => r[col] === tempGrid[row][col]);
                const newCol = grid[row].indexOf(tempGrid[row][col]);

                const newIndex = newRow * 4 + newCol;
                if (index !== newIndex){
                  animateTile(tile, index, newIndex);
                }
            });

            addRandomTile();
            updateBoard();
        }
    }

    function animateTile(tile, oldIndex, newIndex){
      const duration = 200; // Длительность анимации в миллисекундах
      const start = performance.now();
      const oldRow = Math.floor(oldIndex / 4);
      const oldCol = oldIndex % 4;
      const newRow = Math.floor(newIndex / 4);
      const newCol = newIndex % 4;

      const startX = oldCol * 80 + 10 + (oldCol * 10);
      const startY = oldRow * 80 + 10 + (oldRow * 10);
      const endX = newCol * 80 + 10 + (newCol * 10);
      const endY = newRow * 80 + 10 + (newRow * 10);

      function animate(time) {
        const progress = Math.min((time - start) / duration, 1);
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        tile.style.transform = `translate(${x}px, ${y}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          tile.style.transform = ''; // Сброс трансформации после анимации
        }
      }

      requestAnimationFrame(animate);
    }


    document.addEventListener('keydown', function(e) {
        if (e.code === 'ArrowUp') {
            move('up');
        } else if (e.code === 'ArrowDown') {
            move('down');
        } else if (e.code === 'ArrowLeft') {
            move('left');
        } else if (e.code === 'ArrowRight') {
            move('right');
        }
    });
    nextGameArrow.addEventListener('click', function() {
        window.location.href = '#';
    });
    addRandomTile();
    addRandomTile();
    updateBoard();
});