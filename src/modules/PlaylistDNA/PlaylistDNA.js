import React, { useContext, useEffect, useState } from 'react';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import { fetchSpotify } from '../../utils/spotify';

function getRandomColor(i) {
  const colors = [
    '#1db954', '#3b82f6', '#f59e42', '#e11d48', '#a21caf', '#10b981', '#fbbf24'
  ];
  return colors[i % colors.length];
}

function calculatePlaylistStats(tracks) {
  if (tracks.length === 0) return null;

  // Calculate total duration
  const totalDurationMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
  const totalDurationMinutes = Math.round(totalDurationMs / 60000);
  const hours = Math.floor(totalDurationMinutes / 60);
  const minutes = totalDurationMinutes % 60;

  // Calculate average release year and era
  const releaseYears = tracks.map(track => new Date(track.album.release_date).getFullYear());
  const avgReleaseYear = Math.round(releaseYears.reduce((sum, year) => sum + year, 0) / releaseYears.length);
  
  const getEra = (year) => {
    if (year < 1970) return 'Pre-70s';
    if (year < 1980) return '70s';
    if (year < 1990) return '80s';
    if (year < 2000) return '90s';
    if (year < 2010) return '2000s';
    if (year < 2020) return '2010s';
    return '2020s';
  };

  // Artist mapping with track details
  const artistData = {};
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      if (!artistData[artist.name]) {
        artistData[artist.name] = {
          count: 0,
          tracks: [],
          id: artist.id,
          external_urls: artist.external_urls
        };
      }
      artistData[artist.name].count += 1;
      artistData[artist.name].tracks.push(track);
    });
  });
  const sortedArtists = Object.entries(artistData)
    .sort((a, b) => b[1].count - a[1].count);

  // Album mapping
  const albumCounts = {};
  tracks.forEach(track => {
    const albumName = track.album.name;
    albumCounts[albumName] = (albumCounts[albumName] || 0) + 1;
  });
  const sortedAlbums = Object.entries(albumCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Genre analysis
  const genreCounts = {};
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      (artist.genres || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
  });
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Popularity analysis
  const avgPopularity = Math.round(tracks.reduce((sum, track) => sum + track.popularity, 0) / tracks.length);
  const mostPopular = tracks.reduce((max, track) => track.popularity > max.popularity ? track : max, tracks[0]);
  const leastPopular = tracks.reduce((min, track) => track.popularity < min.popularity ? track : min, tracks[0]);

  // Track length analysis
  const avgTrackLength = Math.round(tracks.reduce((sum, track) => sum + track.duration_ms, 0) / tracks.length / 60000);
  const longestTrack = tracks.reduce((max, track) => track.duration_ms > max.duration_ms ? track : max, tracks[0]);
  const shortestTrack = tracks.reduce((min, track) => track.duration_ms < min.duration_ms ? track : min, tracks[0]);

  return {
    totalTracks: tracks.length,
    totalDuration: { hours, minutes, totalMinutes: totalDurationMinutes },
    avgReleaseYear,
    era: getEra(avgReleaseYear),
    artistData: sortedArtists,
    albumCounts: sortedAlbums,
    genreCounts: sortedGenres,
    avgPopularity,
    mostPopular,
    leastPopular,
    avgTrackLength,
    longestTrack,
    shortestTrack
  };
}

