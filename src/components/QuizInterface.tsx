import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb, Trophy, ArrowRight } from 'lucide-react';

interface Question {
  question_id: number;
  topic: string;
  difficulty: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  hint: string;
  explanation: string;
}

interface QuizInterfaceProps {
  questions: Question[];
  onQuizComplete: (score: number, earnedXP: number) => void;
  isUnlocked: boolean;
}

export default function QuizInterface({ questions, onQuizComplete, isUnlocked }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    setShowResult(false);
    setShowHint(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setShowHint(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correct_option
    ).length;
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const earnedXP = calculateXP(score);
    
    setQuizCompleted(true);
    onQuizComplete(score, earnedXP);
  };

  const calculateXP = (score: number) => {
    if (score >= 90) return 100;
    if (score >= 80) return 75;
    if (score >= 70) return 50;
    if (score >= 60) return 25;
    return 10;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isUnlocked) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Locked</h3>
        <p className="text-gray-600">Complete at least 80% of the video to unlock the quiz</p>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correct_option
    ).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
        <div className={`text-4xl font-bold mb-4 ${getScoreColor(score)}`}>
          {score}%
        </div>
        <p className="text-gray-600 mb-6">
          You got {correctAnswers} out of {totalQuestions} questions correct
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">+{calculateXP(score)} XP</span>
          </div>
          {score >= 80 && (
            <div className="bg-yellow-50 px-3 py-2 rounded-lg">
              <span className="text-yellow-600 font-semibold">🏆 High Achiever</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correct_option;
  const options = [
    { label: 'A', text: currentQuestion.option_a },
    { label: 'B', text: currentQuestion.option_b },
    { label: 'C', text: currentQuestion.option_c },
    { label: 'D', text: currentQuestion.option_d },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="font-semibold">AI Quiz Challenge</h3>
            <p className="text-sm opacity-90">{currentQuestion.topic}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Question</p>
            <p className="font-bold">{currentQuestionIndex + 1} / {totalQuestions}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Hint</span>
            </button>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h4>

          {showHint && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-blue-800 text-sm">💡 {currentQuestion.hint}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleAnswerSelect(option.label)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option.label
                  ? showResult
                    ? option.label === currentQuestion.correct_option
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : showResult && option.label === currentQuestion.correct_option
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selectedAnswer === option.label
                      ? showResult
                        ? option.label === currentQuestion.correct_option
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : showResult && option.label === currentQuestion.correct_option
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.label}
                  </span>
                  <span className="text-gray-900">{option.text}</span>
                </div>
                
                {showResult && (
                  <>
                    {option.label === currentQuestion.correct_option && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {selectedAnswer === option.label && option.label !== currentQuestion.correct_option && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 ml-auto"
            >
              <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
