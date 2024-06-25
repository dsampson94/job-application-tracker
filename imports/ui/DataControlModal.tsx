import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { callWithPromise } from '../utils/promisify';

interface DataControlModalProps {
    onClose: () => void;
}

const DataControlModal: React.FC<DataControlModalProps> = ({ onClose }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleAddMockData = async () => {
        setIsAdding(true);
        try {
            await callWithPromise('jobApplications.insertMockData');
            toast.success('Successfully added 50 mock job applications');
        } catch (error) {
            toast.error(`Failed to add mock job applications: ${error.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    const handleClearMockData = async () => {
        setIsClearing(true);
        try {
            await callWithPromise('jobApplications.clearMockData');
            toast.success('Successfully cleared mock job applications');
        } catch (error) {
            toast.error(`Failed to clear mock job applications: ${error.message}`);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Data Control</h2>
                <button
                    onClick={handleAddMockData}
                    className={`bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isAdding}
                >
                    {isAdding ? 'Adding...' : 'Add 50 Mock Applications'}
                </button>
                <button
                    onClick={handleClearMockData}
                    className={`bg-red-500 text-white px-4 py-2 rounded mb-4 w-full ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isClearing}
                >
                    {isClearing ? 'Clearing...' : 'Clear Mock Applications'}
                </button>
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
                    Close
                </button>
            </div>
        </div>
    );
};

export default DataControlModal;
