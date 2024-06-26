import React from 'react';
import { Meteor } from 'meteor/meteor';

const LogoutButton: React.FC = () => (
    <button
        onClick={() => Meteor.logout()}
        className="bg-red-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-red-400 hover:border-red-400 active:bg-transparent active:text-red-500 active:border-red-500"
    >
        Log Out
    </button>
);

export default LogoutButton;
