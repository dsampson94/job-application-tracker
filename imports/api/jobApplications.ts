import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { User } from '../types/User';
import MethodThisType = Meteor.MethodThisType;

export const JobApplications = new Mongo.Collection<JobApplication>('jobApplications');

export interface JobApplication {
    _id?: string;
    role: string;
    company: string;
    status: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    appliedAt: Date;
    interviewDate?: Date;
    offerDate?: Date;
    unsuccessfulDate?: Date;
    jobSpec?: string;
    jobSpecName?: string;
    cvName?: string;
    tags?: string[];
    mockInterviewResponses?: string[];
    suitabilityResponses?: string[];
    tipsResponses?: string[];
    isFavorite?: boolean;
}

const getRandomTags = () => {
    const possibleTags = ['Hybrid', 'Remote', 'On-site', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Competitive', 'Flexible Hours', 'Competitive'];
    const tagCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
    const shuffledTags = possibleTags.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, tagCount);
};

Meteor.methods({
    'jobApplications.insert'(this: Meteor.MethodThisType, jobApplication: Omit<JobApplication, '_id'>) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const newJobApplication = {
            ...jobApplication,
            userId: this.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            appliedAt: new Date(),
        };

        JobApplications.insert(newJobApplication);
    },

    'jobApplications.update'(this: Meteor.MethodThisType, jobApplicationId: string, updates: Partial<JobApplication>) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        JobApplications.update(
            { _id: jobApplicationId, userId: this.userId as string },
            { $set: { ...updates, updatedAt: new Date() } }
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

        const statuses = ['Applied', 'Interviewing', 'Offered', 'Unsuccessful'];
        const roles = ['Software Engineer', 'Full Stack Developer', 'React Developer', 'Tech Lead'];
        const companies = ['Mock Company 1', 'Mock Company 2', 'Mock Company 3', 'Mock Company 4', 'Mock Company 5'];

        const mockApplications: {
            suitabilityResponses: any[];
            role: string;
            interviewDate: Date | undefined;
            jobSpecName: string;
            mockInterviewResponses: any[];
            unsuccessfulDate: Date | undefined;
            userId: (this: MethodThisType, ...args: any[]) => any;
            cvName: string;
            tags: string[];
            createdAt: Date;
            jobSpec: string;
            offerDate: Date | undefined;
            company: string;
            appliedAt: Date;
            status: string;
            updatedAt: Date;
            tipsResponses: any[];
            isFavorite: boolean
        }[] = Array.from({ length: 50 }, (_, i) => {
            const role = roles[Math.floor(Math.random() * roles.length)];
            const company = companies[Math.floor(Math.random() * companies.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const appliedAt = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30)));
            const interviewDate = status === 'Interviewing' ? new Date(new Date().setDate(appliedAt.getDate() + Math.floor(Math.random() * 7 + 1))) : undefined;
            const offerDate = status === 'Offered' ? new Date(new Date().setDate(interviewDate ? interviewDate.getDate() + Math.floor(Math.random() * 7 + 1) : appliedAt.getDate() + Math.floor(Math.random() * 7 + 1))) : undefined;
            const unsuccessfulDate = status === 'Unsuccessful' ? new Date(new Date().setDate(interviewDate ? interviewDate.getDate() + Math.floor(Math.random() * 7 + 1) : appliedAt.getDate() + Math.floor(Math.random() * 7 + 1))) : undefined;

            return {
                role,
                company,
                status,
                userId: this.userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                appliedAt,
                interviewDate,
                offerDate,
                unsuccessfulDate,
                jobSpec: '',
                jobSpecName: `${role} Job Spec ${i + 1}`,
                cvName: `${role} CV ${i + 1}`,
                tags: getRandomTags(),
                mockInterviewResponses: [],
                suitabilityResponses: [],
                tipsResponses: [],
                isFavorite: Math.random() < 0.5,
            };
        });

        mockApplications.forEach(application => JobApplications.insert(application));
    },

    'jobApplications.clearMockData'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        JobApplications.remove({ userId: this.userId as string });
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
