import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserDataProvider, UserDataContext } from './context/UserDataContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Moodscape from './modules/Moodscape/Moodscape';
import Timeline from './modules/Timeline/Timeline';
import PlaylistDNA from './modules/PlaylistDNA/PlaylistDNA';
import Rituals from './modules/Rituals/Rituals';
import Collage from './modules/Collage/Collage';
import Stats from './modules/Stats/Stats';
import { fetchSpotify } from './utils/spotify';
import './styles/globals.css';

function AppContent() {
  const { token } = useContext(AuthContext);
  const {
    profile,
    setProfile,
    setTopTracks,
    setTopArtists,
    setRecentTracks,
    loading,
    setLoading,
  } = useContext(UserDataContext);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
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
      } catch (e) {
        // Token expired or error
        localStorage.removeItem('spotify_token');
        window.location.reload();
      } finally {
        setLoading(false);
      }
    }
    if (token && !profile) fetchData();
  }, [token, profile, setProfile, setTopTracks, setTopArtists, setRecentTracks, setLoading]);

  if (!token) return <Login />;
  if (loading || !profile) return <Loader />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, minHeight: '100vh', background: 'var(--background)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/moodscape" element={<Moodscape />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/playlist-dna" element={<PlaylistDNA />} />
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/collage" element={<Collage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserDataProvider>
          <Router>
            <AppContent />
          </Router>
        </UserDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}