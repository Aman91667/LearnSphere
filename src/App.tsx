import React, { useState, useEffect, useCallback } from 'react';

// --- Interface Definitions ---
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

interface UserProgress {
  totalXP: number;
  completedLessons: number;
  averageScore: number;
  badges: string[];
  streakDays: number;
  level: number;
}

interface User {
  name: string;
  email: string;
  userId: string;
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AnalyzedVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  keyPoints: string[];
  suggestedQuestions: GeneratedQuestion[];
}

// Data
const lessonsData: Lesson[] = [
  { id: '1', title: 'Grammar Fundamentals', description: 'Master the basic rules of English grammar and sentence structure', duration: '15 min', difficulty: 'Easy', topic: 'English', videoUrl: 'https://www.youtube.com/watch?v=0GVExpdmoDs', completed: false },
  { id: '2', title: 'Advanced Vocabulary Building', description: 'Expand your vocabulary with complex words and their usage', duration: '18 min', difficulty: 'Medium', topic: 'English', videoUrl: 'https://www.youtube.com/watch?v=1qdGvfqQWR0', completed: false },
  { id: '3', title: 'Literary Analysis Techniques', description: 'Learn to analyze literature with advanced critical thinking skills', duration: '22 min', difficulty: 'Advanced', topic: 'English', videoUrl: 'https://www.youtube.com/watch?v=D6pv0sXM3ZM', completed: false },
  { id: '4', title: 'Introduction to Physics', description: 'Explore the fundamental concepts of motion, force, and energy', duration: '16 min', difficulty: 'Easy', topic: 'Science', videoUrl: 'https://www.youtube.com/watch?v=wHC245cVdHw', completed: false },
  { id: '5', title: 'Chemical Reactions', description: 'Understanding how atoms and molecules interact in chemical processes', duration: '19 min', difficulty: 'Medium', topic: 'Science', videoUrl: 'https://www.youtube.com/watch?v=a9RJZqG9qJo', completed: false },
  { id: '6', title: 'Advanced Biology: Cell Structure', description: 'Deep dive into cellular biology and molecular processes', duration: '25 min', difficulty: 'Advanced', topic: 'Science', videoUrl: 'https://www.youtube.com/watch?v=qT1Q284J-2M', completed: false },
  { id: '7', title: 'Basic Arithmetic Operations', description: 'Master addition, subtraction, multiplication, and division', duration: '12 min', difficulty: 'Easy', topic: 'Maths', videoUrl: 'https://www.youtube.com/watch?v=EwOUmojITss', completed: false },
  { id: '8', title: 'Algebra and Equations', description: 'Solve linear and quadratic equations with confidence', duration: '20 min', difficulty: 'Medium', topic: 'Maths', videoUrl: 'https://www.youtube.com/watch?v=mhWEgeEIzY4', completed: false },
  { id: '9', title: 'Calculus: Derivatives and Integrals', description: 'Advanced mathematical concepts for understanding rates of change', duration: '28 min', difficulty: 'Advanced', topic: 'Maths', videoUrl: 'https://www.youtube.com/watch?v=xeABU9GOKG4', completed: false },
  { id: '10', title: 'World Geography Basics', description: 'Learn about continents, countries, and major landmarks', duration: '14 min', difficulty: 'Easy', topic: 'General Knowledge', videoUrl: 'https://www.youtube.com/watch?v=Q1Sd-qMx5dM', completed: false },
  { id: '11', title: 'World History: Major Events', description: 'Explore significant historical events that shaped our world', duration: '21 min', difficulty: 'Medium', topic: 'General Knowledge', videoUrl: 'https://www.youtube.com/watch?v=RteoSNcY0Y4', completed: false },
  { id: '12', title: 'Current Affairs and Global Politics', description: 'Understanding modern political systems and international relations', duration: '24 min', difficulty: 'Advanced', topic: 'General Knowledge', videoUrl: 'https://www.youtube.com/watch?v=1F_45p7G7Gk', completed: false },
];

const questionsData: GeneratedQuestion[] = [
  { question: "What is a verb?", options: ["A person, place or thing", "An action word", "A word that describes a noun", "A joining word"], correctAnswer: 1, explanation: "A verb is a word that describes an action, state, or occurrence." },
  { question: "What is a noun?", options: ["An action word", "A word that describes a verb", "A person, place, or thing", "A word that joins sentences"], correctAnswer: 2, explanation: "A noun is a word that refers to a person, place, thing, or idea." },
  { question: "What is a pronoun?", options: ["A word that describes an adjective", "A word that replaces a noun", "A word that describes an action", "A word that joins clauses"], correctAnswer: 1, explanation: "A pronoun is a word used to take the place of a noun or noun phrase." },
  { question: "What is an adverb?", options: ["A word that describes a noun", "A word that describes a verb or an adjective", "A word that describes a person", "A word that expresses a feeling"], correctAnswer: 1, explanation: "An adverb is a word or phrase that modifies or qualifies an adjective, verb, or other adverb." },
];

