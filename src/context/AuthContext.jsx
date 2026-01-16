
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('curelo_admin_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                sessionStorage.setItem('curelo_admin_user', JSON.stringify(data.user));
                return { success: true };
            }

            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Could not connect to the authentication server. Please ensure the API is running.' };
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('curelo_admin_user');
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    const addUser = async (newUser) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            return response.ok;
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        }
    };

    const deleteUser = async (username) => {
        try {
            const response = await fetch(`/api/users/${username}`, {
                method: 'DELETE',
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            fetchUsers,
            addUser,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
