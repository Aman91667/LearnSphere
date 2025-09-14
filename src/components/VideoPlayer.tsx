import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
    videoUrl: string;
    onVideoComplete: () => void;
    isCompleted: boolean;
    title: string;
}

export default function VideoPlayer({ videoUrl, onVideoComplete, isCompleted, title }: VideoPlayerProps) {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : '';

    // Effect to control the video playback via the YouTube Player API
    useEffect(() => {
        const handlePlayerStateChange = (event: MessageEvent) => {
            if (event.origin !== 'https://www.youtube.com' || event.data.event === 'info') {
                return;
            }

            const data = JSON.parse(event.data);
            if (data.event === 'onStateChange') {
                const state = data.info;
                if (state === 1) { // 1 is for playing
                    setIsPlaying(true);
                } else if (state === 2) { // 2 is for paused
                    setIsPlaying(false);
                } else if (state === 0) { // 0 is for ended
                    setIsPlaying(false);
                }
            }
        };

        window.addEventListener('message', handlePlayerStateChange);

        return () => {
            window.removeEventListener('message', handlePlayerStateChange);
        };
    }, []);

    // Effect to handle progress and video completion
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !isCompleted) {
            interval = setInterval(() => {
                setWatchTime(prev => {
                    const newTime = prev + 1;
                    const newProgress = Math.min((newTime / 180) * 100, 100);
                    setProgress(newProgress);
                    
                    if (newProgress >= 80 && !isCompleted) {
                        onVideoComplete();
                    }
                    
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isCompleted, onVideoComplete]);

    const postPlayerMessage = (action: string) => {
        if (iframeRef.current && embedUrl) {
            iframeRef.current.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: action }), 
                'https://www.youtube.com'
            );
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            postPlayerMessage('pauseVideo');
        } else {
            postPlayerMessage('playVideo');
        }
        setIsPlaying(!isPlaying);
    };

    const handleRestart = () => {
        postPlayerMessage('seekTo');
        setProgress(0);
        setWatchTime(0);
        setIsPlaying(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative aspect-video bg-gray-900">
                {embedUrl ? (
                    <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Learning Video"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white">
                            <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-lg font-medium">Invalid Video URL</p>
                            <p className="text-sm opacity-75">Please enter a valid YouTube URL</p>
                        </div>
                    </div>
                )}
                
                {isCompleted && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                            <CheckCircle className="w-16 h-16 mx-auto mb-3 text-green-400" />
                            <p className="text-xl font-bold">Video Completed!</p>
                            <p className="text-sm opacity-90">Quiz is now unlocked</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePlayPause}
                            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </button>
                        <button
                            onClick={handleRestart}
                            className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Watch time: {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}</span>
                        <span>{progress >= 80 ? 'Quiz Unlocked!' : `${Math.max(0, 80 - Math.round(progress))}% more to unlock quiz`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}