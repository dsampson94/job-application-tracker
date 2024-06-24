import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSignup = () => {
        Accounts.createUser({ email, password }, (err) => {
            if (err) alert(err.message);
        });
    };

    const handleLogin = () => {
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) alert(err.message);
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Job Application Tracker</h1>
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />
                <button
                    onClick={isLogin ? handleLogin : handleSignup}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-blue-500 hover:underline"
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
