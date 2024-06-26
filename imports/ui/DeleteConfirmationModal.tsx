import React from 'react';

interface DeleteConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Confirm Delete</h2>
                <p className="mb-4">Are you sure you want to delete this job application?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-gray-600 hover:border-gray-600 active:bg-transparent active:text-gray-500 active:border-gray-500 mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded border-2 border-transparent hover:bg-red-600 hover:border-red-600 active:bg-transparent active:text-red-500 active:border-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
