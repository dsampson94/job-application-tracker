import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import pdf from 'pdf-parse';
import { callWithPromise } from '../utils/promisify';

const OPENAI_API_KEY = Meteor.settings?.private?.OPENAI_API_KEY;

Meteor.methods({
    async extractTextFromPDF(base64: string): Promise<string> {
        const pdfBuffer = Buffer.from(base64.split(',')[1], 'base64');
        try {
            const data = await pdf(pdfBuffer);
            return data.text;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw new Meteor.Error('pdf-error', 'Failed to extract text from PDF');
        }
    },

    async getInsights(specBase64: string, userId: string, type: string): Promise<string | null> {
        const user = Meteor.users.findOne(userId);
        if (!user || !user.profile || !user.profile.cvUrl) {
            throw new Meteor.Error('user-not-found', 'User or CV URL not found');
        }

        const cvBase64 = user.profile.cvUrl;
        const specText = await callWithPromise<string>('extractTextFromPDF', specBase64);
        const cvText = await callWithPromise<string>('extractTextFromPDF', cvBase64);

        let userPrompt = '';
        switch (type) {
            case 'mockInterview':
                userPrompt = `Create a thoughtful, probable mock job interview dialogue between an interviewer and interviewee based on this job specification - ${specText} and this applicant's resume - ${cvText} that the reader can use to practice for their upcoming job interview.`;
                break;
            case 'suitability':
                userPrompt = `Evaluate the suitability of this applicant based on this job specification - ${specText} and this applicant's resume - ${cvText}. Provide detailed feedback.`;
                break;
            case 'tips':
                userPrompt = `Provide tips and advice for this applicant based on this job specification - ${specText} and this applicant's resume - ${cvText}.`;
                break;
            default:
                throw new Meteor.Error('invalid-type', 'Invalid request type');
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: userPrompt },
                    ],
                    max_tokens: 2000,
                }),
            });

            const data = await response.json();
            console.log('OpenAI API response:', data); // Log the entire response for debugging

            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            } else {
                console.error('No valid choices returned from OpenAI:', data); // Log the error details
                throw new Meteor.Error('openai-error', 'No valid choices returned from OpenAI');
            }
        } catch (error) {
            console.error('Error fetching interview insights from OpenAI:', error); // Log the error details
            throw new Meteor.Error('openai-error', 'Failed to fetch interview insights');
        }
    }
});
