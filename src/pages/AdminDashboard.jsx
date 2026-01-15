
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { getAllPages, createPage, deletePage } = useCMS();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [newPage, setNewPage] = useState({ title: '', slug: '', template: 'default' });
    const [error, setError] = useState('');

    const pages = getAllPages();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreatePage = (e) => {
        e.preventDefault();
        setError('');

        if (!newPage.title || !newPage.slug) {
            setError('Both title and slug are required');
            return;
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(newPage.slug)) {
            setError('Slug must contain only lowercase letters, numbers, and hyphens');
            return;
        }

        const success = createPage(newPage.slug, newPage.title, newPage.template);
        if (success) {
            setNewPage({ title: '', slug: '', template: 'default' });
        } else {
            setError('A page with this slug already exists');
        }
    };

    const handleDelete = (slug) => {
        if (window.confirm(`Are you sure you want to delete the page "${slug}"?`)) {
            deletePage(slug);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-blue-900 text-white p-8 rounded-t-lg shadow-md mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">CMS Admin Dashboard</h1>
                        <p className="text-blue-200 mt-2">Manage multiple landing pages from a single dashboard</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-blue-300 mb-2 uppercase tracking-widest font-semibold">Welcome, {user?.username}</p>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Create New Page Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Create New Page</h2>
                        <form onSubmit={handleCreatePage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Thyroid Test"
                                    value={newPage.title}
                                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                                <input
                                    type="text"
                                    placeholder="e.g. thyroid-test"
                                    value={newPage.slug}
                                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase() })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Template</label>
                                <select
                                    value={newPage.template}
                                    onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    <option value="default">Default Template</option>
                                    <option value="minimal">Minimal Template</option>
                                </select>
                            </div>
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors text-sm"
                            >
                                Create Landing Page
                            </button>
                        </form>
                    </div>

                    {/* Pages List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Your Landing Pages</h2>
                        {pages.map((page) => (
                            <div key={page.slug} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{page.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500 font-mono">/{page.slug === 'home' ? '' : page.slug}</p>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {page.template}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        to={page.slug === 'home' ? '/' : `/${page.slug}`}
                                        target="_blank"
                                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/admin/${page.slug}`}
                                        className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-semibold"
                                    >
                                        Edit
                                    </Link>
                                    {page.slug !== 'home' && (
                                        <button
                                            onClick={() => handleDelete(page.slug)}
                                            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
