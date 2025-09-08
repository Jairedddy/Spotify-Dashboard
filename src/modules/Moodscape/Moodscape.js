import React, { useContext, useMemo, useState } from 'react';
import Card from '../../components/Card';
import { UserDataContext } from '../../context/UserDataContext';

function mapRange(val, a, b, c, d) {
    return ((val-a) * (d-c)) / (b-a) + c;
}

function moodColor(valence) {
    const hue = mapRange(valence, 0, 1, 220, 90);
    return `hsl(${hue}, 70%, 60%)`;
}

export default function MoodScape() {
    const { topTracks } = useContext(UserDataContext);
    const [hoverIdx, setHoverIdx] = useState(null);

    // Create a moodscape based on track popularity and release date
    const features = useMemo(() => {
        return topTracks.slice(0, 20).map((track, i) => {
            // Use popularity as energy (0-100 scale, normalize to 0-1)
            const energy = track.popularity / 100;
            
            // Use track position in list as valence (earlier tracks = more positive)
            const valence = 1 - (i / 20);
            
            // Use album release year for acousticness (older = more acoustic feel)
            const releaseYear = new Date(track.album.release_date).getFullYear();
            const acousticness = Math.max(0, (2020 - releaseYear) / 50); // Normalize based on years from 2020
            
            // Calculate tempo based on track duration (shorter = higher tempo feel)
            const tempo = Math.max(0.3, Math.min(1, 4 - (track.duration_ms / 60000) / 60));
            
            // Calculate loudness based on popularity and release year
            const loudness = Math.min(1, (energy + (releaseYear - 1990) / 100) * 0.8);
            
            return {
                ...track,
                energy,
                valence,
                acousticness,
                danceability: energy * 0.8 + 0.2, // Correlate with energy
                tempo,
                loudness,
                releaseYear,
            };
        });
    }, [topTracks]);

    // Calculate mood statistics
    const moodStats = useMemo(() => {
        if (features.length === 0) return null;
        
        const avgEnergy = features.reduce((sum, f) => sum + f.energy, 0) / features.length;
        const avgValence = features.reduce((sum, f) => sum + f.valence, 0) / features.length;
        const avgTempo = features.reduce((sum, f) => sum + f.tempo, 0) / features.length;
        
        // Determine dominant mood
        const getMood = (valence, energy) => {
            if (valence > 0.7 && energy > 0.7) return { name: 'Energetic & Happy', color: '#10b981', emoji: '🎉' };
            if (valence > 0.7 && energy < 0.3) return { name: 'Calm & Peaceful', color: '#3b82f6', emoji: '😌' };
            if (valence < 0.3 && energy > 0.7) return { name: 'Intense & Dark', color: '#e11d48', emoji: '🔥' };
            if (valence < 0.3 && energy < 0.3) return { name: 'Melancholic', color: '#6b7280', emoji: '😔' };
            if (valence > 0.5) return { name: 'Positive Vibes', color: '#f59e42', emoji: '😊' };
            return { name: 'Neutral', color: '#8b5cf6', emoji: '😐' };
        };
        
        const dominantMood = getMood(avgValence, avgEnergy);
        
        // Era analysis
        const eras = features.reduce((acc, f) => {
            const decade = Math.floor(f.releaseYear / 10) * 10;
            acc[decade] = (acc[decade] || 0) + 1;
            return acc;
        }, {});
        
        const dominantEra = Object.entries(eras).sort((a, b) => b[1] - a[1])[0];
        
        return {
            avgEnergy: Math.round(avgEnergy * 100),
            avgValence: Math.round(avgValence * 100),
            avgTempo: Math.round(avgTempo * 100),
            dominantMood,
            dominantEra: dominantEra ? `${dominantEra[0]}s` : 'Unknown',
            totalTracks: features.length,
        };
    }, [features]);

    const points = features.length > 0 ? features.map((f, i) => {
        if (!f || f.energy === undefined || f.valence === undefined) return null;
        const x = mapRange(i, 0, features.length - 1, 40, 560);
        const y = mapRange(f.energy, 0, 1, 220, 60);
        return { x, y, valence: f.valence, tempo: f.tempo, loudness: f.loudness, track: f};
    }).filter(Boolean) : [];

    return (
        <div style={{ padding: '2em', maxWidth: 1200, margin: '0 auto'}}>
            <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em'}}>
                Music Moodscape
            </h2>
            
            {/* Mood Statistics */}
            {moodStats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(29, 185, 84, 0.1)', borderRadius: 12, border: '1px solid rgba(29, 185, 84, 0.2)' }}>
                        <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>{moodStats.dominantMood.emoji}</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Dominant Mood</div>
                        <div style={{ fontSize: '1.2em', color: moodStats.dominantMood.color, fontWeight: 700 }}>{moodStats.dominantMood.name}</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>⚡</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Avg Energy</div>
                        <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 700 }}>{moodStats.avgEnergy}%</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(245, 158, 66, 0.1)', borderRadius: 12, border: '1px solid rgba(245, 158, 66, 0.2)' }}>
                        <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>😊</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Avg Positivity</div>
                        <div style={{ fontSize: '1.5em', color: '#f59e42', fontWeight: 700 }}>{moodStats.avgValence}%</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '1.5em', background: 'rgba(225, 29, 72, 0.1)', borderRadius: 12, border: '1px solid rgba(225, 29, 72, 0.2)' }}>
                        <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>🎵</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: '0.5em' }}>Dominant Era</div>
                        <div style={{ fontSize: '1.5em', color: '#e11d48', fontWeight: 700 }}>{moodStats.dominantEra}</div>
                    </div>
                </div>
            )}
            
            <Card>
                <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
                    Your top tracks visualized as an emotional landscape. Height represents energy, color represents mood valence, and position shows your listening patterns.
                </div>
                <div style={{ width: 600, height: 260, margin: '0 auto', position: 'relative' }}>
                    {points.length > 0 ? (
                        <svg width="600" height="240" style={{ width: '100%', borderRadius: 16, background: 'var(--background)' }}>
                            {/*landscape path */}
                            <polyline
                                fill='none'
                                stroke='var(--primary)'
                                strokeWidth="3"
                                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                            />
                            {/* Mood gradient under landscape */}
                            <defs>
                                <linearGradient id="moodscape" x1="0" y1="0" x2="600" y2="0">
                                    {points.map((p, i) => (
                                        <stop
                                            key={i}
                                            offset={`${(i/(points.length - 1)) * 100}%`}
                                            stopColor={moodColor(p.valence)}
                                        />
                                    ))}
                                </linearGradient>
                            </defs>
                            <polygon
                                points={
                                    [
                                        ...points.map(p => `${p.x},${p.y}`),
                                        `${points[points.length - 1].x}, 240`,
                                        `${points[0].x}, 240`
                                    ].join(' ')
                                }
                                fill='url(#moodscape)'
                                opacity='0.5'
                            />
                            {/* Track points */}
                            {points.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r={hoverIdx === i? 10 : 7}
                                    fill={moodColor(p.valence)}
                                    stroke='var(--surface)'
                                    strokeWidth={hoverIdx === i ? 3 : 2}
                                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                                    onMouseEnter={() => setHoverIdx(i)}
                                    onMouseLeave={() => setHoverIdx(null)}
                                />
                            ))}
                        </svg>
                    ) : (
                        <div style={{ 
                            width: '100%', 
                            height: 240, 
                            borderRadius: 16, 
                            background: 'var(--background)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--muted)',
                            fontSize: '1.1em',
                            border: '2px dashed var(--border)'
                        }}>
                            {'🎵 No audio data available'}
                        </div>
                    )}
                    {/* Enhanced Tooltip  */}
                    {hoverIdx !== null && points.length > 0 && features[hoverIdx] && (
                        <div
                            style={{
                                position: 'absolute',
                                left: points[hoverIdx].x - 120,
                                top: points[hoverIdx].y - 120,
                                width: 240,
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                borderRadius: 12,
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                padding: '1em',
                                fontSize: '0.9em',
                                pointerEvents: 'none',
                                zIndex: 2,
                                border: '1px solid rgba(29, 185, 84, 0.2)',
                            }}
                        >
                            <div style={{ fontWeight: 600, fontSize: '1em', marginBottom: 8, color: 'var(--primary)' }}>
                                {features[hoverIdx].name}
                            </div>
                            <div style={{ color: 'var(--muted)', marginBottom: 8 }}>
                                by {features[hoverIdx].artists[0].name}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85em' }}>
                                <div>
                                    <div style={{ color: 'var(--muted)' }}>Energy</div>
                                    <div style={{ color: '#10b981', fontWeight: 600 }}>{Math.round(features[hoverIdx].energy * 100)}%</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--muted)' }}>Mood</div>
                                    <div style={{ color: '#f59e42', fontWeight: 600 }}>{Math.round(features[hoverIdx].valence * 100)}%</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--muted)' }}>Popularity</div>
                                    <div style={{ color: '#3b82f6', fontWeight: 600 }}>{features[hoverIdx].popularity}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--muted)' }}>Release</div>
                                    <div style={{ color: '#e11d48', fontWeight: 600 }}>{features[hoverIdx].releaseYear}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '1.5em', color: 'var(--muted)', fontSize: '0.95em' }}>
                    <strong>How to read this landscape:</strong> Height represents track energy/popularity, color shows mood valence (green=positive, red=negative), 
                    and position reflects your listening patterns. Hover over points for detailed track information.
                </div>
            </Card>
        </div>
    );
}