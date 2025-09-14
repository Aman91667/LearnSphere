import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface SignupProps {
    onSignup: (user: User) => void;
    onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this data to a backend to create a new user.
        // For now, we'll simulate a successful signup.
        if (name && email && password) {
            onSignup({ name, email });
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
                <div className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-green-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">sign in with an existing account</button>
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}