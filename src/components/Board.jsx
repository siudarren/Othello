import Cell from "./Cell";

function Board({board, makeMove}) {
    return (
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell key={`${rowIndex}-${colIndex}`} value={cell} onClick={() => makeMove(rowIndex, colIndex)} />
                ))
            )}
        </div>
    );
}

export default Board;
