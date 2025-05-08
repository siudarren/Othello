import {useState, useEffect} from "react";
import {flushSync} from "react-dom";

import "./App.css";
import Board from "./components/Board";
import Scoreboard from "./components/Scoreboard";

import {getNewBoard} from "./logic/gameLogic";
import {getGameStatus, getNumberOfPossibleMoves, getPossibleMoves} from "./logic/gameStatus";
import {getBestMoveMiniMax2, toggleColor} from "./logic/gameAI";

// helper for an “empty” 8×8 move grid
const emptyGrid = () =>
    Array(8)
        .fill(null)
        .map(() => Array(8).fill(false));

// set up the starting four pieces
const initialBoard = () => {
    const b = Array(8)
        .fill(null)
        .map(() => Array(8).fill("empty"));
    b[3][3] = "white";
    b[3][4] = "black";
    b[4][3] = "black";
    b[4][4] = "white";
    return b;
};

function App() {
    // what color the AI plays
    const [aiColor, setAiColor] = useState("black");
    // has the user already chosen a side?
    const [sideChosen, setSideChosen] = useState(false);

    const humanColor = toggleColor(aiColor);

    const [board, setBoard] = useState(initialBoard());
    const [turn, setTurn] = useState("black"); // black always starts
    const [possibleMoves, setPossibleMoves] = useState(() => getPossibleMoves(initialBoard(), "black"));
    const [whiteCount, setWhiteCount] = useState(2);
    const [blackCount, setBlackCount] = useState(2);
    const [gameEnd, setGameEnd] = useState(false);
    const auto = true;

    // 1️. Recompute moves / skip‐turn / game‐over whenever board or turn changes
    useEffect(() => {
        const myMoves = getNumberOfPossibleMoves(board, turn);
        if (myMoves > 0) {
            setPossibleMoves(getPossibleMoves(board, turn));
        } else {
            const other = toggleColor(turn);
            const theirMoves = getNumberOfPossibleMoves(board, other);
            if (theirMoves > 0) {
                setTurn(other);
                setPossibleMoves(getPossibleMoves(board, other));
            } else {
                setGameEnd(true);
                setPossibleMoves(emptyGrid());
            }
        }

        const counts = getGameStatus(board);
        setWhiteCount(counts.whiteCount);
        setBlackCount(counts.blackCount);
    }, [board, turn]);

    // 2️. When it’s the AI’s turn, think & play
    useEffect(() => {
        if (!auto || gameEnd) return;
        if (turn !== aiColor) return;

        setTimeout(() => {
            const moves = getPossibleMoves(board, aiColor);
            const [r, c] = getBestMoveMiniMax2(board, aiColor, moves, 5);
            if (c !== -1) {
                applyMove(r, c, aiColor);
            }
        }, 100);
    }, [turn, board, auto, gameEnd, aiColor]);

    // 3️. Handle human clicks
    const onCellClick = (r, c) => {
        if (turn !== humanColor || gameEnd) return;
        if (!possibleMoves[r][c]) return;
        applyMove(r, c, humanColor);
    };

    const applyMove = (row, col, color) => {
        // run the legality check & get the new board
        const newBoard = getNewBoard(board, row, col, color);
        if (!newBoard) {
            console.error("applyMove: illegal move", {row, col, color});
            return;
        }

        // flush both updates together so React never sees an inconsistent in-between state
        flushSync(() => {
            setBoard(newBoard);
            setTurn(toggleColor(color));
        });
    };

    // 4️. Reset
    const resetGame = () => {
        setSideChosen(false);
        initializeGame();
    };

    // 5. InitializeBoard
    const initializeGame = () => {
        const fresh = initialBoard();
        setBoard(fresh);
        setTurn("black");
        setGameEnd(false);
    };

    // call this when the user picks a side
    const chooseSide = (color) => {
        setAiColor(color);
        setSideChosen(true);
        initializeGame();
    };

    return (
        <div className={`App ${!sideChosen ? "modal-open" : ""}`}>
            <Board board={board} possibleMoves={possibleMoves} makeMove={onCellClick} />
            {/** If side not chosen yet, show a simple modal/panel **/}
            {!sideChosen ? (
                <div className="side-selection-modal">
                    <h2>Choose Your Side</h2>
                    <button onClick={() => chooseSide("black")} className="choose-side-button">
                        You play White (AI is Black)
                    </button>
                    <button onClick={() => chooseSide("white")} className="choose-side-button">
                        You play Black (AI is White)
                    </button>
                </div>
            ) : (
                <>
                    <Scoreboard whiteCount={whiteCount} blackCount={blackCount} turn={turn} gameEnd={gameEnd} />

                    {/** Optional: let them switch side mid‐game **/}

                    <button onClick={resetGame} className="reset">
                        Reset
                    </button>
                </>
            )}
        </div>
    );
}

export default App;
