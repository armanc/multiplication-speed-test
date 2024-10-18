import React, { useState, useEffect } from "react";

// Component to display the final score and handle high score submission
const FinalScore = ({
    time,
    isHighscore,
    dbConnected,
    onTryAgain,
    onHighscoreSubmit,
}) => {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onHighscoreSubmit(name);
        } else {
            alert("Please enter your name.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (isHighscore && dbConnected && name.trim()) {
                handleSubmit(e);
            } else if (!isHighscore || !dbConnected) {
                onTryAgain();
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [isHighscore, dbConnected, name]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, "0")}:${centiseconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="text-center">
            <h2 className="font-bold text-2xl">
                {isHighscore ? "New high score!" : "Test completed!"}
            </h2>
            <p>Time: {formatTime(time)}</p>
            {dbConnected && isHighscore && (
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        maxLength="15"
                        className="
                            bg-white    
                            border-2
                            border-gray-400
                            rounded-md
                            h-16
                            text-3xl
                            text-center
                            w-1/1
                            font-bold
                            focus:border-gray-400
                            focus:outline-none
                            focus:ring-0
                            mb-5
                            mt-3
                        "
                        autoFocus
                    />
                    <br />
                    <button
                        className="general_button_style"
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                    >
                        Submit
                    </button>
                </div>
            )}

            {!dbConnected && (
                <p className="text-red-600">Database not connected</p>
            )}
            {(!dbConnected || !isHighscore) && (
                <button
                    onClick={onTryAgain}
                    className="my-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-3 w-48 font-bold gray-800 general_button_style"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default FinalScore;
