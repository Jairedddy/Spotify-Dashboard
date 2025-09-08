import React, { useContext, useMemo, useState, useEffect } from 'react';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';
import { fetchSpotify } from '../../utils/spotify';

export default function Timeline() {
  const { token } = useContext(AuthContext);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedDate, setExpandedDate] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    async function fetchRecentTracks() {
      if (!token) return;
      
      setLoading(true);
      try {
        const data = await fetchSpotify('me/player/recently-played', token, { limit: 50 });
        setRecentTracks(data.items || []);
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
        setRecentTracks([]);
      }
      setLoading(false);
    }
    fetchRecentTracks();
  }, [token]);

  // Group tracks by date
  const timelineData = useMemo(() => {
    const grouped = {};
    recentTracks.forEach(item => {
      if (!item.track) return;
      const date = new Date(item.played_at).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item.track);
    });
    
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .slice(0, 10); // Show last 10 days
  }, [recentTracks]);

  return (
    <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em' }}>
        Music Timeline
      </h2>
      <Card>
        <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
          Your recent listening history over the past week. Click on any track for detailed information.
        </div>
        
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2em',
            color: 'var(--primary)',
            fontSize: '1.1em'
          }}>
            🔄 Loading your listening history...
          </div>
        )}
        
        {!loading && timelineData.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2em',
            color: 'var(--muted)',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>🎵</div>
            <div style={{ fontWeight: 600, marginBottom: '0.5em' }}>No Recent Activity</div>
            <div style={{ fontSize: '0.9em' }}>
              Start listening to music on Spotify to see your timeline here.
            </div>
          </div>
        )}
        
        {!loading && timelineData.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {timelineData.map(([date, tracks], index) => (
              <div key={date} style={{
                borderLeft: '3px solid var(--primary)',
                paddingLeft: '1.5em',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '0',
                  width: '12px',
                  height: '12px',
                  background: 'var(--primary)',
                  borderRadius: '50%',
                  border: '3px solid var(--surface)'
                }} />
                
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '1.1em', 
                  marginBottom: '0.5em',
                  color: 'var(--text)'
                }}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                
                <div style={{ 
                  color: 'var(--muted)', 
                  fontSize: '0.9em', 
                  marginBottom: '1em' 
                }}>
                  {tracks.length} track{tracks.length !== 1 ? 's' : ''} played
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: 12 
                }}>
                  {tracks.slice(0, expandedDate === date ? tracks.length : 6).map((track, i) => (
                    <div 
                      key={track.id} 
                      onClick={() => setSelectedTrack(track)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        ':hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <img
                        src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}
                        alt={track.name}
                        style={{ 
                          width: 40, 
                          height: 40, 
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
                          {track.artists[0].name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {tracks.length > 6 && (
                  <button
                    onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      background: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '0.9em',
                      fontWeight: 600,
                      cursor: 'pointer',
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
                    {expandedDate === date ? 'Show Less' : `+${tracks.length - 6} more tracks`}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Track Detail Dialog */}
      {selectedTrack && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2em'
        }}
        onClick={() => setSelectedTrack(null)}
        >
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '2em',
            maxWidth: 500,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid rgba(29, 185, 84, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <img
                src={selectedTrack.album.images?.[1]?.url || selectedTrack.album.images?.[0]?.url}
                alt={selectedTrack.album.name}
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.3em', 
                  marginBottom: 4,
                  color: 'var(--text)'
                }}>
                  {selectedTrack.name}
                </h3>
                <div style={{ 
                  color: 'var(--muted)', 
                  fontSize: '1em',
                  marginBottom: 8
                }}>
                  by {selectedTrack.artists.map(a => a.name).join(', ')}
                </div>
                <div style={{ 
                  color: 'var(--primary)', 
                  fontSize: '0.9em',
                  fontWeight: 500
                }}>
                  from {selectedTrack.album.name}
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: 16,
              marginBottom: 20
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Popularity</div>
                <div style={{ fontSize: '1.5em', color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedTrack.popularity}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Duration</div>
                <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 700 }}>
                  {Math.round(selectedTrack.duration_ms / 60000)}m
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Release</div>
                <div style={{ fontSize: '1.5em', color: '#f59e42', fontWeight: 700 }}>
                  {new Date(selectedTrack.album.release_date).getFullYear()}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Album Details</div>
              <div style={{ 
                padding: 12, 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ marginBottom: 4 }}>
                  <strong>Album:</strong> {selectedTrack.album.name}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Release Date:</strong> {new Date(selectedTrack.album.release_date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total Tracks:</strong> {selectedTrack.album.total_tracks}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedTrack(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '1em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#16a34a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}