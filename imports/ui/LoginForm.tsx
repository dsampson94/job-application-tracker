import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="mb-2 p-2 border border-gray-300 rounded"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-2 p-2 border border-gray-300 rounded"
            />
            <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Sign Up
            </button>
            <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">
                Log In
            </button>
        </div>
    );
};

export default LoginForm;
