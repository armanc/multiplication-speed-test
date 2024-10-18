import React from "react";

// Component to display the current multiplication question
const Question = ({ question }) => {
    return (
        <div className="question">
            <p>{question}</p>
        </div>
    );
};

export default Question;
