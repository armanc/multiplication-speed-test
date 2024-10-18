import React, { useState, useEffect, useCallback, useRef } from "react";
import QuestionNumber from "./QuestionNumber";
import Question from "./Question";
import Timer from "./Timer";
import AnswerInputField from "./AnswerInputField";
import AnswerInputButton from "./AnswerInputButton";
import axios from "axios";

const TestSection = ({ onTestComplete, dbConnected, setProgress }) => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [totalQuestions] = useState(10);
    const previousQuestionRef = useRef(null);
    const [multiplicationQuestion, setMultiplicationQuestion] =
        useState(generateQuestion);
    const [score, setScore] = useState(0);
    const [incorrectAnswer, setIncorrectAnswer] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [time, setTime] = useState(0);
    const [answer, setAnswer] = useState("");

    const inputRef = useRef(null);
    const answer_for_output = useRef("");

    const checkHighscore = useCallback(async () => {
        if (!dbConnected) {
            onTestComplete(time, false);
            return;
        }
        const apiUrl = "http://localhost:5000";
        try {
            const response = await axios.get(`${apiUrl}/highscores`);
            const highscores = response.data;
            const highscoreLimit = 10; // Change this value to the desired limit
            const isHighscore =
                highscores.length < highscoreLimit ||
                time < highscores[highscores.length - 1].time;
            onTestComplete(time, isHighscore);
        } catch (error) {
            console.error("Error checking high score", error);
            onTestComplete(time, false);
        }
    }, [time, onTestComplete, dbConnected]);

    function generateQuestion() {
        let newQuestion;
        do {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            newQuestion = `${num1} x ${num2}`;
        } while (newQuestion === previousQuestionRef.current);

        previousQuestionRef.current = newQuestion;
        return newQuestion;
    }

    const handleAnswerSubmit = () => {
        const [num1, num2] = multiplicationQuestion.split(" x ").map(Number);
        if (parseInt(answer) === num1 * num2) {
            setScore(score + 1);
            setIncorrectAnswer(false);
            const nextQuestion = currentQuestion + 1;
            if (currentQuestion < totalQuestions) {
                setCurrentQuestion(nextQuestion);
                setMultiplicationQuestion(generateQuestion());
                setAnswer("");
                const newProgress = ((nextQuestion - 1) / totalQuestions) * 100;
                setProgress(newProgress);
            } else {
                setShowTime(true);
                setProgress(100);
            }
        } else {
            setIncorrectAnswer(true);
            answer_for_output.current = answer;
            setAnswer("");
        }
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAnswerSubmit();
        }
    };

    const handleTimerUpdate = (milliseconds) => {
        setTime(milliseconds);
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (showTime) {
            checkHighscore();
        }
    }, [showTime, checkHighscore]);

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 relative">
            <div className="absolute top-0 right-0 m-3">
                <Timer onUpdate={handleTimerUpdate} />
            </div>
            <div className="absolute top-0 left-0 m-3">
                <QuestionNumber
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                />
            </div>
            <div className="flex-grow flex flex-col justify-center items-center w-full">
                <div className="flex flex-col items-center w-full text-5xl font-bold">
                    <Question question={multiplicationQuestion} />
                </div>
                <div className="p-10 w-full max-w-3xl">
                    <AnswerInputField
                        answer={answer}
                        handleChange={handleChange}
                        handleKeyDown={handleKeyDown}
                        inputRef={inputRef}
                    />
                </div>
                <div className="relative w-full max-w-3xl">
                    {incorrectAnswer && (
                        <p className="text-red-600 absolute w-full top-0 left-0 text-center mt-[-32px]">
                            {answer_for_output.current} is incorrect answer. Try
                            again!
                        </p>
                    )}
                </div>
                <div>
                    <AnswerInputButton handleSubmit={handleAnswerSubmit} />
                </div>
            </div>
            {showTime ? (
                <div>
                    <p>Calculating results...</p>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default TestSection;
