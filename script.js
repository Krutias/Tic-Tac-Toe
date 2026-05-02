// --- 1. GAME MODULE (Logic & State) ---
const Game = (() => {
    let board = Array(9).fill(null);
    let currentPlayer = "X";
    let isGameActive = true;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const checkWinner = (currentBoard) => {
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], pattern };
            }
        }
        return currentBoard.includes(null) ? null : { winner: "Draw" };
    };

    const makeMove = (index) => {
        if (!board[index] && isGameActive) {
            board[index] = currentPlayer;
            return true;
        }
        return false;
    };

    const reset = () => {
        board.fill(null);
        currentPlayer = "X";
        isGameActive = true;
    };

    return { 
        getBoard: () => board, 
        getCurrentPlayer: () => currentPlayer,
        switchPlayer: () => currentPlayer = currentPlayer === "X" ? "O" : "X",
        checkWinner, 
        makeMove, 
        reset,
        setGameActive: (status) => isGameActive = status
    };
})();

// --- 2. AI MODULE (Smart Logic) ---
const Bot = (() => {
    const getBestMove = (board) => {
        // 1. Try to win, 2. Block player, 3. Center, 4. Corners
        const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        
        // Priority logic
        for (let move of available) {
            let copy = [...board]; copy[move] = "O";
            if (Game.checkWinner(copy)?.winner === "O") return move;
        }
        for (let move of available) {
            let copy = [...board]; copy[move] = "X";
            if (Game.checkWinner(copy)?.winner === "X") return move;
        }
        if (available.includes(4)) return 4;
        return available[Math.floor(Math.random() * available.length)];
    };
    return { getBestMove };
})();

// --- 3. UI & EVENTS MODULE ---
const UI = (() => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');
    let gameMode = "two"; // default

    const updateBoard = () => {
        Game.getBoard().forEach((mark, i) => {
            cells[i].textContent = mark;
            cells[i].setAttribute('data-mark', mark || "");
        });
    };

    const handleResult = (result) => {
        Game.setGameActive(false);
        if (result.winner === "Draw") {
            statusText.textContent = "It's a Tie! 🤝";
        } else {
            statusText.textContent = `${result.winner} Wins! 🎉`;
        }
    };

    const processTurn = (index) => {
        if (Game.makeMove(index)) {
            updateBoard();
            const result = Game.checkWinner(Game.getBoard());
            
            if (result) {
                handleResult(result);
            } else {
                Game.switchPlayer();
                statusText.textContent = `Turn: ${Game.getCurrentPlayer()}`;
                
                // Trigger Bot if Single Player
                if (gameMode === "single" && Game.getCurrentPlayer() === "O") {
                    setTimeout(() => processTurn(Bot.getBestMove(Game.getBoard())), 600);
                }
            }
        }
    };

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', () => processTurn(cell.dataset.index)));

    document.getElementById('singlePlayerBtn').addEventListener('click', () => {
        gameMode = "single";
        document.getElementById('name-inputs').classList.remove('hidden');
        document.getElementById('p2-name').value = "SmartBot";
        document.getElementById('p2-name').disabled = true;
    });

    document.getElementById('twoPlayerBtn').addEventListener('click', () => {
        gameMode = "two";
        document.getElementById('name-inputs').classList.remove('hidden');
        document.getElementById('p2-name').disabled = false;
    });

    document.getElementById('startGameBtn').addEventListener('click', () => {
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('display-p1-name').textContent = document.getElementById('p1-name').value || "Player X";
        document.getElementById('display-p2-name').textContent = document.getElementById('p2-name').value || "Player O";
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        Game.reset();
        updateBoard();
        statusText.textContent = "Turn: X";
    });

    document.getElementById('resetBtn').addEventListener('click', () => location.reload());

    return { updateBoard };
})();