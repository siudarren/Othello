import Cell from "./Cell";

function Board({board, makeMove, possibleMoves, bestMove}) {
    return (
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        value={cell}
                        possible={possibleMoves[rowIndex][colIndex]}
                        onClick={() => makeMove(rowIndex, colIndex)}
                        isBestMove={bestMove && rowIndex === bestMove[0] && colIndex === bestMove[1]}
                    />
                ))
            )}
        </div>
    );
}

export default Board;
