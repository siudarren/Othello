import {useState, useEffect} from "react";
import "./App.css";
import Board from "./components/Board";
import {getNewBoard} from "./logic/gameLogic";
import {getGameStatus, getNumberOfPossibleMoves, getPossibleMoves} from "./logic/gameStatus";
import {getBestMove, getBestMoveMiniMax, getBestMoveMiniMax2, toggleColor} from "./logic/gameAI";
import Scoreboard from "./components/Scoreboard";

const initialBoard = () => {
    // Create an 8x8 grid filled with null (empty cells)
    const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill("empty"));

    // Setting up the four initial pieces in the center
    board[3][3] = "white";
    board[3][4] = "black";
    board[4][3] = "black";
    board[4][4] = "white";

    return board;
};

function App() {
    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState("black");
    const [whiteCount, setWhiteCount] = useState(2);
    const [blackCount, setBlackCount] = useState(2);
    const [gameEnd, setGameEnd] = useState(false);
    const [possibleMoves, setPossibleMoves] = useState(getPossibleMoves(board, turn));
    const [bestMove, setBestMove] = useState([-1, -1]);
    const [bestMoveMinimax, setBestMoveMinimax] = useState([-1, -1]);
    const [bestMoveMinimax2, setBestMoveMinimax2] = useState([-1, -1]);
    const [auto, setAuto] = useState(true);

    // Correctly placed useEffect to react to changes in board and turn
    useEffect(() => {
        const numMove = getNumberOfPossibleMoves(board, toggleColor(turn));
        let colorToMove = turn;

        if (numMove !== 0) {
            colorToMove = toggleColor(turn);
        }

        setPossibleMoves(getPossibleMoves(board, colorToMove));

        const {whiteCount: newWhiteCount, blackCount: newBlackCount, gameEnd: newGameEnd} = getGameStatus(board);
        setWhiteCount(newWhiteCount);
        setBlackCount(newBlackCount);
        setGameEnd(newGameEnd);

        setTurn(colorToMove);
    }, [board]);

    useEffect(() => {
        if (auto) {
            if (turn === "black") {
                setTimeout(() => {
                    // if (bestMove[1] !== -1) {
                    //     makeMove(bestMove[0], bestMove[1]);
                    // }
                    if (bestMoveMinimax2[1] !== -1) {
                        makeMove(bestMoveMinimax2[0], bestMoveMinimax2[1]);
                    } else {
                        console.log("No Best MINIMAX Move");
                    }
                }, 100);
            }
        }
    }, [bestMoveMinimax2]);

    useEffect(() => {
        if (auto) {
            if (turn === "white") {
                setTimeout(() => {
                    if (bestMoveMinimax[1] !== -1) {
                        makeMove(bestMoveMinimax[0], bestMoveMinimax[1]);
                    } else {
                        console.log("No Best MINIMAX Move");
                    }
                }, 100);
            }
        }
    }, [bestMoveMinimax]);

    useEffect(() => {
        setBestMove(getBestMove(board, turn, possibleMoves));
        if (turn === "white") {
            setBestMoveMinimax(getBestMoveMiniMax(board, turn, possibleMoves, 5));
        } else {
            setBestMoveMinimax2(getBestMoveMiniMax2(board, turn, possibleMoves, 5));
        }
    }, [possibleMoves]);

    const makeMove = (row, col) => {
        if (gameEnd) {
            return;
        }
        if (!possibleMoves[row][col]) {
            console.log("Invalid Cell");
            return;
        }

        let newBoard = getNewBoard(board, row, col, turn);
        // console.log(newBoard);
        if (newBoard === null) {
            return;
        }

        // if (turn === "black") {
        //     setTurn("white");
        // } else {
        //     setTurn("black");
        // }

        // Update the state with the new board
        setBoard(newBoard);
    };

    const resetGame = () => {
        const fresh = initialBoard();
        setBoard(fresh);
        setTurn("black");
        setWhiteCount(2);
        setBlackCount(2);
        setGameEnd(false);
        setPossibleMoves(getPossibleMoves(fresh, "black"));
        setBestMove([-1, -1]);
        setBestMoveMinimax([-1, -1]);
        setBestMoveMinimax2([-1, -1]);
        // bestMove and bestMoveMiniMax will update automatically
    };

    return (
        <div className="App">
            <Scoreboard whiteCount={whiteCount} blackCount={blackCount} turn={turn} gameEnd={gameEnd} />
            <Board
                board={board}
                possibleMoves={possibleMoves}
                makeMove={makeMove}
                bestMove={turn === "white" ? bestMoveMinimax : bestMoveMinimax2}
            />
            <button onClick={resetGame} className="reset">
                Reset
            </button>
        </div>
    );
}

export default App;
