import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { JobApplication } from '../api/jobApplications';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTracker } from 'meteor/react-meteor-data';
import { User, CV } from '../types/User';

interface JobApplicationModalProps {
    jobApplication?: JobApplication;
    onClose: () => void;
}

const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Interviewing', label: 'Interviewing' },
    { value: 'Offered', label: 'Offered' },
    { value: 'Rejected', label: 'Rejected' },
];

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ jobApplication, onClose }) => {
    const user: User | null = useTracker(() => Meteor.user() as User | null);
    const cvs = user?.profile?.cvs || [];

    const [role, setRole] = useState(jobApplication?.role || '');
    const [company, setCompany] = useState(jobApplication?.company || '');
    const [status, setStatus] = useState(jobApplication?.status || '');
    const [jobSpecName, setJobSpecName] = useState<string | null>(jobApplication?.jobSpecName || null);
    const [jobSpecUrl, setJobSpecUrl] = useState<string | null>(jobApplication?.jobSpecUrl || null);
    const [cvName, setCvName] = useState<string | null>(jobApplication?.cvName || (cvs.length > 0 ? cvs[0].name : null));

    useEffect(() => {
        if (jobApplication) {
            setRole(jobApplication.role || '');
            setCompany(jobApplication.company || '');
            setStatus(jobApplication.status || '');
            setJobSpecName(jobApplication.jobSpecName || null);
            setJobSpecUrl(jobApplication.jobSpecUrl || null);
            setCvName(jobApplication.cvName || null);
        }
    }, [jobApplication]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<string | null>>, setName: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFile(base64String);
                setName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (jobApplication) {
            Meteor.call('jobApplications.update', jobApplication._id, { role, company, status, jobSpecName, jobSpecUrl, cvName }, (err: Meteor.Error) => {
                if (err) {
                    toast.error(`Failed to update job application: ${err.message}`);
                } else {
                    toast.success('Job application updated successfully');
                    onClose();
                }
            });
        } else {
            Meteor.call('jobApplications.insert', { role, company, status, jobSpecName, jobSpecUrl, cvName }, (err: Meteor.Error) => {
                if (err) {
                    toast.error(`Failed to create job application: ${err.message}`);
                } else {
                    toast.success('Job application created successfully');
                    onClose();
                }
            });
        }
    };

    const selectedCV = cvs.find(cv => cv.name === cvName);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl grid grid-cols-2 gap-8">
                <div className="col-span-1">
                    <h2 className="text-2xl mb-4">{jobApplication ? 'Update Job Application' : 'Create Job Application'}</h2>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role"
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label className="block mb-2">CV:</label>
                    <select
                        value={cvName || ''}
                        onChange={(e) => setCvName(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    >
                        {cvs.map((cv) => (
                            <option key={cv.name} value={cv.name}>{cv.name}</option>
                        ))}
                    </select>
                    <label className="block mb-2">Job Spec:</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, setJobSpecUrl, setJobSpecName)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                            {jobApplication ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col space-y-4">
                    {jobSpecUrl && (
                        <div>
                            <h3 className="mb-2">Job Spec: {jobSpecName}</h3>
                            <iframe
                                src={jobSpecUrl}
                                title="Job Spec Preview"
                                className="w-full h-64 mb-4 border border-gray-300"
                            />
                        </div>
                    )}
                    {selectedCV && (
                        <div>
                            <h3 className="mb-2">Selected CV: {selectedCV.name}</h3>
                            <iframe
                                src={`${selectedCV.url}`}
                                title="CV Preview"
                                className="w-full h-64 mb-4 border border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
