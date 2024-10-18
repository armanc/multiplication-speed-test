import React from "react";

const QuestionProgress = ({ progress }) => {
    return (
        <div
            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
            style={{ width: `${Math.max(0, progress)}%` }}
        />
    );
};

export default QuestionProgress;
