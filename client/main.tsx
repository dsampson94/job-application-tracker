import '/client/main.css';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../imports/ui/App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRobot, faFilePdf } from '@fortawesome/free-solid-svg-icons';

library.add(faRobot, faFilePdf);

Meteor.startup(() => {
    const container = document.getElementById('react-target');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
});
