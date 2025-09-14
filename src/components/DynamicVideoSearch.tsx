import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

// New interfaces for the quiz and question data from a dynamic source
interface GeneratedQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizProps {
    videoTitle: string;
    questions: GeneratedQuestion[];
    onBack: () => void;
    onQuizComplete: (xpGained: number) => void;
}

export default function Quiz({ videoTitle, questions, onBack, onQuizComplete }: QuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const handleAnswerSelect = (index: number) => {
        if (!showResult) {
            setSelectedAnswer(index);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        setShowResult(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setShowResult(false);
        setSelectedAnswer(null);
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            completeQuiz();
        }
    };

    const completeQuiz = () => {
        const calculatedScore = (score / totalQuestions) * 100;
        const earnedXP = Math.floor(calculatedScore / 10);
        
        onQuizComplete(earnedXP);
        setQuizCompleted(true);
    };

    const getScoreColor = (finalScore: number) => {
        if (finalScore >= 80) return 'text-green-600';
        if (finalScore >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (quizCompleted) {
        const finalScore = (score / totalQuestions) * 100;
        const earnedXP = Math.floor(finalScore / 10);

        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                <div className={`text-4xl font-bold mb-4 ${getScoreColor(finalScore)}`}>
                    {finalScore.toFixed(0)}%
                </div>
                <p className="text-gray-600 mb-6">
                    You got {score} out of {totalQuestions} questions correct.
                </p>
                <p className="text-sm font-semibold text-blue-600">
                    You earned {earnedXP} XP.
                </p>
                <button
                    onClick={onBack}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Back to Search
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <button onClick={onBack} className="mb-4 text-blue-600 hover:text-blue-800 font-medium">
                &larr; Back to Search
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quiz for "{videoTitle}"</h2>
            <p className="text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / totalQuestions) * 100}%` }}
                />
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                selectedAnswer === index
                                    ? showResult
                                        ? index === currentQuestion.correctAnswer
                                            ? 'bg-green-100 border-green-500'
                                            : 'bg-red-100 border-red-500'
                                        : 'bg-blue-50 border-blue-500'
                                    : showResult && index === currentQuestion.correctAnswer
                                        ? 'bg-green-100 border-green-500'
                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <span className="font-medium text-gray-900">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            {showResult && (
                <div className={`p-4 rounded-lg mb-6 ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center space-x-2">
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`font-semibold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{currentQuestion.explanation}</p>
                </div>
            )}

            <div className="flex justify-end">
                {showResult ? (
                    <button
                        onClick={handleNextQuestion}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}