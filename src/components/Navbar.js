import React, { useContext } from 'react';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { UserDataContext } from '../context/UserDataContext';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const { profile } = useContext(UserDataContext);

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5em 2.5em',
        background: 'rgba(35, 35, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(29, 185, 84, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 9,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Left side - App branding */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75em',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
        fontSize: '1.25em',
        letterSpacing: '-0.02em'
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--primary)',
          animation: 'pulse 2s infinite'
        }} />
        Spotify Dashboard
      </div>

      {/* Right side - User controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5em' }}>
        {profile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75em',
            padding: '0.5em 1em',
            background: 'rgba(29, 185, 84, 0.1)',
            borderRadius: '50px',
            border: '1px solid rgba(29, 185, 84, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={profile.images?.[0]?.url}
                alt="Avatar"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                background: 'var(--primary)',
                borderRadius: '50%',
                border: '2px solid var(--surface)',
                boxShadow: '0 0 0 2px var(--primary)'
              }} />
            </div>
            <span style={{ 
              fontWeight: 600, 
              color: 'var(--text)',
              fontSize: '0.95em'
            }}>
              {profile.display_name}
            </span>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
          <ThemeToggle />
          <button
            onClick={logout}
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '0.5em 1em',
              borderRadius: '25px',
              fontSize: '0.9em',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>🚪</span>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}