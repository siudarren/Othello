const diskStyles = {
    black: " black scoreDisk",
    white: " white scoreDisk",
};

const Scoreboard = ({whiteCount, blackCount, turn, gameEnd, aiColor}) => {
    const className = diskStyles[turn]; // Proper placement of the variable declaration
    const winner = blackCount > whiteCount ? "black" : whiteCount > blackCount ? "white" : null;
    const humanColor = aiColor === "black" ? "white" : aiColor === "white" ? "black" : null;
    return (
        <div className="scoreboard">
            <div className="item">
                <div className={diskStyles.black} />
                <p>: {blackCount}</p>

                <div className={diskStyles.white} />
                <p>: {whiteCount}</p>
            </div>
            <div className="item">
                {humanColor ? (
                    <>
                        <p>Player:</p>
                        <div className={diskStyles[humanColor]} />
                        <p> Bot:</p>
                        <div className={diskStyles[aiColor]} />
                    </>
                ) : (
                    <>
                        <p>Bot1:</p>
                        <div className={diskStyles.black} />
                        <p> Bot2:</p>
                        <div className={diskStyles.white} />
                    </>
                )}
            </div>
            {/* Only one .item ever exists in the DOM */}
            <div className="item">
                {gameEnd ? (
                    // game-over view
                    winner ? (
                        <>
                            <div className={diskStyles[winner]} />
                            <p> won🏅</p>
                        </>
                    ) : (
                        <p style={{fontStyle: "italic"}}>Tie game</p>
                    )
                ) : (
                    // in-game view
                    <>
                        <div className={className} />
                        <p> to move</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Scoreboard;
