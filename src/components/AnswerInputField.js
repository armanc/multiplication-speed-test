import React from "react";

// Input field for the user's answer
const AnswerInputField = ({
    answer,
    handleChange,
    handleKeyDown,
    inputRef,
}) => {
    return (
        <input
            type="text"
            value={answer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="
                bg-white
                border-2
                border-gray-400
                rounded-md
                h-16
                text-3xl
                text-center
                w-48
                font-bold
                focus:border-gray-400
                focus:outline-none
                focus:ring-0
                "
            placeholder=""
        />
    );
};

export default AnswerInputField;
