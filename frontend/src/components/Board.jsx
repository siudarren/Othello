import Cell from "./Cell";

function Board({board, makeMove, possibleMove}) {
    return (
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        value={cell}
                        possible={possibleMove[rowIndex][colIndex]}
                        onClick={() => makeMove(rowIndex, colIndex)}
                    />
                ))
            )}
        </div>
    );
}

export default Board;
