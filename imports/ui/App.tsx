import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import Dashboard from './Dashboard';
import JobApplicationsTable from './JobApplicationsTable';
import Profile from './Profile';

const App: React.FC = () => {
    const user = useTracker(() => Meteor.user());

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            </Routes>
            <ToastContainer />
        </Router>
    );
};

export default App;
