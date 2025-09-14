// src/components/QuizPage.tsx

import React, { useState } from 'react';
import { BookOpen, Trophy, Filter, ArrowRight, ArrowLeft } from 'lucide-react'; // Added ArrowLeft here
import QuizInterface from './QuizInterface';

// ... rest of the component code
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

interface QuizPageProps {
  questionsData: Question[];
  onQuizComplete: (xpGained: number) => void;
  onBack: () => void;
}

export default function QuizPage({ questionsData, onQuizComplete, onBack }: QuizPageProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);

  const difficulties = ['All', 'Easy', 'Medium', 'Advanced'];
  const topics = ['All', ...Array.from(new Set(questionsData.map(q => q.topic)))];

  const filteredQuizzes = questionsData.filter(q => {
    const difficultyMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const topicMatch = selectedTopic === 'All' || q.topic === selectedTopic;
    return difficultyMatch && topicMatch;
  });

  const uniqueQuizzes = Array.from(new Set(filteredQuizzes.map(q => `${q.topic}-${q.difficulty}`)))
    .map(combo => {
      const [topic, difficulty] = combo.split('-');
      return { topic, difficulty };
    });

  const handleStartQuiz = (topic: string, difficulty: string) => {
    const questionsForQuiz = questionsData
      .filter(q => q.topic === topic && q.difficulty === difficulty)
      .slice(0, 5); // Take first 5 questions for the quiz
    
    if (questionsForQuiz.length > 0) {
      setQuizQuestions(questionsForQuiz);
    } else {
      alert('No questions found for this topic and difficulty.');
    }
  };

  const handleQuizCompletion = (score: number, earnedXP: number) => {
    onQuizComplete(earnedXP);
    setQuizQuestions(null); // Reset to show the filter page again
  };

  if (quizQuestions) {
    return (
      <QuizInterface
        questions={quizQuestions}
        onQuizComplete={handleQuizCompletion}
        isUnlocked={true} // Quizzes on this page are always unlocked
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Center</h2>
          <p className="text-gray-600">Select a topic and difficulty to start a quiz.</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Quizzes ({uniqueQuizzes.length})</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueQuizzes.length > 0 ? (
          uniqueQuizzes.map((quiz, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{quiz.topic}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              <button
                onClick={() => handleStartQuiz(quiz.topic, quiz.difficulty)}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                <span>Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No quizzes available for these filters.</p>
        )}
      </div>
    </div>
  );
}