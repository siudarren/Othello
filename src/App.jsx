import {useState, useEffect} from "react";
import "./App.css";
import Board from "./components/Board";
import {getNewBoard, getPossibleMove, getBestMove, calcPossible} from "./logic/gameLogic";
import {gameStatus} from "./logic/gameStatus";
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
    const [possibleMove, setPossibleMove] = useState(getPossibleMove(board, turn));
    const [bestMove, setBestMove] = useState();
    const [auto, setAuto] = useState(true);

    // Correctly placed useEffect to react to changes in board and turn
    useEffect(() => {
        setPossibleMove(getPossibleMove(board, turn));

        const {whiteCount: newWhiteCount, blackCount: newBlackCount, gameEnd: newGameEnd} = gameStatus(board);
        setWhiteCount(newWhiteCount);
        setBlackCount(newBlackCount);
        setGameEnd(newGameEnd);
    }, [board, turn]);

    useEffect(() => {
        if (auto) {
            if (turn === "white") {
                setTimeout(() => {
                    if (bestMove[0] !== -1) {
                        makeMove(bestMove[0], bestMove[1]);
                    }
                }, 100);
            }
        }
    }, [bestMove]);

    useEffect(() => {
        setBestMove(getBestMove(board, turn, possibleMove));
        console.log(getBestMove(board, turn, possibleMove));
    }, [possibleMove]);

    useEffect(() => {
        const numMove = calcPossible(board, turn);
        if (numMove === 0) {
            if (turn === "black") {
                setTurn("white");
            } else {
                setTurn("black");
            }
        }
    }, [board]);

    const makeMove = (row, col) => {
        if (gameEnd) {
            return;
        }
        if (!possibleMove[row][col]) {
            return;
        }

        let newBoard = getNewBoard(board, row, col, turn);
        // console.log(newBoard);
        if (newBoard === null) {
            return;
        }

        if (turn === "black") {
            setTurn("white");
        } else {
            setTurn("black");
        }

        // Update the state with the new board
        setBoard(newBoard);
    };

    return (
        <div className="App">
            <Scoreboard whiteCount={whiteCount} blackCount={blackCount} turn={turn} gameEnd={gameEnd} />
            <Board board={board} possibleMove={possibleMove} makeMove={makeMove} bestMove={bestMove} />
        </div>
    );
}

export default App;
