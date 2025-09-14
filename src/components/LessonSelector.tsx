import React, { useState } from 'react';
import { Play, BookOpen, Clock, Filter, Search } from 'lucide-react';

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

interface LessonSelectorProps {
    onLessonSelect: (lesson: Lesson) => void;
    lessons: Lesson[]; // Now accepts lessons as a prop
}

export default function LessonSelector({ onLessonSelect, lessons }: LessonSelectorProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [selectedTopic, setSelectedTopic] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const difficulties = ['All', 'Easy', 'Medium', 'Advanced'];
    const topics = ['All', ...Array.from(new Set(lessons.map(lesson => lesson.topic)))];

    const filteredLessons = lessons
        .filter(lesson => 
            lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(lesson => {
            const difficultyMatch = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
            const topicMatch = selectedTopic === 'All' || lesson.topic === selectedTopic;
            return difficultyMatch && topicMatch;
        });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Learning Lessons</h2>
                        <p className="text-gray-600">Choose a lesson to start your learning journey</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search lessons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>
                        
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {topics.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                    <div
                        key={lesson.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => onLessonSelect(lesson)}
                    >
                        <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </div>
                            </div>
                            
                            {lesson.completed && (
                                <div className="absolute top-3 right-3">
                                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        ✓ Completed
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(lesson.difficulty)}`}>
                                    {lesson.difficulty}
                                </span>
                                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{lesson.duration}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                {lesson.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {lesson.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-blue-600 text-sm">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{lesson.topic}</span>
                                </div>
                                
                                <button className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-200 group-hover:scale-105">
                                    <Play className="w-4 h-4" />
                                    <span>Start</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredLessons.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more lessons</p>
                </div>
            )}
        </div>
    );
}