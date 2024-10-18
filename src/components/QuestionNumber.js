import React from "react";

// Component to display the current question number and total questions
const QuestionNumber = ({ currentQuestion, totalQuestions }) => {
    return (
        <div className="question-number">
            <p>
                Question {currentQuestion}/{totalQuestions}
            </p>
        </div>
    );
};

export default QuestionNumber;
