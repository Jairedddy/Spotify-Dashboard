import React, { useContext } from 'react';
import Card from '../components/Card';
import { UserDataContext } from '../context/UserDataContext';

export default function Profile() {
    const { profile } = useContext(UserDataContext);

    if (!profile) return null;

    return (
        <div style={{ padding: '2em', maxWidth: 700, margin: '0 auto' }}>
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
                <img
                    src={profile.images?.[0]?.url}
                    alt="Avatar"
                    style={{ width: 80, height: 80, borderRadius: '50%' }}
                />
                <div>
                    <h2 style={{ margin: 0 }}>{profile.display_name}</h2>
                    <p style={{ color: 'var(--muted)' }}>{profile.email}</p>
                    <p style={{ color: 'var(--muted)' }}>Country: {profile.country}</p>
                    <a href={profile.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    View on Spotify
                    </a>
                </div>
                </div>
            </Card>
        </div>
    );
}