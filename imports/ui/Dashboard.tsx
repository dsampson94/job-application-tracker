import React from 'react';
import Layout from './Layout';
import JobApplicationsKanban from './JobApplicationsKanban';

const Dashboard: React.FC = () => {
    return (
        <Layout>
            <JobApplicationsKanban />
        </Layout>
    );
};

export default Dashboard;
