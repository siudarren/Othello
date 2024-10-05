import {useState} from "react";
import "./App.css";
import Board from "./components/Board";
import {getNewBoard} from "./logic/gameLogic";

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

    const makeMove = (row, col) => {
        let newBoard = getNewBoard(board, row, col, turn);
        if (newBoard === null) {
            return;
        }

        if (turn === "black") {
            setTurn("white");
        } else {
            setTurn("black");
        }

        setBoard(newBoard); // Update the state with the new board
    };

    return (
        <div className="App">
            <Board board={board} makeMove={makeMove} />
        </div>
    );
}

export default App;
