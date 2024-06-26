import React, { useState } from 'react';
import Layout from './Layout';
import JobApplicationsTable from './JobApplicationsTable';
import JobApplicationsKanban from './JobApplicationsKanban';
import DataControlModal from './DataControlModal';
import JobApplicationModal from './JobApplicationModal';
import { JobApplication } from '../api/jobApplications';

const JobApplicationsDashboard: React.FC = () => {
    const [isDataControlModalOpen, setIsDataControlModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [isJobApplicationModalOpen, setIsJobApplicationModalOpen] = useState(false);
    const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);

    const handleOpenModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsJobApplicationModalOpen(true);
    };

    return (
        <Layout>
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold mb-4">Job Applications</h1>
                <div>
                    <button
                        onClick={() => setIsDataControlModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-blue-400 hover:border-blue-400 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        Data Control
                    </button>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 border-2 border-transparent hover:bg-blue-400 hover:border-blue-400 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        Create New
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
                        className="bg-blue-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-blue-400 hover:border-blue-400 active:bg-transparent active:text-blue-500 active:border-blue-500"
                    >
                        {viewMode === 'table' ? 'Switch to Kanban' : 'Switch to Table'}
                    </button>
                </div>
            </div>
            {viewMode === 'table' ?
                <JobApplicationsTable onOpenModal={handleOpenModal} /> :
                <JobApplicationsKanban onOpenModal={handleOpenModal} />
            }
            {isDataControlModalOpen && (
                <DataControlModal onClose={() => setIsDataControlModalOpen(false)} />
            )}
            {isJobApplicationModalOpen && (
                <JobApplicationModal
                    jobApplication={selectedJobApplication}
                    onClose={() => setIsJobApplicationModalOpen(false)}
                />
            )}
        </Layout>
    );
};

export default JobApplicationsDashboard;
