import {getNewBoard} from "./gameLogic";
import {getGameStatus, getNumberOfPossibleMoves, getPossibleMoves} from "./gameStatus";
const WEIGHTS = [
    [100, -20, 10, 5, 5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [10, -2, 5, 1, 1, 5, -2, 10],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [10, -2, 5, 1, 1, 5, -2, 10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10, 5, 5, 10, -20, 100],
];

export function getBestMove(board, color, possibleMoves) {
    if (board === null) {
        return [-1, -1];
    }

    let max = 100 * board.length * board.length;
    let maxRow = -1;
    let maxCol = -1;

    let newBoard = board.map((row) => [...row]);
    for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard.length; j++) {
            if (possibleMoves[i][j]) {
                newBoard[i][j] = color;
                let numMove = getNumberOfPossibleMoves(newBoard, color);

                if (i === 0 || i === newBoard.length - 1) {
                    numMove -= 10;
                }
                if (j === 0 || j === newBoard.length - 1) {
                    numMove -= 10;
                }

                if (i === 1 || i === newBoard.length - 2) {
                    numMove += 5;
                }
                if (j === 1 || j === newBoard.length - 2) {
                    numMove += 5;
                }

                if (i === 1 && j === 1) {
                    numMove += 10;
                } else if (i === newBoard.length - 2 && j === 1) {
                    numMove += 10;
                } else if (i === 1 && j === newBoard.length - 2) {
                    numMove += 10;
                } else if (i === newBoard.length - 2 && j === newBoard.length - 2) {
                    numMove += 10;
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

function minimax(board, depth, isMaximizingPlayer, color, maximizingColor) {
    if (depth === 0) {
        // Always evaluate from the AI's perspective
        return evaluateBoard(board, maximizingColor);
    }

    let possibleMoves = getPossibleMoves(board, color);
    let opColor = toggleColor(color);

    if (getNumberOfPossibleMoves(board, color) === 0) {
        // Current player has no moves
        if (getNumberOfPossibleMoves(board, opColor) === 0) {
            // Game over
            return evaluateBoard(board, maximizingColor);
        } else {
            // Pass turn to opponent
            return minimax(board, depth - 1, !isMaximizingPlayer, opColor, maximizingColor);
        }
    }

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMoves[i][j]) {
                let newBoard = getNewBoard(board, i, j, color);
                let score = minimax(newBoard, depth - 1, !isMaximizingPlayer, opColor, maximizingColor);

                if (isMaximizingPlayer) {
                    bestScore = Math.max(score, bestScore);
                } else {
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
    }
    return bestScore;
}

function minimax2(board, depth, isMaximizingPlayer, color, maximizingColor) {
    if (depth === 0) {
        // Always evaluate from the AI's perspective
        return evaluateBoard2(board, maximizingColor);
    }

    let possibleMoves = getPossibleMoves(board, color);
    let opColor = toggleColor(color);

    if (getNumberOfPossibleMoves(board, color) === 0) {
        // Current player has no moves
        if (getNumberOfPossibleMoves(board, opColor) === 0) {
            // Game over
            return evaluateBoard2(board, maximizingColor);
        } else {
            // Pass turn to opponent
            return minimax2(board, depth - 1, !isMaximizingPlayer, opColor, maximizingColor);
        }
    }

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMoves[i][j]) {
                let newBoard = getNewBoard(board, i, j, color);
                let score = minimax2(newBoard, depth - 1, !isMaximizingPlayer, opColor, maximizingColor);

                if (isMaximizingPlayer) {
                    bestScore = Math.max(score, bestScore);
                } else {
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
    }
    return bestScore;
}

function evaluateBoard(board, maximizingColor) {
    const {whiteCount, blackCount} = getGameStatus(board);
    const opponentColor = toggleColor(maximizingColor);

    let score = 0;

    // Counts
    const myCount = maximizingColor === "black" ? blackCount : whiteCount;
    const opponentCount = maximizingColor === "black" ? whiteCount : blackCount;

    // Basic heuristic: difference in piece counts
    score += myCount - opponentCount;

    // Possible moves
    const myPossibleMoves = getNumberOfPossibleMoves(board, maximizingColor);
    const opponentPossibleMoves = getNumberOfPossibleMoves(board, opponentColor);
    score += myPossibleMoves - opponentPossibleMoves;

    // Corners
    const corners = [
        board[0][0],
        board[0][board.length - 1],
        board[board.length - 1][0],
        board[board.length - 1][board.length - 1],
    ];
    corners.forEach((corner) => {
        if (corner === maximizingColor) score += 10;
        else if (corner === opponentColor) score -= 10;
    });

    // Edges
    for (let i = 1; i < board.length - 1; i++) {
        if (board[0][i] === maximizingColor) score += 5;
        if (board[board.length - 1][i] === maximizingColor) score += 5;
        if (board[i][0] === maximizingColor) score += 5;
        if (board[i][board.length - 1] === maximizingColor) score += 5;

        if (board[0][i] === opponentColor) score -= 5;
        if (board[board.length - 1][i] === opponentColor) score -= 5;
        if (board[i][0] === opponentColor) score -= 5;
        if (board[i][board.length - 1] === opponentColor) score -= 5;
    }

    return score;
}

function evaluateBoard2(board, maximizingColor) {
    const {whiteCount, blackCount} = getGameStatus(board);
    const opponentColor = toggleColor(maximizingColor);

    let phase = whiteCount + blackCount < 40 ? "early" : whiteCount + blackCount < 55 ? "mid" : "end";
    // const phase_ratio = Math.min(Math.max((whiteCount + blackCount - 20) / 40, 0), 1);

    let score = 0;

    // Counts
    const myCount = maximizingColor === "black" ? blackCount : whiteCount;
    const opponentCount = maximizingColor === "black" ? whiteCount : blackCount;

    // Basic heuristic: difference in piece counts
    if (phase === "early") {
        score += myCount - opponentCount;
    } else if (phase === "mid") {
        score += (myCount - opponentCount) * 20;
    } else if (phase === "end") {
        score += (myCount - opponentCount) * 100;
    }

    // score += (myCount - opponentCount) * 30 * phase_ratio;

    // Possible moves
    const myPossibleMoves = getNumberOfPossibleMoves(board, maximizingColor);
    const opponentPossibleMoves = getNumberOfPossibleMoves(board, opponentColor);

    if (phase === "early") {
        score += (myPossibleMoves - opponentPossibleMoves) * 5;
    } else if (phase === "mid") {
        score += (myPossibleMoves - opponentPossibleMoves) * 3;
    } else if (phase === "end") {
        score += myPossibleMoves - opponentPossibleMoves;
    }
    // score += (myPossibleMoves - opponentPossibleMoves) * 5 * (1 - phase_ratio);

    let positionalScore = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === maximizingColor) positionalScore += WEIGHTS[r][c];
            else if (board[r][c] === opponentColor) positionalScore -= WEIGHTS[r][c];
        }
    }
    score += positionalScore;

    return score;
}

export function getBestMoveMiniMax(board, color, possibleMove, depth = 3) {
    let bestScore = -Infinity;
    let move = {row: -1, col: -1};
    const maximizingColor = color; // AI's color

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMove[i][j]) {
                let newBoard = getNewBoard(board, i, j, color);
                // Pass maximizingColor to minimax
                let score = minimax(newBoard, depth - 1, false, toggleColor(color), maximizingColor);

                if (score > bestScore) {
                    bestScore = score;
                    move = {row: i, col: j};
                }
            }
        }
    }
    return [move.row, move.col];
}

export function getBestMoveMiniMax2(board, color, possibleMove, depth = 3) {
    let bestScore = -Infinity;
    let move = {row: -1, col: -1};
    const maximizingColor = color; // AI's color

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (possibleMove[i][j]) {
                let newBoard = getNewBoard(board, i, j, color);
                // Pass maximizingColor to minimax
                let score = minimax2(newBoard, depth - 1, false, toggleColor(color), maximizingColor);

                if (score > bestScore) {
                    bestScore = score;
                    move = {row: i, col: j};
                }
            }
        }
    }
    return [move.row, move.col];
}

export function toggleColor(color) {
    return color === "black" ? "white" : "black";
}
