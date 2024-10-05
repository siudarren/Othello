const cellStyles = {
    empty: "disk empty",
    black: "disk black",
    white: "disk white",
    possible: "possible",
};

function Cell({value, onClick, possible}) {
    // Determine the style based on the value
    let className = cellStyles[value] || cellStyles.empty;
    if (possible) {
        className = "possible";
    }

    return (
        <div className="cell" onClick={onClick}>
            <div className={className}></div>
        </div>
    );
}

export default Cell;
