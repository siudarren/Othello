const cellStyles = {
    empty: "disk empty",
    black: "disk black",
    white: "disk white",
};

function Cell({value, onClick}) {
    // Determine the style based on the value
    const className = cellStyles[value] || cellStyles.empty;

    return (
        <div className="cell" onClick={onClick}>
            <div className={className}></div>
        </div>
    );
}

export default Cell;
