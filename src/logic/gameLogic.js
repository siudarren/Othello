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
