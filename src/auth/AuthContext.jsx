import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const syncUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                syncUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (data) => {
        setToken(data.user.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.user.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (newUserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout,
            updateUser, 
            syncUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};