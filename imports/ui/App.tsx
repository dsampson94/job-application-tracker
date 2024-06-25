import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
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
            <Switch>
                <Route exact path="/">
                    {<Login />}
                </Route>
                <Route path="/profile">
                    {user ? <Profile /> : <Redirect to="/" />}
                </Route>
                <Route path="/applications">
                    {user ? <JobApplicationsDashboard /> : <Redirect to="/" />}
                </Route>
                <Route path="/metrics">
                    {user ? <Metrics /> : <Redirect to="/" />}
                </Route>
            </Switch>
            <ToastContainer />
        </Router>
    );
};

export default App;
