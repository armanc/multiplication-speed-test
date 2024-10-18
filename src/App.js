import React, { useState, useEffect, useCallback } from "react";
import TestSection from "./components/TestSection";
import Highscores from "./components/Highscores";
import FinalScore from "./components/FinalScore";
import QuestionProgress from "./components/QuestionProgress";
import axios from "axios";
import "./App.css";

function App() {
    const [isTestActive, setIsTestActive] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [isHighscore, setIsHighscore] = useState(false);
    const [scoreTime, setScoreTime] = useState(0);
    const [dbConnected, setDbConnected] = useState(true);
    const [highscores, setHighscores] = useState([]);
    const [recentHighscore, setRecentHighscore] = useState(null);
    const [showHighscores, setShowHighscores] = useState(() => {
        const savedState = localStorage.getItem("showHighscores");
        return savedState === "true";
    });
    const [progress, setProgress] = useState(0);

    const handleTestToggle = () => {
        if (!isTestActive) {
            setIsTestActive(true);
            setTestCompleted(false);
            checkDbConnection();
            setProgress(0);
        }
    };

    const handleHighscoresToggle = () => {
        const newState = !showHighscores;
        setShowHighscores(newState);
        localStorage.setItem("showHighscores", newState);

        // Only fetch highscores when toggling on and we haven't fetched them before
        if (newState && highscores.length === 0) {
            fetchHighscores();
        }
    };

    const handleTestComplete = (time, isHighscore) => {
        setIsTestActive(false);
        setTestCompleted(true);
        setScoreTime(time);
        setIsHighscore(isHighscore);
        setProgress(100);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if (!isTestActive && !testCompleted) {
                handleTestToggle();
            }
        }
    };

    const checkDbConnection = async () => {
        try {
            const response = await fetch("http://localhost:5000/health");
            const isConnected = response.ok;
            setDbConnected(isConnected);
            if (isConnected) {
                fetchHighscores();
            }
        } catch (error) {
            setDbConnected(false);
        }
    };

    const fetchHighscores = useCallback(async () => {
        if (!dbConnected) {
            setHighscores([]);
            return;
        }
        try {
            const response = await axios.get(
                "http://localhost:5000/highscores"
            );
            setHighscores(response.data || []);
        } catch (error) {
            console.error("Error fetching high scores", error);
            setHighscores([]);
        }
    }, [dbConnected]);

    const handleHighscoreSubmit = async (name) => {
        const apiUrl = "http://localhost:5000";
        try {
            const response = await axios.post(`${apiUrl}/highscores`, {
                name,
                time: scoreTime,
            });
            setTestCompleted(false);
            fetchHighscores();
            setProgress(0);
            setRecentHighscore(response.data.id);
            setShowHighscores(true);
        } catch (error) {
            console.error("Error submitting high score", error);
            alert("Failed to submit high score.");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleTestToggle();
    };

    useEffect(() => {
        checkDbConnection();
    }, []);

    // useEffect(() => {
    //     fetchHighscores();
    // }, [dbConnected]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [isTestActive, testCompleted]);

    return (
        <div className="flex flex-col min-h-screen p-4">
            <header className="tracking-widest mb-3 flex justify-between items-center font-sansserif text-gray-700 text-sm font-bold">
                <p>MULTIPLICATION SPEED TEST</p>

                <button
                    className="border-solid border-2 border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 rounded-full pl-3 pr-3"
                    onClick={handleHighscoresToggle}
                >
                    {showHighscores ? "Hide Highscores" : "Show Highscores"}
                </button>
            </header>
            <div className="h-1 w-full bg-gray-200">
                <QuestionProgress progress={progress} />
            </div>
            <div className="flex-grow flex pt-4">
                <div className="flex flex-col justify-center w-full">
                    <div className="flex-1 text-center flex flex-col items-center justify-center">
                        {!isTestActive && !testCompleted && (
                            <p className="pb-5 text-3xl">
                                How fast can you solve 10 multiplication
                                questions?
                            </p>
                        )}
                        {!isTestActive && !testCompleted && (
                            <form onSubmit={handleFormSubmit}>
                                <button
                                    type="submit"
                                    className="general_button_style"
                                >
                                    BEGIN
                                </button>
                            </form>
                        )}
                        {isTestActive && (
                            <TestSection
                                onTestComplete={handleTestComplete}
                                dbConnected={dbConnected}
                                setProgress={setProgress}
                            />
                        )}
                        {!isTestActive && testCompleted && (
                            <FinalScore
                                time={scoreTime}
                                isHighscore={isHighscore}
                                dbConnected={dbConnected}
                                onTryAgain={handleTestToggle}
                                onHighscoreSubmit={handleHighscoreSubmit}
                            />
                        )}
                    </div>
                </div>
                {showHighscores && (
                    <div className="flex-grow flex justify-end">
                        <div className="highscores-section w-full max-w-md">
                            <Highscores
                                dbConnected={dbConnected}
                                highscores={highscores}
                                recentHighscore={recentHighscore}
                            />
                        </div>
                    </div>
                )}
            </div>
            <footer className="w-full py-4 bg-white">
                <div className="text-center text-sm text-gray-400">
                    Learning project by Armands Baris for CS50 © 2024.
                </div>
            </footer>
        </div>
    );
}

export default App;
