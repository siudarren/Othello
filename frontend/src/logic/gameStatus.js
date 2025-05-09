import {getNewBoard} from "./gameLogic";
import {toggleColor} from "./gameAI";

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

/**
 * Returns an 8×8 boolean map of which discs are “stable” (i.e. can never be flipped again),
 * by seeding the four corners and iteratively marking any disc that in *all* directions
 * is supported by same-color stable discs or the board edge.
 */
function getStableMap(board) {
    const N = board.length;
    const stable = Array(N)
        .fill(null)
        .map(() => Array(N).fill(false));

    // 1) Seed corners
    const corners = [
        [0, 0],
        [0, N - 1],
        [N - 1, 0],
        [N - 1, N - 1],
    ];
    corners.forEach(([r, c]) => {
        if (board[r][c] !== "empty") stable[r][c] = true;
    });

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ];

    // 2) Grow stability until no changes
    let changed = true;
    while (changed) {
        changed = false;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (board[r][c] === "empty" || stable[r][c]) continue;
                const col = board[r][c];

                // A cell is stable if *every* ray in the 8 directions
                // leads (through same‐color & stable discs) off the board.
                let isStable = true;
                for (const [dr, dc] of dirs) {
                    let rr = r + dr,
                        cc = c + dc;
                    // march along the ray while we see same‐color stable discs
                    while (rr >= 0 && rr < N && cc >= 0 && cc < N && board[rr][cc] === col && stable[rr][cc]) {
                        rr += dr;
                        cc += dc;
                    }
                    // if we stopped *inside* the board, this ray isn’t “closed”
                    if (rr >= 0 && rr < N && cc >= 0 && cc < N) {
                        isStable = false;
                        break;
                    }
                }

                if (isStable) {
                    stable[r][c] = true;
                    changed = true;
                }
            }
        }
    }

    return stable;
}

/**
 * countStableDiscs(board, maximizingColor)
 *
 * @returns {{ stableMy: number, stableOpp: number }}
 */
export function countStableDiscs(board, maximizingColor) {
    const opponentColor = toggleColor(maximizingColor);
    const stableMap = getStableMap(board);

    let stableMy = 0,
        stableOpp = 0;
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board.length; c++) {
            if (!stableMap[r][c]) continue;
            if (board[r][c] === maximizingColor) stableMy++;
            else if (board[r][c] === opponentColor) stableOpp++;
        }
    }
    return {stableMy, stableOpp};
}

/**
 * countFrontierDiscs(board, maximizingColor)
 *
 * A “frontier” disc is one that’s adjacent to at least one empty square.
 * Returns { frontierMy, frontierOpp }.
 */
export function countFrontierDiscs(board, maximizingColor) {
    const opponentColor = toggleColor(maximizingColor);

    let frontierMy = 0,
        frontierOpp = 0;
    const N = board.length;
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ];

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const col = board[r][c];
            if (col === "empty") continue;

            // is there an empty neighbor?
            let isFrontier = false;
            for (const [dr, dc] of dirs) {
                const rr = r + dr,
                    cc = c + dc;
                if (rr >= 0 && rr < N && cc >= 0 && cc < N && board[rr][cc] === "empty") {
                    isFrontier = true;
                    break;
                }
            }

            if (isFrontier) {
                if (col === maximizingColor) frontierMy++;
                else if (col === opponentColor) frontierOpp++;
            }
        }
    }

    return {frontierMy, frontierOpp};
}
