import React from 'react';

export default function Button({ children, onClick, style, variant = 'primary', ...props}) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: 'var(--accent)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                };
            case 'ghost':
                return {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                };
            default:
                return {
                    background: 'linear-gradient(135deg, var(--primary), #16a34a)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)'
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <button 
            onClick={onClick}
            style={{
                position: 'relative',
                padding: '0.875em 2em',
                fontWeight: 600,
                fontSize: '1em',
                cursor: 'pointer',
                borderRadius: '50px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5em',
                letterSpacing: '0.02em',
                ...variantStyles,
                ...style,
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = variant === 'primary' 
                    ? '0 8px 25px rgba(29, 185, 84, 0.4)' 
                    : variant === 'secondary'
                    ? '0 8px 25px rgba(59, 130, 246, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = variantStyles.boxShadow;
            }}
            {...props}
        >
            {/* Shimmer effect overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s ease',
            }} 
            onMouseEnter={(e) => {
                e.target.style.left = '100%';
            }}
            onMouseLeave={(e) => {
                e.target.style.left = '-100%';
            }}
            />
            
            {/* Button content */}
            <span style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </span>
        </button>
    );
}