import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC = ({ children }) => {
    const location = useLocation();

    const getLinkClasses = (path: string) => {
        return location.pathname === path
            ? 'block py-2 px-4 rounded bg-gray-700'
            : 'block py-2 px-4 rounded hover:bg-gray-700';
    };

    return (
        <div className="flex min-h-screen">
            <aside className="max-w-64 w-64 min-w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold">InterviewAce</div>
                <nav className="flex-grow p-4">
                    <ul>
                        <li className="mb-4">
                            <Link to="/profile" className={getLinkClasses('/profile')}>
                                My Profile
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/applications" className={getLinkClasses('/dashboard')}>
                                Applications
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/metrics" className="text-white block py-2 px-4 hover:bg-gray-700">
                                Metrics
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4">
                    <button
                        onClick={() => Meteor.logout()}
                        className="bg-red-500 text-white w-full px-4 py-2 rounded border-2 border-transparent hover:bg-red-600 hover:border-red-600 active:bg-transparent active:text-red-500 active:border-red-500"
                    >
                        Log Out
                    </button>
                </div>
            </aside>
            <div className="flex-grow flex flex-col">
                <header className="bg-white shadow p-4 h-12 flex justify-between items-center">
                    {/* Add header items here if needed */}
                </header>
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
