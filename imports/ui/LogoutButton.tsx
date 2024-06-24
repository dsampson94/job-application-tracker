import React from 'react';
import { Meteor } from 'meteor/meteor';

const LogoutButton: React.FC = () => (
    <button onClick={() => Meteor.logout()} className="bg-red-500 text-white px-4 py-2 rounded">
        Log Out
    </button>
);

export default LogoutButton;
