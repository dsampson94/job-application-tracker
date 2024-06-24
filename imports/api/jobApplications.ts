import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { User } from '../types/User'; // Ensure you have this import

export const JobApplications = new Mongo.Collection<JobApplication>('jobApplications');

export interface JobApplication {
    _id?: string;
    role: string;
    company: string;
    status: string;
    userId: string;
    createdAt: Date;
    jobSpecName?: string;
    jobSpecUrl?: string;
    cvName?: string;
}

Meteor.methods({
    'jobApplications.insert'(this: Meteor.MethodThisType, jobApplication: Omit<JobApplication, '_id'>) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const newJobApplication = {
            ...jobApplication,
            userId: this.userId,
            createdAt: new Date(),
        };

        JobApplications.insert(newJobApplication);
    },

    'jobApplications.update'(this: Meteor.MethodThisType, jobApplicationId: string, updates: Partial<JobApplication>) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        JobApplications.update(
            { _id: jobApplicationId, userId: this.userId as string },
            { $set: updates }
        );
    },

    'jobApplications.remove'(this: Meteor.MethodThisType, jobApplicationId: string) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        JobApplications.remove({ _id: jobApplicationId, userId: this.userId as string });
    }
});

if (Meteor.isServer) {
    Meteor.publish('jobApplications', function () {
        return JobApplications.find({ userId: this.userId as string });
    });

    Meteor.publish('userCVs', function () {
        return Meteor.users.find({ _id: this.userId as string }, { fields: { 'profile.cvs': 1 } });
    });
}
