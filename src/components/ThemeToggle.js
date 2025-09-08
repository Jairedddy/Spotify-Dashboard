import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button 
            aria-label='Toggle Theme'
            onClick={toggleTheme}
            style={{
                position: 'relative',
                width: 60,
                height: 30,
                background: theme === 'dark' 
                    ? 'linear-gradient(135deg, #1e293b, #334155)' 
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: theme === 'dark' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 4px 12px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = theme === 'dark' 
                    ? '0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 6px 20px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = theme === 'dark' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 4px 12px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
        >
            {/* Background gradient overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme === 'dark' 
                    ? 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)' 
                    : 'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
                borderRadius: '25px'
            }} />
            
            {/* Toggle circle */}
            <div style={{
                position: 'absolute',
                top: 3,
                left: theme === 'dark' ? 33 : 3,
                width: 24,
                height: 24,
                background: theme === 'dark' 
                    ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' 
                    : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                borderRadius: '50%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
            }}>
                {theme === 'dark' ? '🌙' : '☀️'}
            </div>
            
            {/* Stars for dark mode */}
            {theme === 'dark' && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        width: 2,
                        height: 2,
                        background: '#e2e8f0',
                        borderRadius: '50%',
                        opacity: 0.8,
                        animation: 'twinkle 2s infinite'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 12,
                        right: 10,
                        width: 1.5,
                        height: 1.5,
                        background: '#cbd5e1',
                        borderRadius: '50%',
                        opacity: 0.6,
                        animation: 'twinkle 2s infinite 0.5s'
                    }} />
                </>
            )}
        </button>
    );
}