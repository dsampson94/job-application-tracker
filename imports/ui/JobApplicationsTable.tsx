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

    const { jobApplications, user, isLoading } = useTracker(() => {
        const handle = Meteor.subscribe('jobApplications');
        const userHandle = Meteor.subscribe('userCVs');
        return {
            jobApplications: JobApplications.find().fetch(),
            user: Meteor.user(),
            isLoading: !handle.ready() || !userHandle.ready(),
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

    const getCvUrl = (cvName: string) => {
        const cv = user?.profile?.cvs.find((cv: { name: string }) => cv.name === cvName);
        return cv ? cv.url : null;
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
                        <th className="py-2 max-w-xs">Company</th>
                        <th className="py-2 max-w-xs">Role</th>
                        <th className="py-2 max-w-xs">Status</th>
                        <th className="py-2 max-w-xs">Job Spec</th>
                        <th className="py-2 max-w-xs">CV</th>
                        <th className="py-2 max-w-xs">Tags</th>
                        <th className="py-2 max-w-xs">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobApplications.map((jobApplication) => (
                        <tr key={jobApplication._id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.company}</td>
                            <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.role}</td>
                            <td className="border px-4 py-2 max-w-xs truncate">{jobApplication.status}</td>
                            <td className="border px-4 py-2 max-w-[150px] truncate">
                                {jobApplication.jobSpecName ? (
                                    <a
                                        href={jobApplication.jobSpec}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {jobApplication.jobSpecName}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                            <td className="border px-4 py-2 max-w-[150px] truncate">
                                {jobApplication.cvName ? (
                                    <a
                                        href={getCvUrl(jobApplication.cvName) || '#'}
                                        download={jobApplication.cvName}
                                        className="text-blue-500 underline"
                                    >
                                        {jobApplication.cvName}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                            <td className="border px-4 py-2 max-w-xs">
                                <div className="flex flex-wrap">
                                    {jobApplication.tags?.map(tag => (
                                        <span key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">{tag}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="border px-4 py-2 max-w-xs">
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => handleOpenInsightsModal(jobApplication)}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Insights
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(jobApplication)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleRemove(jobApplication._id!)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
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
