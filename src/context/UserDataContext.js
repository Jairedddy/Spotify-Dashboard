import React, { createContext, useState } from 'react';

export const UserDataContext = createContext();

export function UserDataProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [recentTracks, setRecentTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <UserDataContext.Provider
            value = {{
                profile,
                setProfile,
                topTracks,
                setTopTracks,
                topArtists,
                setTopArtists,
                recentTracks,
                setRecentTracks,
                loading,
                setLoading,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
}