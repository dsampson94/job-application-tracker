import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { User } from '../types/User';

export const JobApplications = new Mongo.Collection<JobApplication>('jobApplications');

export interface JobApplication {
    _id?: string;
    role: string;
    company: string;
    status: string;
    userId: string;
    createdAt: Date;
    jobSpec?: string;
    jobSpecName?: string; // Storing Job Spec name
    cvName?: string; // Storing CV name instead of base64 string
    tags?: string[]; // Storing tags
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
    },

    'jobApplications.insertMockData'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const mockApplications: Omit<JobApplication, '_id'>[] = Array.from({ length: 50 }, (_, i) => ({
            role: `Mock Role ${i + 1}`,
            company: `Mock Company ${i + 1}`,
            status: 'Applied',
            userId: this.userId,
            createdAt: new Date(),
            jobSpec: '',
            jobSpecName: `Mock Job Spec ${i + 1}`,
            cvName: `Mock CV ${i + 1}`,
            tags: ['mock', 'test', 'application'],
        }));

        mockApplications.forEach(application => JobApplications.insert(application));
    },

    'jobApplications.clearMockData'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        JobApplications.remove({ userId: this.userId as string, role: { $regex: '^Mock Role' } });
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
