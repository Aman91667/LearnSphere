import React from 'react';
import { Trophy, Star, Target, TrendingUp, Book, Award, CheckCircle } from 'lucide-react';

interface UserProgress {
  totalXP: number;
  completedLessons: number;
  averageScore: number;
  badges: string[];
  streakDays: number;
  level: number;
}

interface ProgressTrackerProps {
  progress: UserProgress;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const { totalXP, completedLessons, averageScore, badges, streakDays, level } = progress;
  
  const nextLevelXP = (level + 1) * 1000;
  const currentLevelXP = (level) * 1000; // Correcting to base level XP
  const progressToNextLevel = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const achievementBadges = [
    { name: 'First Steps', icon: '🎯', earned: completedLessons >= 1, description: 'Complete your first lesson' },
    { name: 'Quiz Master', icon: '🧠', earned: averageScore >= 80, description: 'Maintain 80%+ average score' },
    { name: 'Dedicated Learner', icon: '🔥', earned: streakDays >= 7, description: 'Learn for 7 days straight' },
    { name: 'AI Expert', icon: '🤖', earned: completedLessons >= 10, description: 'Complete 10 lessons' },
    { name: 'Perfect Score', icon: '💯', earned: badges.includes('Perfect Score'), description: 'Score 100% on a quiz' },
    { name: 'Knowledge Seeker', icon: '📚', earned: completedLessons >= 25, description: 'Complete 25 lessons' },
  ];

  const stats = [
    { label: 'Total XP', value: totalXP.toLocaleString(), icon: Star, color: 'text-yellow-600' },
    { label: 'Lessons Completed', value: completedLessons, icon: Book, color: 'text-blue-600' },
    { label: 'Average Score', value: `${averageScore}%`, icon: Target, color: 'text-green-600' },
    { label: 'Learning Streak', value: `${streakDays} days`, icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Level {level}</h3>
            <p className="text-gray-600">AI Learning Expert</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{totalXP}</p>
            <p className="text-sm text-gray-500">Total XP</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress to Level {level + 1}</span>
            <span className="font-semibold">{Math.round(progressToNextLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{currentLevelXP} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Award className="w-6 h-6 text-yellow-600" />
          <span>Achievements</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementBadges.map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                badge.earned
                  ? 'border-yellow-300 bg-yellow-50 shadow-sm'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className={`font-semibold mb-1 ${
                  badge.earned ? 'text-yellow-700' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-600">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Earned
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Completed AI Ethics Quiz</p>
              <p className="text-sm text-gray-500">Scored 85% • +75 XP</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Book className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Watched Neural Networks Video</p>
              <p className="text-sm text-gray-500">100% completion • +25 XP</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Earned "Quiz Master" Badge</p>
              <p className="text-sm text-gray-500">Maintained 80%+ average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}