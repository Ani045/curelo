import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-bold text-blue-600 opacity-20">404</h1>
                <div className="relative -mt-20">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
                        Page not found
                    </h2>
                    <p className="text-lg text-gray-500 mb-8">
                        The link you followed may be broken, or the page may have been removed.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Subtle brand decoration */}
            <div className="mt-12 opacity-30 select-none pointer-events-none">
                <img
                    src="/logo.png"
                    alt="Curelo Health"
                    className="h-8 grayscale"
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>
        </div>
    );
};

export default NotFoundPage;
