import React from 'react';

export default function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'var(--primary)',
        fontSize: '2em',
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      Loading...
    </div>
  );
}