import React from 'react';
import { GraduationCap, User, Trophy, BookOpen, LogOut, LogIn, CircleQuestionMark, Search } from 'lucide-react';

interface NavbarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    userXP: number;
    userName: string;
    onLogout: () => void;
    onLoginClick: () => void;
}

export default function Navbar({ currentView, onViewChange, userXP, userName, onLogout, onLoginClick }: NavbarProps) {
    const isUserLoggedIn = userName !== 'Guest' && userName !== 'AI Learner';

    const navItems = [
        { id: 'lessons', label: 'Lessons', icon: BookOpen },
        { id: 'search', label: 'Search', icon: Search },
        { id: 'quiz', label: 'Quiz', icon: CircleQuestionMark },
        { id: 'progress', label: 'Progress', icon: Trophy },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* The clickable logo section */}
                    <button 
                        onClick={() => onViewChange('lessons')}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Bolt Learning</h1>
                            <p className="text-xs text-gray-500">AI-Powered Education</p>
                        </div>
                    </button>

                    <div className="flex items-center space-x-6">
                        {isUserLoggedIn && (
                            <div className="hidden md:flex items-center space-x-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onViewChange(item.id)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                currentView === item.id
                                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-3">
                            {isUserLoggedIn ? (
                                <>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                                        <p className="text-xs text-blue-600 font-semibold">{userXP} XP</p>
                                    </div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center space-x-1 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {isUserLoggedIn && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="flex justify-around py-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onViewChange(item.id)}
                                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                                            currentView === item.id
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs mt-1">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}