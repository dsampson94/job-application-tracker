import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import JobApplicationsDashboard from './JobApplicationsDashboard';
import Profile from './Profile';
import Metrics from './Metrics';

const App: React.FC = () => {
    const user = useTracker(() => Meteor.user());

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/applications" /> : <Login />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
                <Route path="/applications" element={user ? <JobApplicationsDashboard /> : <Navigate to="/" />} />
                <Route path="/metrics" element={user ? <Metrics /> : <Navigate to="/" />} />
            </Routes>
            <ToastContainer />
        </Router>
    );
};

export default App;
