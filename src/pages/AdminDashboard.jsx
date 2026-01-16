
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { getAllPages, createPage, deletePage, saveToServer, saving } = useCMS();
    const { logout, user, fetchUsers, addUser, deleteUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('pages');
    const [newPage, setNewPage] = useState({ title: '', slug: '', template: 'default' });
    const [pageError, setPageError] = useState('');

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'editor' });
    const [userError, setUserError] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    const pages = getAllPages();

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);

    const loadUsers = async () => {
        setLoadingUsers(true);
        const data = await fetchUsers();
        setUsers(data);
        setLoadingUsers(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreatePage = (e) => {
        e.preventDefault();
        setPageError('');

        if (!newPage.title || !newPage.slug) {
            setPageError('Both title and slug are required');
            return;
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(newPage.slug)) {
            setPageError('Slug must contain only lowercase letters, numbers, and hyphens');
            return;
        }

        const success = createPage(newPage.slug, newPage.title, newPage.template);
        if (success) {
            setNewPage({ title: '', slug: '', template: 'default' });
        } else {
            setPageError('A page with this slug already exists');
        }
    };

    const handleDeletePage = (slug) => {
        if (window.confirm(`Are you sure you want to delete the page "${slug}"?`)) {
            deletePage(slug);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setUserError('');

        if (!newUser.username || !newUser.password) {
            setUserError('Username and password are required');
            return;
        }

        const success = await addUser(newUser);
        if (success) {
            setNewUser({ username: '', password: '', role: 'editor' });
            loadUsers();
        } else {
            setUserError('Failed to add user. It may already exist.');
        }
    };

    const handleDeleteUser = async (username) => {
        if (username === user.username) {
            alert("You cannot delete yourself!");
            return;
        }

        if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            const success = await deleteUser(username);
            if (success) {
                loadUsers();
            } else {
                alert('Failed to delete user');
            }
        }
    };

    const handlePublish = async () => {
        const result = await saveToServer();
        if (result.success) {
            alert('Changes published to server successfully!');
        } else {
            alert('Failed to publish: ' + result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-[#143a69] text-white p-8 rounded-t-lg shadow-md flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Curelo CMS Admin</h1>
                        <p className="text-blue-200 mt-2">Manage pages and users from a single dashboard</p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                        <p className="text-xs text-blue-300 uppercase tracking-widest font-semibold">Welcome, {user?.username}</p>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-b border-gray-200 px-8 flex gap-8">
                    <button
                        onClick={() => setActiveTab('pages')}
                        className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Landing Pages
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        User Management
                    </button>
                    <div className="ml-auto flex items-center">
                        <button
                            onClick={handlePublish}
                            disabled={saving}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${saving
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-500'
                                }`}
                        >
                            {saving ? (
                                <>
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Publishing...
                                </>
                            ) : (
                                <>Publish Changes</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-white rounded-b-lg shadow-sm">
                    {activeTab === 'pages' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Create New Page Form */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Create New Page</h2>
                                <form onSubmit={handleCreatePage} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Page Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Thyroid Test"
                                            value={newPage.title}
                                            onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">URL Slug</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. thyroid-test"
                                            value={newPage.slug}
                                            onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase() })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1 italic">Only lowercase letters, numbers, and hyphens</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Base Template</label>
                                        <select
                                            value={newPage.template}
                                            onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        >
                                            <option value="default">Default Template</option>
                                            <option value="minimal">Minimal Template</option>
                                        </select>
                                    </div>
                                    {pageError && <p className="text-red-500 text-xs font-semibold">{pageError}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded transition-colors text-sm shadow-sm"
                                    >
                                        Create Page
                                    </button>
                                </form>
                            </div>

                            {/* Pages List */}
                            <div className="md:col-span-2 space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Your Landing Pages</h2>
                                {pages.length === 0 ? (
                                    <p className="text-gray-500 italic text-center py-8">No pages created yet.</p>
                                ) : (
                                    pages.map((page) => (
                                        <div key={page.slug} className="bg-white p-5 rounded-lg border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all shadow-sm">
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800">{page.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-gray-500 font-mono">/{page.slug === 'home' ? '' : page.slug}</p>
                                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                                        {page.template}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={page.slug === 'home' ? '/' : `/${page.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="View Live"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    to={`/admin/${page.slug}`}
                                                    className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all font-bold"
                                                >
                                                    Edit
                                                </Link>
                                                {page.slug !== 'home' && (
                                                    <button
                                                        onClick={() => handleDeletePage(page.slug)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Page"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Add User Form */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New User</h2>
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Username</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. jdoe"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        >
                                            <option value="administrator">Administrator</option>
                                            <option value="editor">Editor</option>
                                        </select>
                                    </div>
                                    {userError && <p className="text-red-500 text-xs font-semibold">{userError}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#143a69] hover:bg-[#0f2d52] text-white font-bold py-2.5 rounded transition-colors text-sm shadow-sm uppercase tracking-wide"
                                    >
                                        Add User
                                    </button>
                                </form>
                            </div>

                            {/* Users List */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">System Users</h2>
                                    <button
                                        onClick={loadUsers}
                                        className="text-xs text-blue-600 hover:underline font-bold"
                                    >
                                        Refresh List
                                    </button>
                                </div>
                                {loadingUsers ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : users.length === 0 ? (
                                    <p className="text-gray-500 italic text-center py-8">No users found.</p>
                                ) : (
                                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {users.map((u) => (
                                                    <tr key={u.username} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{u.username}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${u.role === 'administrator' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                                                }`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {u.username !== user.username ? (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.username)}
                                                                    className="text-red-400 hover:text-red-100 p-1.5 hover:bg-red-600 rounded-lg transition-all"
                                                                    title="Delete User"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-400 italic font-medium px-2 py-1 bg-gray-50 rounded border border-gray-100">Current User</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
