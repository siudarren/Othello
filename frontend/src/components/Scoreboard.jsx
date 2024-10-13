const diskStyles = {
    black: "disk black scoreDisk",
    white: "disk white scoreDisk",
};

const Scoreboard = ({whiteCount, blackCount, turn, gameEnd}) => {
    const className = diskStyles[turn]; // Proper placement of the variable declaration
    return (
        <div className="scoreboard">
            <div className="item">
                <div className={`disk black scoreDisk`}></div>
                <p>: {blackCount}</p>

                <div className={`disk white scoreDisk`}></div>
                <p> : {whiteCount}</p>
            </div>
            <div className="item">
                <div className={className}></div>
                <p>turn to move</p>
            </div>
        </div>
    );
};

export default Scoreboard;
