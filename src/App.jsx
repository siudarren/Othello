import {useState} from "react";
import "./App.css";
import Board from "./components/Board";

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

    const makeMove = (row, col) => {
        // Here you would include the logic to:
        // 1. Validate the move
        // 2. Flip the opponent's pieces
        // 3. Update the board state

        // Simple move validation and placement for demonstration:
        if (board[row][col] === null) {
            // Assuming you can only place in an empty spot
            const newBoard = board.map((row) => [...row]); // Create a shallow copy of the board
            newBoard[row][col] = "black"; // Just to demonstrate, always place black
            setBoard(newBoard); // Update the state with the new board
        }
    };

    return (
        <div className="App">
            <Board board={board} makeMove={makeMove} />
        </div>
    );
}

export default App;
