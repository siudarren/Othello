export function getNewBoard(board, row, col, color) {
    if (board[row][col] !== "empty") {
        console.error("Invalid move");
        return null;
    }
    let newBoard = board.map((row) => [...row]);
    newBoard[row][col] = color;
    let flipped = flipDisksInAllDirections(newBoard, row, col, color);

    if (flipped) {
        return newBoard;
    } else {
        return null;
    }
}

function flipDisksInAllDirections(board, row, col, color) {
    const directions = [
        {dr: -1, dc: 0}, // Up
        {dr: -1, dc: 1}, // Up-Right
        {dr: 0, dc: 1}, // Right
        {dr: 1, dc: 1}, // Down-Right
        {dr: 1, dc: 0}, // Down
        {dr: 1, dc: -1}, // Down-Left
        {dr: 0, dc: -1}, // Left
        {dr: -1, dc: -1}, // Up-Left
    ];

    let flipped = false;

    for (const {dr, dc} of directions) {
        if (flipInDirection(board, row, col, dr, dc, color)) {
            flipped = true;
        }
    }
    return flipped;
}

function flipInDirection(board, row, col, dr, dc, color) {
    const n = board.length;
    let r = row + dr;
    let c = col + dc;
    let disksToFlip = [];

    let opColor = color === "black" ? "white" : "black";

    // Collect disks to flip
    while (r >= 0 && r < n && c >= 0 && c < n && board[r][c] === opColor) {
        disksToFlip.push({r, c});
        r += dr;
        c += dc;
    }

    let flipped = false;

    // If the sequence ends with the player's own disk, flip the disks
    if (r >= 0 && r < n && c >= 0 && c < n && board[r][c] === color) {
        for (const {r, c} of disksToFlip) {
            board[r][c] = color;
            flipped = true;
        }
    }
    return flipped;
}

export function getPossibleMove(board, color) {
    // console.log("Checking");
    let possibleMove = Array.from({length: board.length}, () => Array(board.length).fill(false));
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === "empty") {
                if (getNewBoard(board, i, j, color) !== null) {
                    possibleMove[i][j] = true;
                }
            }
        }
    }
    return possibleMove;
}

export function getBestMove(board, color, possibleMove) {
    let max = 100 * board.length * board.length;
    let maxRow = -1;
    let maxCol = -1;

    let newBoard = board.map((row) => [...row]);
    for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard.length; j++) {
            if (possibleMove[i][j]) {
                newBoard[i][j] = color;
                let numMove = calcPossible(newBoard, color);

                if (i === 0 || i === newBoard.length - 1) {
                    numMove -= 10;
                }
                if (j === 0 || j === newBoard.length - 1) {
                    numMove -= 10;
                }

                if (i === 1 && j === 1) {
                    numMove += 20;
                } else if (i === newBoard.length - 2 && j === 1) {
                    numMove += 20;
                } else if (i === 1 && j === newBoard.length - 2) {
                    numMove += 20;
                } else if (i === newBoard.length - 2 && j === newBoard.length - 2) {
                    numMove += 20;
                }

                if (numMove < max) {
                    max = numMove;
                    maxRow = i;
                    maxCol = j;
                }
            }
        }
    }

    return [maxRow, maxCol];
}

function calcPossible(board, color) {
    let count = 0;
    let possibleMove = getPossibleMove(board, color);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMove[i][j]) {
                count += 1;
            }
        }
    }
    return count;
}
