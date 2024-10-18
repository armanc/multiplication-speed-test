import React from "react";

const Highscores = ({ dbConnected, highscores = [], recentHighscore }) => {
    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, "0")}:${centiseconds
            .toString()
            .padStart(2, "0")}`;
    };

    if (!dbConnected) {
        return <p className="text-red-600">Database not connected</p>;
    }

    if (highscores.length === 0) {
        return <p>No high scores available.</p>;
    }

    return (
        <div>
            <table className="highscores">
                <tbody>
                    {highscores.map((score, index) => (
                        <tr
                            key={score.id}
                            className={`
                                ${
                                    score.id === recentHighscore
                                        ? "font-bold"
                                        : "font-normal"
                                }
                                ${
                                    score.id === recentHighscore
                                        ? "bg-blue-100"
                                        : ""
                                }
                            `}
                        >
                            <td>{index + 1}</td>
                            <td>{score.name}</td>
                            <td>{formatTime(score.time)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Highscores;
