import React, { useContext, useMemo } from 'react';
import Card from '../../components/Card';
import { UserDataContext } from '../../context/UserDataContext';

export default function Stats() {
  const { topTracks } = useContext(UserDataContext);

  const stats = useMemo(() => {
    if (topTracks.length === 0) return null;

    // Calculate average popularity
    const avgPopularity = topTracks.reduce((sum, track) => sum + track.popularity, 0) / topTracks.length;
    
    // Find most popular track
    const mostPopular = topTracks.reduce((max, track) => 
      track.popularity > max.popularity ? track : max, topTracks[0]);
    
    // Find oldest and newest tracks
    const tracksWithYears = topTracks.map(track => ({
      ...track,
      year: new Date(track.album.release_date).getFullYear()
    }));
    
    const oldest = tracksWithYears.reduce((oldest, track) => 
      track.year < oldest.year ? track : oldest, tracksWithYears[0]);
    
    const newest = tracksWithYears.reduce((newest, track) => 
      track.year > newest.year ? track : newest, tracksWithYears[0]);
    
    // Calculate decade distribution
    const decades = {};
    tracksWithYears.forEach(track => {
      const decade = Math.floor(track.year / 10) * 10;
      decades[decade] = (decades[decade] || 0) + 1;
    });
    
    const topDecade = Object.entries(decades).sort((a, b) => b[1] - a[1])[0];
    
    // Calculate artist diversity
    const uniqueArtists = new Set(topTracks.map(track => track.artists[0].id)).size;
    const diversityScore = Math.round((uniqueArtists / topTracks.length) * 100);
    
    return {
      avgPopularity: Math.round(avgPopularity),
      mostPopular,
      oldest,
      newest,
      topDecade,
      diversityScore,
      totalTracks: topTracks.length,
      uniqueArtists
    };
  }, [topTracks]);

  return (
    <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em' }}>
        Music Statistics
      </h2>
      <Card>
        <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
          Insights about your music taste and listening patterns.
        </div>
        
        {!stats && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2em',
            color: 'var(--muted)',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>📊</div>
            <div style={{ fontWeight: 600, marginBottom: '0.5em' }}>No Data Available</div>
            <div style={{ fontSize: '0.9em' }}>
              Connect your Spotify account to see your music statistics.
            </div>
          </div>
        )}
        
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {/* Average Popularity */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(29, 185, 84, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(29, 185, 84, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Avg Popularity</div>
              <div style={{ fontSize: '2em', color: 'var(--primary)', fontWeight: 700 }}>
                {stats.avgPopularity}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>out of 100</div>
            </div>
            
            {/* Artist Diversity */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Artist Diversity</div>
              <div style={{ fontSize: '2em', color: 'var(--accent)', fontWeight: 700 }}>
                {stats.diversityScore}%
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                {stats.uniqueArtists} unique artists
              </div>
            </div>
            
            {/* Top Decade */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(245, 158, 66, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(245, 158, 66, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Favorite Decade</div>
              <div style={{ fontSize: '2em', color: '#f59e42', fontWeight: 700 }}>
                {stats.topDecade[0]}s
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                {stats.topDecade[1]} tracks
              </div>
            </div>
            
            {/* Most Popular Track */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(225, 29, 72, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(225, 29, 72, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Most Popular</div>
              <div style={{ fontSize: '1.1em', color: '#e11d48', fontWeight: 600, marginBottom: '0.5em' }}>
                {stats.mostPopular.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                by {stats.mostPopular.artists[0].name}
              </div>
            </div>
            
            {/* Oldest Track */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Oldest Track</div>
              <div style={{ fontSize: '1.1em', color: '#10b981', fontWeight: 600, marginBottom: '0.5em' }}>
                {stats.oldest.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                from {stats.oldest.year}
              </div>
            </div>
            
            {/* Newest Track */}
            <div style={{
              padding: '1.5em',
              background: 'rgba(162, 28, 175, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(162, 28, 175, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Newest Track</div>
              <div style={{ fontSize: '1.1em', color: '#a21caf', fontWeight: 600, marginBottom: '0.5em' }}>
                {stats.newest.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>
                from {stats.newest.year}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
