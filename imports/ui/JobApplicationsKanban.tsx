import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { JobApplications, JobApplication } from '../api/jobApplications';
import JobApplicationModal from './JobApplicationModal';
import InsightsModal from './InsightsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const JobApplicationsKanban: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<JobApplication | null>(null);

    const { jobApplications, isLoading } = useTracker(() => {
        const handle = Meteor.subscribe('jobApplications');
        return {
            jobApplications: JobApplications.find().fetch(),
            isLoading: !handle.ready(),
        };
    });

    const handleRemove = () => {
        if (jobToDelete) {
            Meteor.call('jobApplications.remove', jobToDelete._id, (error: any) => {
                if (error) {
                    toast.error(`Failed to delete job application: ${error.message}`);
                } else {
                    toast.success('Job application deleted successfully');
                }
                setIsDeleteModalOpen(false);
                setJobToDelete(null);
            });
        }
    };

    const handleOpenModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsModalOpen(true);
    };

    const handleOpenInsightsModal = (jobApplication: JobApplication | null) => {
        setSelectedJobApplication(jobApplication);
        setIsInsightsModalOpen(true);
    };

    const handleOpenDeleteModal = (jobApplication: JobApplication) => {
        setJobToDelete(jobApplication);
        setIsDeleteModalOpen(true);
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const draggedJob = jobApplications.find((job) => job._id === draggableId);
        if (draggedJob) {
            Meteor.call('jobApplications.update', draggedJob._id, { status: destination.droppableId }, (error: any) => {
                if (error) {
                    toast.error(`Failed to update job application: ${error.message}`);
                } else {
                    toast.success('Job application updated successfully');
                }
            });
        }
    };

    const columns = [
        { title: 'Applied', status: 'Applied' },
        { title: 'Interviewing', status: 'Interviewing' },
        { title: 'Offered', status: 'Offered' },
        { title: 'Rejected', status: 'Rejected' },
    ];

    return (
        <div className="max-h-[80vh] overflow-hidden">
            <div className="text-center">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex space-x-4 overflow-x-auto py-4">
                        {columns.map((column) => (
                            <Droppable droppableId={column.status} key={column.status}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="bg-gray-200 rounded-lg flex-1 min-w-[250px] max-h-[80vh] overflow-auto"
                                    >
                                        <div className="sticky top-0 bg-gray-200 z-10 p-4 border-b border-gray-300">
                                            <h2 className="text-xl font-bold mb-2">{column.title}</h2>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {jobApplications
                                                .filter((job) => job.status === column.status)
                                                .map((job, index) => (
                                                    <Draggable
                                                        key={job._id}
                                                        draggableId={job._id!}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                                                            >
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="text-left">
                                                                        <div className="font-bold text-lg">{job.company}</div>
                                                                        <div className="text-gray-600">{job.role}</div>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleOpenInsightsModal(job)}
                                                                            className="bg-green-500 text-white w-8 h-8 p-1 rounded-full flex items-center justify-center"
                                                                        >
                                                                            <FontAwesomeIcon icon={faMagic} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleOpenModal(job)}
                                                                            className="bg-yellow-500 text-white w-8 h-8 p-1 rounded-full flex items-center justify-center"
                                                                        >
                                                                            <FontAwesomeIcon icon={faEye} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleOpenDeleteModal(job)}
                                                                            className="bg-red-500 text-white w-8 h-8 p-1 rounded-full flex items-center justify-center"
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 flex flex-wrap space-x-2 space-y-2">
                                                                    {job.tags?.map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
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
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={handleRemove}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default JobApplicationsKanban;
