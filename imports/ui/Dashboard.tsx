import React, { useState } from 'react';
import Layout from './Layout';
import JobApplicationsKanban from './JobApplicationsKanban';
import DataControlModal from './DataControlModal';

const Dashboard: React.FC = () => {
    const [isDataControlModalOpen, setIsDataControlModalOpen] = useState(false);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold pb-2">Job Applications</h1>
                <div>
                    <button
                        onClick={() => setIsDataControlModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Data Control
                    </button>
                    <button
                        onClick={() => {/* logic to open the job application modal */}}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create New
                    </button>
                </div>
            </div>
            <JobApplicationsKanban />
            {isDataControlModalOpen && (
                <DataControlModal onClose={() => setIsDataControlModalOpen(false)} />
            )}
        </Layout>
    );
};

export default Dashboard;
