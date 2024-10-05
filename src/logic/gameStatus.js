export function gameStatus(board) {
    let whiteCount = 0;
    let blackCount = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == "black") {
                blackCount += 1;
            } else if (board[i][j] == "white") {
                whiteCount += 1;
            }
        }
    }

    return {blackCount, whiteCount};
}
