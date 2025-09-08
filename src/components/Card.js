import React from 'react';

export default function Card({ children, style, ...props }) {
    return (
        <div 
            style= {{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '1.5em',
                margin: '1em 0',
                border: '1px solid var(--border)',
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}