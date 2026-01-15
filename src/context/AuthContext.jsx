
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('curelo_admin_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (username, password) => {
        // Simple hardcoded credentials for now
        if (username === 'admin' && password === 'admin123') {
            const userData = { username: 'admin', role: 'administrator' };
            setUser(userData);
            sessionStorage.setItem('curelo_admin_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('curelo_admin_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
