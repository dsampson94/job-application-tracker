import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Layout from './Layout';
import { JobApplications, JobApplication } from '../api/jobApplications';
import JobApplicationModal from './JobApplicationModal';
import InsightsModal from './InsightsModal';

const JobApplicationsTable: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

    const { jobApplications, isLoading } = useTracker(() => {
        const handle = Meteor.subscribe('jobApplications');
        return {
            jobApplications: JobApplications.find().fetch(),
            isLoading: !handle.ready(),
        };
    });

    const handleRemove = (jobApplicationId: string) => {
        Meteor.call('jobApplications.remove', jobApplicationId);
    };

    const handleOpenModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsModalOpen(true);
    };

    const handleOpenInsightsModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsInsightsModalOpen(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="text-center">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold pb-2">Job Applications</h1>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create New
                    </button>
                </div>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2">Company</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Job Spec</th>
                        <th className="py-2">CV</th>
                        <th className="py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobApplications.map((jobApplication) => (
                        <tr key={jobApplication._id}>
                            <td className="border px-4 py-2">{jobApplication.company}</td>
                            <td className="border px-4 py-2">{jobApplication.role}</td>
                            <td className="border px-4 py-2">{jobApplication.status}</td>
                            <td className="border px-4 py-2">{jobApplication.jobSpecName || 'N/A'}</td>
                            <td className="border px-4 py-2">{jobApplication.cvName || 'N/A'}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleOpenModal(jobApplication)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleRemove(jobApplication._id!)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleOpenInsightsModal(jobApplication)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Insights
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <JobApplicationModal
                    jobApplication={selectedJobApplication}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            {isInsightsModalOpen && (
                <InsightsModal
                    jobApplication={selectedJobApplication}
                    onClose={() => setIsInsightsModalOpen(false)}
                />
            )}
        </Layout>
    );
};

export default JobApplicationsTable;
