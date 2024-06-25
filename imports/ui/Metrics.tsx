import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { JobApplications } from '../api/jobApplications';
import { JobApplication } from '../api/jobApplications';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import Layout from './Layout';

const themeColors = {
    primary: '#3B82F6',
    secondary: '#EF9449',
    accent: '#EF6449',
    text: '#1E293B',
};

const Metrics: React.FC = () => {
    const { jobApplications } = useTracker(() => {
        const handle = Meteor.subscribe('jobApplications');
        return {
            jobApplications: JobApplications.find().fetch(),
            isLoading: !handle.ready(),
        };
    });

    // Data Preparation
    const statusCounts = jobApplications.reduce((acc: any, app: JobApplication) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((key) => ({
        name: key,
        value: statusCounts[key],
    }));

    const tagCounts = jobApplications.reduce((acc: any, app: JobApplication) => {
        if (app.tags) {
            app.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
        }
        return acc;
    }, {});

    const tagData = Object.keys(tagCounts).map((key) => ({
        name: key,
        value: tagCounts[key],
    }));

    const applicationsPerDay = jobApplications.reduce((acc: any, app: JobApplication) => {
        const day = new Date(app.appliedAt).toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});

    const applicationsPerDayData = Object.keys(applicationsPerDay).map((key) => ({
        date: key,
        count: applicationsPerDay[key],
    }));

    const stageConversionCounts = jobApplications.reduce((acc: any, app: JobApplication) => {
        if (app.status === 'Interviewing') acc['Applied to Interviewing'] = (acc['Applied to Interviewing'] || 0) + 1;
        if (app.status === 'Offered') acc['Interviewing to Offered'] = (acc['Interviewing to Offered'] || 0) + 1;
        return acc;
    }, {});

    const stageConversionData = Object.keys(stageConversionCounts).map((key) => ({
        name: key,
        value: stageConversionCounts[key],
    }));

    const roleCounts = jobApplications.reduce((acc: any, app: JobApplication) => {
        acc[app.role] = (acc[app.role] || 0) + 1;
        return acc;
    }, {});

    const roleData = Object.keys(roleCounts).map((key) => ({
        role: key,
        value: roleCounts[key],
    }));

    const averageApplicationTime = jobApplications.reduce((acc: any, app: JobApplication) => {
        const timeInDays = (app.updatedAt.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24);
        acc.totalDays += timeInDays;
        acc.count += 1;
        return acc;
    }, { totalDays: 0, count: 0 });

    const averageTimeData = [
        { name: 'Average Time to Update', value: (averageApplicationTime.totalDays / averageApplicationTime.count).toFixed(2) }
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Metrics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Applications by Status</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                     outerRadius={100} fill={themeColors.primary} label>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={themeColors.primary} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Applications per Day</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={applicationsPerDayData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" stroke={themeColors.text} />
                                <YAxis stroke={themeColors.text} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke={themeColors.primary} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Applications by Role</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={roleData}>
                                <PolarGrid stroke={themeColors.text} />
                                <PolarAngleAxis dataKey="role" stroke={themeColors.text} />
                                <PolarRadiusAxis angle={30} domain={[0, Math.max(...roleData.map(o => o.value))]}
                                                 stroke={themeColors.text} />
                                <Radar name="Roles" dataKey="value" stroke={themeColors.primary}
                                       fill={themeColors.primary} fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Average Time to Update
                            Applications</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={averageTimeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke={themeColors.text} />
                                <YAxis stroke={themeColors.text} />
                                <Tooltip />
                                <Bar dataKey="value" fill={themeColors.accent} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Applications by Tag</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tagData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke={themeColors.text} />
                                <YAxis stroke={themeColors.text} />
                                <Tooltip />
                                <Bar dataKey="value" fill={themeColors.accent} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl mb-2" style={{ color: themeColors.text }}>Stage Conversions</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stageConversionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke={themeColors.text} />
                                <YAxis stroke={themeColors.text} />
                                <Tooltip />
                                <Bar dataKey="value" fill={themeColors.accent} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Metrics;
