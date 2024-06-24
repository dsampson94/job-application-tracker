import React from 'react';
import Layout from './Layout';

const Dashboard: React.FC = () => {
    const clearDatabase = () => {
        Meteor.call('clearDatabase', (err: any) => {
            if (err) {
                alert(`Failed to clear database: ${err.message}`);
            } else {
                alert('Database cleared successfully');
            }
        });
    };

    return (
        <Layout>
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
                <button onClick={clearDatabase} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                    Clear Database
                </button>
            </div>
        </Layout>
    );
};

export default Dashboard;
