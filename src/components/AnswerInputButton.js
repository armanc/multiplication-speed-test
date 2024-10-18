import React from "react";

// Submit button for the user's answer
const AnswerInputButton = ({ handleSubmit }) => {
    return (
        <button onClick={handleSubmit} className="general_button_style">
            OK
        </button>
    );
};

export default AnswerInputButton;
