import React from 'react';
import { NavLink } from 'react-router-dom';
// Spotify logo as SVG component
const SpotifyLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#1db954">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const modules = [
    { path: '/', label: 'Dashboard' },
    { path: '/stats', label: 'Music Stats' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/collage', label: 'Collage' },
    { path: '/playlist-dna', label: 'Playlist DNA' },
    { path: '/moodscape', label: 'Moodscape' },
];

export default function Sidebar() {
    return (
        <aside
            style={{
                width: 240,
                background: 'rgba(35, 35, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(29, 185, 84, 0.1)',
                minHeight: '100vh',
                padding: '2em 1.5em 1em 1.5em',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5em',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 10,
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
            }}
            >
            {/* Logo section */}
            <div style={{ 
                marginBottom: '2.5em',
                padding: '1em',
                background: 'rgba(29, 185, 84, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(29, 185, 84, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
              <SpotifyLogo />
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                {modules.map((mod) => (
                    <NavLink
                    key={mod.path}
                    to={mod.path}
                    end={mod.path === '/'}
                    style={({ isActive }) => ({
                        color: isActive ? 'var(--primary)' : 'var(--muted)',
                        fontWeight: isActive ? 600 : 500,
                        textDecoration: 'none',
                        padding: '0.875em 1.25em',
                        borderRadius: '12px',
                        background: isActive 
                            ? 'linear-gradient(135deg, rgba(29,185,84,0.15), rgba(29,185,84,0.08))' 
                            : 'transparent',
                        border: isActive 
                            ? '1px solid rgba(29,185,84,0.2)' 
                            : '1px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75em',
                        fontSize: '0.95em',
                        letterSpacing: '0.01em',
                        transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                        boxShadow: isActive 
                            ? '0 4px 12px rgba(29, 185, 84, 0.2)' 
                            : 'none'
                    })}
                    children={({ isActive }) => (
                        <>
                            {/* Active indicator */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 3,
                                    height: 20,
                                    background: 'var(--primary)',
                                    borderRadius: '0 2px 2px 0',
                                    boxShadow: '0 0 8px rgba(29, 185, 84, 0.5)'
                                }} />
                            )}
                            
                            {/* Icon for each nav item */}
                 <span style={{
                     fontSize: '1.1em',
                     opacity: 0.8,
                     transition: 'opacity 0.3s ease'
                 }}>
                     {mod.path === '/' && '📊'}
                     {mod.path === '/stats' && '📈'}
                     {mod.path === '/timeline' && '⏰'}
                     {mod.path === '/collage' && '🖼️'}
                     {mod.path === '/playlist-dna' && '🧬'}
                     {mod.path === '/moodscape' && '🌊'}
                 </span>
                            
                            {mod.label}
                        </>
                    )}
                    onMouseEnter={(e) => {
                        if (!e.target.style.background.includes('rgba(29,185,84')) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                            e.target.style.transform = 'translateX(2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!e.target.style.background.includes('rgba(29,185,84')) {
                            e.target.style.background = 'transparent';
                            e.target.style.border = '1px solid transparent';
                            e.target.style.transform = 'translateX(0)';
                        }
                    }}
                    />
                ))}
            </nav>

            {/* Bottom section */}
            <div style={{ 
                marginTop: 'auto',
                padding: '1.5em 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '0.8em',
                    color: 'var(--muted)',
                    opacity: 0.6
                }}>
                    Made with ❤️
                </div>
            </div>
            </aside>
    );
}