import React, { useState, useEffect } from "react";

// Timer component to display the elapsed time
const Timer = ({ onUpdate }) => {
    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMilliseconds((prevMilliseconds) => prevMilliseconds + 10);
        }, 10);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        onUpdate(milliseconds);
    }, [milliseconds, onUpdate]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, "0")}:${centiseconds
            .toString()
            .padStart(2, "0")}`;
    };

    return <div className="timer">Time: {formatTime(milliseconds)}</div>;
};

export default Timer;
