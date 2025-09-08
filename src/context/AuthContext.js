import React, { createContext, useState, useEffect } from 'react';
import { getCodeFromUrl, exchangeCodeForToken } from '../utils/spotify';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('spotify_token'));

    useEffect(() => {
        const handleAuthCode = async () => {
            const code = getCodeFromUrl();
            if (code) {
                try {
                    const accessToken = await exchangeCodeForToken(code);
                    setToken(accessToken);
                    localStorage.setItem('spotify_token', accessToken);
                    // Clean up the URL by removing the code parameter
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (error) {
                    console.error('Failed to exchange code for token:', error);
                }
            }
        };
        
        handleAuthCode();
    }, []);

    const logout = () => {
        setToken(null);
        localStorage.removeItem('spotify_token');
    };

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}