// --- Sub-components (Moved to top of file for single-file mandate) ---
const Navbar = ({ currentView, onViewChange, userXP, userName, onLogout }) => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <a href="#" className="flex-shrink-0 text-xl font-bold text-gray-800">AI Learner</a>
        </div>
        <div className="flex-1 flex justify-center space-x-4">
          <button onClick={() => onViewChange('lessons')} className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'lessons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Lessons</button>
          <button onClick={() => onViewChange('progress')} className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Progress</button>
          <button onClick={() => onViewChange('search')} className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Video Quiz</button>
          <button onClick={() => onViewChange('quiz')} className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Quiz</button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">XP: {userXP}</span>
          <span className="text-gray-700 text-sm font-medium hidden sm:block">Hello, {userName}</span>
          <button onClick={onLogout} className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">Logout</button>
        </div>
      </div>
    </div>
  </nav>
);

const LessonSelector = ({ onLessonSelect, lessons }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Lessons</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map(lesson => (
        <div key={lesson.id} onClick={() => onLessonSelect(lesson)} className="cursor-pointer bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
          <p className="text-gray-600 mt-2">{lesson.description}</p>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>{lesson.difficulty}</span>
            <span>{lesson.duration}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LessonView = ({ lesson, questions, onBack, onProgressUpdate }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleCompleteLesson = () => {
    onProgressUpdate(100);
    // Use a custom modal instead of alert
    alert('Lesson Completed! You gained 100 XP.');
    onBack();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">&larr; Back to Lessons</button>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
      <p className="text-gray-600 mb-6">{lesson.description}</p>
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          className="rounded-lg w-full h-96"
          src={`https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setShowQuiz(true)} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">Take Quiz</button>
        <button onClick={handleCompleteLesson} className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200">Mark as Completed</button>
      </div>
      {showQuiz && <QuizPage questionsData={questions} onQuizComplete={onProgressUpdate} onBack={() => setShowQuiz(false)} />}
    </div>
  );
};

const ProgressTracker = ({ progress }) => {
  const { totalXP, completedLessons, level, streakDays } = progress;
  const progressPercentage = (totalXP % 1000) / 1000 * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Progress</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800">Total XP</h3>
            <p className="text-2xl font-bold text-blue-600">{totalXP}</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-800">Level</h3>
            <p className="text-2xl font-bold text-purple-600">{level}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress to Next Level</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {totalXP % 1000} XP
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-2xl font-bold text-green-600">{completedLessons}</p>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-2xl font-bold text-orange-600">{streakDays}</p>
            <p className="text-sm text-gray-600">Daily Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Mock API call to backend for login
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      onLogin(data.user);

    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-blue-600 font-medium hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Mock API call to backend for signup
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Email already in use or password too weak.');
      }

      const data = await response.json();
      onSignup(data.user);

    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 font-medium hover:underline">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

const DynamicVideoSearch = ({ onVideoAnalyzed }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyzeVideo = async () => {
    setError('');
    setIsLoading(true);

    try {
      // This is the actual fetch call to your backend at localhost:5000
      const response = await fetch('http://localhost:5000/api/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze video. Please check the URL.');
      }

      const data = await response.json();
      
      onVideoAnalyzed({
        ...data,
        id: videoUrl.split('v=')[1]
      });

    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyze a Video</h1>
      <p className="text-gray-600 mb-6">Enter a YouTube video URL to get key points and a custom quiz.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="e.g., https://www.youtube.com/watch?v=..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAnalyzeVideo}
          disabled={isLoading || !videoUrl}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Video'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

const QuizPage = ({ questionsData, onQuizComplete, onBack, videoTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const questions = questionsData || [];

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="text-gray-600 mb-6">Please analyze a video to generate a quiz or select a lesson with a pre-defined quiz.</p>
        <button onClick={onBack} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Go Back</button>
      </div>
    );
  }

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
      const xpGained = score * 50;
      onQuizComplete(xpGained);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-700">You scored {score} out of {questions.length}</p>
        <p className="text-sm text-gray-500 mt-2">You gained {score * 50} XP!</p>
        <button onClick={onBack} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Back to Lessons</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = selectedOption !== null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">&larr; Go Back</button>
      {videoTitle && <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz for: {videoTitle}</h1>}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-lg font-semibold text-gray-800 mb-4">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isAnswered && handleOptionClick(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-colors duration-200
                ${isAnswered ?
                  (index === currentQuestion.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' :
                   (index === selectedOption ? 'bg-red-100 border-red-500 text-red-800' : 'bg-gray-100 border-gray-300 text-gray-700'))
                  : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {showExplanation && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
          <h3 className="text-sm font-semibold text-yellow-800">Explanation:</h3>
          <p className="text-sm text-yellow-700 mt-1">{currentQuestion.explanation}</p>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [currentView, setCurrentView] = useState('lessons');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [isSignupView, setIsSignupView] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    completedLessons: 0,
    averageScore: 0,
    badges: [],
    streakDays: 1,
    level: 1,
  });
  const [analyzedVideo, setAnalyzedVideo] = useState<AnalyzedVideo | null>(null);

  // Load user from local storage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProgress = localStorage.getItem('userProgress');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    }
  }, []);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setIsSignupView(false);
    setCurrentView('lessons');
  }, []);

  const handleSignup = useCallback((signedUpUser: User) => {
    setUser(signedUpUser);
    localStorage.setItem('user', JSON.stringify(signedUpUser));
    setIsSignupView(false);
    setCurrentView('lessons');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('lessons');
  }, []);

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
  }, []);

  const handleBackToLessons = useCallback(() => {
    setSelectedLesson(null);
    setCurrentView('lessons');
  }, []);

  const handleProgressUpdate = useCallback(async (xpGained: number) => {
    if (!user) return;
    
    // Create new progress object based on current state
    const newProgress = {
      ...userProgress,
      totalXP: userProgress.totalXP + xpGained,
    };
    
    // Update level based on XP
    const newLevel = Math.floor(newProgress.totalXP / 1000) + 1;
    newProgress.level = newLevel;

    // Mock API call to update progress on the backend
    console.log('Mock API call to update progress:', newProgress);
    await fetch(`http://localhost:5000/api/progress/${user.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProgress),
    });

    setUserProgress(newProgress);
    localStorage.setItem('userProgress', JSON.stringify(newProgress));

  }, [user, userProgress]);

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view);
    setSelectedLesson(null);
    setAnalyzedVideo(null);
  }, []);

  const handleVideoAnalyzed = useCallback((video: AnalyzedVideo) => {
    setAnalyzedVideo(video);
    setCurrentView('quiz');
  }, []);

  if (!user) {
    if (isSignupView) {
      return <Signup onSignup={handleSignup} onSwitchToLogin={() => setIsSignupView(false)} />;
    } else {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setIsSignupView(true)} />;
    }
  }

  const renderLoggedInView = () => {
    switch (currentView) {
      case 'lessons':
        return <LessonSelector onLessonSelect={handleLessonSelect} lessons={lessonsData} />;
      case 'lesson':
        return selectedLesson ? (
          <LessonView
            lesson={selectedLesson}
            questions={questionsData}
            onBack={handleBackToLessons}
            onProgressUpdate={handleProgressUpdate}
          />
        ) : null;
      case 'progress':
        return <ProgressTracker progress={userProgress} />;
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
            <p className="text-gray-600 mb-6">Level {userProgress.level} AI Learner</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{userProgress.totalXP}</p>
                <p className="text-sm text-gray-600">Total XP</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{userProgress.completedLessons}</p>
                <p className="text-sm text-gray-600">Lessons</p>
              </div>
            </div>
          </div>
        );
      case 'search':
        return <DynamicVideoSearch onVideoAnalyzed={handleVideoAnalyzed} />;
      case 'quiz':
        return analyzedVideo ? (
          <QuizPage
            videoTitle={analyzedVideo.title}
            questionsData={analyzedVideo.suggestedQuestions}
            onBack={() => handleViewChange('search')}
            onQuizComplete={(xpGained) => {
              handleProgressUpdate(xpGained);
              setAnalyzedVideo(null); // Clear the video to go back to the search page
            }}
          />
        ) : (
          <QuizPage 
            questionsData={questionsData} 
            onQuizComplete={handleProgressUpdate} 
            onBack={() => handleViewChange('lessons')} 
          />
        );
      default:
        return <LessonSelector onLessonSelect={handleLessonSelect} lessons={lessonsData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        userXP={userProgress.totalXP}
        userName={user?.name || 'Loading...'}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderLoggedInView()}
      </main>
    </div>
  );
}

export default App;
