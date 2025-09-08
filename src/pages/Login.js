import React from 'react';
import Button from '../components/Button';
import { getAuthUrl } from '../utils/spotify';

export default function Login() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(29, 185, 84, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: 150,
        height: 150,
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '5%',
        width: 100,
        height: 100,
        background: 'radial-gradient(circle, rgba(29, 185, 84, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite'
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '3em 2em',
        background: 'rgba(35, 35, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(29, 185, 84, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        maxWidth: 500,
        width: '90%'
      }}>
        {/* Logo/Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75em',
          marginBottom: '1.5em'
        }}>
          <div style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 8px 25px rgba(29, 185, 84, 0.3)'
          }}>
            🎵
          </div>
          <h1 style={{ 
            fontWeight: 800, 
            fontSize: '2.5em',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Spotify Dashboard
          </h1>
        </div>

        <p style={{ 
          color: 'var(--muted)', 
          marginBottom: '2.5em', 
          fontSize: '1.1em',
          lineHeight: '1.6',
          fontWeight: 400
        }}>
          Visualize your Spotify journey with interactive, data-driven insights. 
          <br />
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Log in to begin your musical exploration.
          </span>
        </p>

        <Button 
          onClick={() => window.location = getAuthUrl()}
          style={{
            fontSize: '1.1em',
            padding: '1em 2.5em',
            position: 'relative'
          }}
        >
          <span style={{ marginRight: '0.5em' }}>🎧</span>
          Log in with Spotify
        </Button>

        {/* Feature highlights */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2em',
          marginTop: '2em',
          fontSize: '0.9em',
          color: 'var(--muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <span>📊</span>
            <span>Analytics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <span>🎨</span>
            <span>Visualizations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <span>🔍</span>
            <span>Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}