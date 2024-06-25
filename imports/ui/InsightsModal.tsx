import React, { useEffect, useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { JobApplication } from '../api/jobApplications';
import { toast } from 'react-toastify';
import { callWithPromise } from '../utils/promisify';
import { Typewriter } from 'react-simple-typewriter';
import { useTracker } from 'meteor/react-meteor-data';
import { User } from '../types/User';

interface InsightsModalProps {
    jobApplication: JobApplication | null;
    onClose: () => void;
}

const tabs = [
    { label: 'Mock Interview', value: 'mockInterview' },
    { label: 'Suitability', value: 'suitability' },
    { label: 'Tips', value: 'tips' },
];

const InsightsModal: React.FC<InsightsModalProps> = ({ jobApplication, onClose }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [requestType, setRequestType] = useState<string>('mockInterview');
    const user: User | null = useTracker(() => Meteor.user() as User | null);
    const responseContainerRef = useRef<HTMLDivElement>(null);
    const [responses, setResponses] = useState<string[]>(jobApplication?.[`${requestType}Responses`] || []);

    const fetchInsights = async (type: string) => {
        if (jobApplication && jobApplication.jobSpec && jobApplication.cvName && user) {
            setLoading(true);
            try {
                const userId = Meteor.userId();
                const cv = user.profile?.cvs?.find(cv => cv.name === jobApplication.cvName);

                if (!cv) {
                    throw new Error('CV not found in user profile');
                }

                const result = await callWithPromise<string>('getInsights', jobApplication.jobSpec, cv.url, type);
                setLoading(false);
                setInsights(result);
            } catch (error) {
                setLoading(false);
                toast.error(`Failed to fetch insights: ${error.message}`);
            }
        }
    };

    const handleTabClick = (type: string) => {
        setRequestType(type);
        setInsights(null);
        setResponses(jobApplication?.[`${type}Responses`] || []);
    };

    const handleRemoveResponse = (index: number) => {
        if (!jobApplication) return;

        const updatedResponses = responses.slice();
        updatedResponses.splice(index, 1);

        const updates = {
            [`${requestType}Responses`]: updatedResponses,
        };

        Meteor.call('jobApplications.update', jobApplication._id, updates, (err: Meteor.Error) => {
            if (err) {
                toast.error(`Failed to remove response: ${err.message}`);
            } else {
                toast.success('Response removed successfully');
                setResponses(updatedResponses); // Update local state
            }
        });
    };

    const handleAddResponse = () => {
        if (!jobApplication || !insights) return;

        const updatedResponses = [
            ...responses,
            insights,
        ];

        const updates = {
            [`${requestType}Responses`]: updatedResponses,
        };

        Meteor.call('jobApplications.update', jobApplication._id, updates, (err: Meteor.Error) => {
            if (err) {
                toast.error(`Failed to save response: ${err.message}`);
            } else {
                toast.success('Response saved successfully');
                setResponses(updatedResponses); // Update local state
                setInsights(null); // Clear the new response
            }
        });
    };

    useEffect(() => {
        if (responseContainerRef.current) {
            responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
        }
    }, [insights, requestType]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="bg-white p-6 rounded shadow-md w-[90%] h-[90%] flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="grid grid-cols-4 gap-72 mb-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold whitespace-nowrap">My AI Insights for Application:</h3>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold whitespace-nowrap">Company: {jobApplication?.company || 'N/A'}</h3>
                            <h3 className="text-lg font-semibold whitespace-nowrap">Role: {jobApplication?.role || 'N/A'}</h3>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold whitespace-nowrap">CV: {jobApplication?.cvName || 'N/A'}</h3>
                            <h3 className="text-lg font-semibold whitespace-nowrap">Job
                                Spec: {jobApplication?.jobSpecName || 'N/A'}</h3>
                        </div>
                    </div>
                    <div className="flex justify-end items-start">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
                <div className="flex mb-4 border-b-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabClick(tab.value)}
                            className={`flex-1 py-2 text-center border-b-2 font-medium ${
                                requestType === tab.value
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div ref={responseContainerRef}
                     className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold mb-2">Saved Responses:</h4>
                        {responses.map((response, index) => (
                            <div key={index} className="mb-2 p-2 border border-gray-300 rounded bg-white relative">
                                <pre className="whitespace-pre-wrap">{response}</pre>
                                <button
                                    onClick={() => handleRemoveResponse(index)}
                                    className="absolute top-0 right-0 pb-1 mr-2 mt-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold mb-2">New Response:</h4>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            insights && (
                                <div className="p-2 border border-gray-300 rounded bg-white relative">
                                    <pre className="whitespace-pre-wrap">
                                        <Typewriter
                                            words={[insights]}
                                            loop={false}
                                            cursor
                                            cursorStyle="_"
                                            typeSpeed={20}
                                            deleteSpeed={0}
                                            delaySpeed={0}
                                        />
                                    </pre>
                                    <button
                                        onClick={handleAddResponse}
                                        className="absolute top-0 right-0 pb-1 mt-2 mr-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => fetchInsights(requestType)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Get Insights
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightsModal;
