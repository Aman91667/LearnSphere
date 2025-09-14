import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import QuizInterface from './QuizInterface';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  topic: string;
  videoUrl: string;
  completed: boolean;
}

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

interface LessonViewProps {
  lesson: Lesson;
  questions: Question[];
  onBack: () => void;
  onProgressUpdate: (xpGained: number) => void;
}

export default function LessonView({ lesson, questions, onBack, onProgressUpdate }: LessonViewProps) {
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    onProgressUpdate(25);
  };

  const handleQuizComplete = (score: number, earnedXP: number) => {
    setQuizCompleted(true);
    onProgressUpdate(earnedXP);
  };

  const lessonQuestions = questions
    .filter(q => q.topic.toLowerCase().includes(lesson.topic.toLowerCase()) || 
                 q.topic === lesson.topic)
    .filter(q => q.difficulty.toLowerCase() === lesson.difficulty.toLowerCase())
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              lesson.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {lesson.difficulty}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              videoCompleted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              <span className="text-sm font-bold">1</span>
            </div>
            <span className={`text-sm font-medium ${
              videoCompleted ? 'text-green-600' : 'text-blue-600'
            }`}>
              Watch Video
            </span>
          </div>
          
          <div className={`flex-1 h-0.5 ${videoCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
          
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              quizCompleted ? 'bg-green-500 text-white' :
              videoCompleted ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
            }`}>
              <span className="text-sm font-bold">2</span>
            </div>
            <span className={`text-sm font-medium ${
              quizCompleted ? 'text-green-600' :
              videoCompleted ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Take Quiz
            </span>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer
        videoUrl={lesson.videoUrl}
        onVideoComplete={handleVideoComplete}
        isCompleted={videoCompleted}
        title={lesson.title} // This is the line to add
      />

      {/* Quiz Section */}
      <QuizInterface
        questions={lessonQuestions}
        onQuizComplete={handleQuizComplete}
        isUnlocked={videoCompleted}
      />
    </div>
  );
}