export default function PlaylistDNA() {
  const { token } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlaylists() {
      if (!token) {
        console.log('No token available for fetching playlists');
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching playlists with token:', token.substring(0, 10) + '...');
        const data = await fetchSpotify('me/playlists', token, { limit: 50 });
        console.log('Playlists data received:', data);
        setPlaylists(data.items || []);
      } catch(error) {
        console.error('Error fetching playlists:', error);
        console.error('Error details:', error.message);
        setPlaylists([]);
      }
      setLoading(false);
    }
    fetchPlaylists();
  }, [token]);

  const [audioFeatures, setAudioFeatures] = useState([]);
  const [expandedArtist, setExpandedArtist] = useState(null);

  useEffect(() => {
    async function fetchTracks() {
      if (!selected) return;
      setLoading(true);
      try {
        console.log('Fetching playlist tracks for playlist:', selected);
        const data = await fetchSpotify(`playlists/${selected}/tracks`, token, { limit: 20 });
        const trackList = data.items.map(item => item.track).filter(track => track && track.id);
        setTracks(trackList);
        console.log('Found tracks:', trackList.length);
        
        // Calculate playlist statistics from available track data
        if (trackList.length > 0) {
          const stats = calculatePlaylistStats(trackList);
          setAudioFeatures([stats]); // Store as single object for compatibility
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setTracks([]);
        setAudioFeatures([]);
      }
      setLoading(false);
    }
    if (selected && token) fetchTracks();
  }, [selected, token]);

  const stats = audioFeatures.length > 0 && tracks.length > 0 ? audioFeatures[0] : null;

    return (
      <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em' }}>
          Playlist Analyzer
        </h2>
        <Card>
          <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
            Select a playlist to see detailed statistics including artist distribution, duration, era, and more.
          </div>
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2em',
              color: 'var(--primary)',
              fontSize: '1.1em'
            }}>
              🔄 Loading your playlists...
            </div>
          )}
          
          {!loading && playlists.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2em',
              color: 'var(--muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>🎵</div>
              <div style={{ fontWeight: 600, marginBottom: '0.5em' }}>No playlists found</div>
              <div style={{ fontSize: '0.9em' }}>
                Make sure you have playlists in your Spotify account and that the app has permission to read them.
              </div>
            </div>
          )}
          
          {!loading && playlists.length > 0 && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              {playlists.map((pl, i) => (
                <div
                  key={pl.id}
                  onClick={() => setSelected(pl.id)}
                  style={{
                    cursor: 'pointer',
                    border: selected === pl.id ? `2px solid var(--primary)` : '2px solid var(--border)',
                    borderRadius: 10,
                    padding: 8,
                    background: selected === pl.id ? 'var(--primary)' : 'var(--surface)',
                    color: selected === pl.id ? 'var(--surface)' : 'var(--text)',
                    minWidth: 120,
                    textAlign: 'center',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  <img
                    src={pl.images?.[0]?.url}
                    alt={pl.name}
                    style={{ width: 48, height: 48, borderRadius: 8, marginBottom: 6 }}
                  />
                  <div style={{ fontWeight: 600, fontSize: '0.98em' }}>{pl.name}</div>
                </div>
              ))}
            </div>
          )}
          {selected && tracks.length > 0 && (
            <div style={{ marginTop: 24 }}>
              {stats ? (
                <div>
                  {/* Overview Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginBottom: 32 }}>
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(29, 185, 84, 0.1)', borderRadius: 12, border: '1px solid rgba(29, 185, 84, 0.2)' }}>
                      <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>🎵</div>
                      <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Total Tracks</div>
                      <div style={{ fontSize: '2em', color: 'var(--primary)', fontWeight: 700 }}>{stats.totalTracks}</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>⏱️</div>
                      <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Duration</div>
                      <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 700 }}>
                        {stats.totalDuration.hours > 0 ? `${stats.totalDuration.hours}h ` : ''}{stats.totalDuration.minutes}m
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(245, 158, 66, 0.1)', borderRadius: 12, border: '1px solid rgba(245, 158, 66, 0.2)' }}>
                      <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>📅</div>
                      <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Era</div>
                      <div style={{ fontSize: '1.5em', color: '#f59e42', fontWeight: 700 }}>{stats.era}</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(225, 29, 72, 0.1)', borderRadius: 12, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
                      <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>📊</div>
                      <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Avg Popularity</div>
                      <div style={{ fontSize: '1.5em', color: '#e11d48', fontWeight: 700 }}>{stats.avgPopularity}</div>
                    </div>
                  </div>

                  {/* Enhanced Artist Distribution */}
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontWeight: 600, fontSize: '1.3em', marginBottom: 16, color: 'var(--text)' }}>
                      All Artists ({stats.artistData.length} unique)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                      {stats.artistData.map(([artistName, artistInfo], i) => (
                        <div key={artistName} style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 12,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease'
                        }}>
                          {/* Artist Header */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            cursor: 'pointer',
                            background: expandedArtist === artistName ? 'rgba(29, 185, 84, 0.1)' : 'transparent'
                          }}
                          onClick={() => setExpandedArtist(expandedArtist === artistName ? null : artistName)}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontWeight: 600, 
                                fontSize: '1.1em',
                                color: expandedArtist === artistName ? 'var(--primary)' : 'var(--text)',
                                marginBottom: 4
                              }}>
                                {artistName}
                              </div>
                              <div style={{ 
                                color: 'var(--muted)', 
                                fontSize: '0.9em' 
                              }}>
                                {artistInfo.count} track{artistInfo.count !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div style={{ 
                              background: getRandomColor(i), 
                              color: '#fff', 
                              padding: '6px 12px', 
                              borderRadius: 8, 
                              fontSize: '0.9em',
                              fontWeight: 600,
                              marginLeft: 12
                            }}>
                              {artistInfo.count}
                            </div>
                            <div style={{ 
                              marginLeft: 12,
                              fontSize: '1.2em',
                              transform: expandedArtist === artistName ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}>
                              ▼
                            </div>
                          </div>
                          
                          {/* Expanded Content */}
                          {expandedArtist === artistName && (
                            <div style={{ 
                              padding: '16px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                              background: 'rgba(0, 0, 0, 0.1)'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: 12
                              }}>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Tracks in this playlist:</span>
                                {artistInfo.external_urls?.spotify && (
                                  <a
                                    href={artistInfo.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: 'var(--primary)',
                                      color: '#fff',
                                      padding: '6px 12px',
                                      borderRadius: 6,
                                      textDecoration: 'none',
                                      fontSize: '0.9em',
                                      fontWeight: 600,
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#16a34a';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = 'var(--primary)';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    View on Spotify
                                  </a>
                                )}
                              </div>
                              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                {artistInfo.tracks.map((track, trackIndex) => (
                                  <div key={track.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '8px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 6,
                                    marginBottom: 6,
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                  }}>
                                    <img
                                      src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}
                                      alt={track.name}
                                      style={{ 
                                        width: 32, 
                                        height: 32, 
                                        borderRadius: 4,
                                        objectFit: 'cover'
                                      }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ 
                                        fontWeight: 500, 
                                        fontSize: '0.9em',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {track.name}
                                      </div>
                                      <div style={{ 
                                        color: 'var(--muted)', 
                                        fontSize: '0.8em',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {track.album.name} • {new Date(track.album.release_date).getFullYear()}
                                      </div>
                                    </div>
                                    <div style={{ 
                                      color: 'var(--muted)', 
                                      fontSize: '0.8em',
                                      fontWeight: 500
                                    }}>
                                      {Math.round(track.duration_ms / 60000)}m
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Genre Distribution */}
                  {stats.genreCounts.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <h3 style={{ fontWeight: 600, fontSize: '1.3em', marginBottom: 16, color: 'var(--text)' }}>Genres</h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {stats.genreCounts.map(([genre, count], i) => (
                          <span
                            key={genre}
                            style={{
                              background: getRandomColor(i),
                              color: '#fff',
                              borderRadius: 8,
                              padding: '6px 12px',
                              fontSize: '0.95em',
                              fontWeight: 600,
                            }}
                          >
                            {genre} ({count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Track Highlights */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                    <div style={{ padding: '1.5em', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <h4 style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>Most Popular Track</h4>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{stats.mostPopular.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>by {stats.mostPopular.artists[0].name}</div>
                      <div style={{ color: '#10b981', fontSize: '0.9em', marginTop: 4 }}>Popularity: {stats.mostPopular.popularity}</div>
                    </div>
                    
                    <div style={{ padding: '1.5em', background: 'rgba(162, 28, 175, 0.1)', borderRadius: 12, border: '1px solid rgba(162, 28, 175, 0.2)' }}>
                      <h4 style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>Longest Track</h4>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{stats.longestTrack.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>by {stats.longestTrack.artists[0].name}</div>
                      <div style={{ color: '#a21caf', fontSize: '0.9em', marginTop: 4 }}>
                        {Math.round(stats.longestTrack.duration_ms / 60000)} minutes
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2em',
                  color: 'var(--muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: 24
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>🎵</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.5em' }}>Playlist Analysis Unavailable</div>
                  <div style={{ fontSize: '0.9em' }}>
                    Unable to analyze this playlist. Make sure the playlist has tracks and try again.
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
}