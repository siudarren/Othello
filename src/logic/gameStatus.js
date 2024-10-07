import { getNewBoard } from "./gameLogic";

export function getPossibleMoves(board, color) {
    // console.log("Checking");
    let possibleMoves = Array.from({length: board.length}, () => Array(board.length).fill(false));
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === "empty") {
                if (getNewBoard(board, i, j, color) !== null) {
                    possibleMoves[i][j] = true;
                }
            }
        }
    }
    return possibleMoves;
}

export function getNumberOfPossibleMoves(board, color) {
    let count = 0;
    let possibleMoves = getPossibleMoves(board, color);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMoves[i][j]) {
                count += 1;
            }
        }
    }
    return count;
}

export function getGameStatus(board) {
    let whiteCount = 0;
    let blackCount = 0;
    let gameEnd = false;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == "black") {
                blackCount += 1;
            } else if (board[i][j] == "white") {
                whiteCount += 1;
            }
        }
    }

    if (whiteCount + blackCount === board.length * board.length) {
        gameEnd = true;
    }
    return {blackCount, whiteCount, gameEnd};
}