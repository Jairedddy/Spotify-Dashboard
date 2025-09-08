import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import { UserDataContext } from '../context/UserDataContext';
import { AuthContext } from '../context/AuthContext';
import { fetchSpotify } from '../utils/spotify';

export default function Dashboard() {
    const { 
        profile, 
        topTracks, 
        topArtists, 
        recentTracks, 
        loading,
        setProfile,
        setTopTracks,
        setTopArtists,
        setRecentTracks,
        setLoading
    } = useContext(UserDataContext);
    const { token } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (!token || refreshing) return;
        
        setRefreshing(true);
        setLoading(true);
        
        try {
            const [profileData, topTracksData, topArtistsData, recentData] = await Promise.all([
                fetchSpotify('me', token),
                fetchSpotify('me/top/tracks', token, { limit: 10, time_range: 'short_term' }),
                fetchSpotify('me/top/artists', token, { limit: 10, time_range: 'short_term' }),
                fetchSpotify('me/player/recently-played', token, { limit: 10 }),
            ]);
            
            setProfile(profileData);
            setTopTracks(topTracksData.items);
            setTopArtists(topArtistsData.items);
            setRecentTracks(recentData.items);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) return null;

    return (
        <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
                <h2 style={{ fontWeight: 700, fontSize: '2em', margin: 0 }}>
                    Welcome, {profile?.display_name}
                </h2>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{
                        background: refreshing ? 'rgba(29, 185, 84, 0.5)' : 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        fontSize: '0.9em',
                        fontWeight: 600,
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        opacity: refreshing ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!refreshing) {
                            e.target.style.background = '#16a34a';
                            e.target.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!refreshing) {
                            e.target.style.background = 'var(--primary)';
                            e.target.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    {refreshing ? '🔄' : '🔄'} {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            <div style={{ display: 'flex', gap: '2em', flexWrap: 'wrap' }}>
                <Card style={{ flex: 1, minWidth: 220}}>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.1em' }}>Top Artists</h3>
                    {topArtists[0] && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '1em'}}>
                            <img 
                                src={topArtists[0].images?.[0]?.url}
                                alt={topArtists[0].name}
                                style={{ width: 48, height: 48, borderRadius: '50%' }}
                            />
                            <span>{topArtists[0].name}</span>
                        </div>
                    )}
                </Card>
                <Card style={{ flex: 1, minWidth: 220 }}>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.1em' }}>Recent Track</h3>
                    {recentTracks[0]?.track && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '1em' }}>
                            <img 
                                src={recentTracks[0].track.album.images?.[0]?.url}
                                alt={recentTracks[0].track.name}
                                style={{ width: 48, height: 48, borderRadius: 8 }}
                            />
                            <span>{recentTracks[0].track.name}</span>
                        </div>
                    )}
                </Card>
            </div>
            <div style={{ marginTop: '2em', color: 'var(--muted)', fontSize: '1em' }}>
                <span>
                    Explore your musical world using the sidebar modules. Use the refresh button to get the latest data from Spotify.
                </span>
            </div>
        </div>
    );
}