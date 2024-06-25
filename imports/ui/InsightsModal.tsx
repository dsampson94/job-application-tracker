import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { JobApplication } from '../api/jobApplications';
import { toast } from 'react-toastify';
import { callWithPromise } from '../utils/promisify'; // Corrected import path
import { Typewriter } from 'react-simple-typewriter'; // Import the Typewriter component
import { useTracker } from 'meteor/react-meteor-data';
import { User } from '../types/User';

interface InsightsModalProps {
    jobApplication: JobApplication | null;
    onClose: () => void;
}

const InsightsModal: React.FC<InsightsModalProps> = ({ jobApplication, onClose }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [requestType, setRequestType] = useState<string | null>(null);
    const user: User | null = useTracker(() => Meteor.user() as User | null);

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

    const handleButtonClick = (type: string) => {
        setRequestType(type);
        fetchInsights(type);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="bg-white p-8 rounded shadow-md w-3/4 h-3/4 overflow-hidden flex flex-col">
                <div className="flex justify-between mb-4">
                    <div className="text-left">
                        <h3 className="text-lg font-semibold">CV: {jobApplication?.cvName || 'N/A'}</h3>
                        <h3 className="text-lg font-semibold">Job Spec: {jobApplication?.jobSpecName || 'N/A'}</h3>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            Close
                        </button>
                        <button onClick={() => handleButtonClick('mockInterview')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Mock Interview
                        </button>
                        <button onClick={() => handleButtonClick('suitability')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                            Suitability
                        </button>
                        <button onClick={() => handleButtonClick('tips')} className="bg-purple-500 text-white px-4 py-2 rounded">
                            Tips
                        </button>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {insights ? (
                                <pre className="whitespace-pre-wrap h-full">
                                    <Typewriter
                                        words={[insights]}
                                        loop={false}
                                        cursor
                                        cursorStyle="_"
                                        typeSpeed={100}
                                        deleteSpeed={0}
                                        delaySpeed={1000}
                                    />
                                </pre>
                            ) : (
                                <p className="text-gray-500">Select a feature to get insights.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsightsModal;
